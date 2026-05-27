import { createClient } from 'jsr:@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;

Deno.serve(async () => {
  const now = new Date();
  const currentHour = now.getUTCHours();
  const currentDay = now.getUTCDay(); // 0 = Sunday

  // Find users who have reminders enabled for this hour and day, and haven't studied today
  const today = now.toISOString().slice(0, 10);

  const { data: users, error } = await supabase
    .from('reminder_settings')
    .select(`
      user_id,
      reminder_hour,
      reminder_days,
      profiles!inner(last_active_date),
      auth.users!inner(email)
    `)
    .eq('email_enabled', true)
    .eq('reminder_hour', currentHour)
    .contains('reminder_days', [currentDay]);

  if (error) {
    console.error('Failed to fetch reminder users:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  let sent = 0;
  let skipped = 0;

  for (const u of users ?? []) {
    const lastActive = u.profiles?.last_active_date;
    if (lastActive === today) {
      skipped++;
      continue; // already studied today
    }

    const email = u['auth.users']?.email;
    if (!email) continue;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Thai Study <reminders@yourdomain.com>',
        to: email,
        subject: 'เวลาเรียนภาษาไทย — Time to practice Thai!',
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
            <h2 style="font-size: 22px; color: #1a1a1a;">สวัสดี! 👋</h2>
            <p style="color: #555; font-size: 15px; line-height: 1.6;">
              You haven't studied Thai today yet. Even just 5 minutes of flashcards keeps your streak alive and builds long-term memory.
            </p>
            <a href="https://your-app-url.com/#cards"
               style="display: inline-block; margin-top: 16px; padding: 12px 24px; background: #f59e0b; color: #111; border-radius: 8px; text-decoration: none; font-weight: 600;">
              Study now →
            </a>
            <p style="margin-top: 32px; font-size: 12px; color: #aaa;">
              To stop these reminders, visit your Dashboard and turn off email reminders.
            </p>
          </div>
        `,
      }),
    });

    if (res.ok) sent++;
    else console.error('Resend error for', email, await res.text());
  }

  return new Response(JSON.stringify({ sent, skipped }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
