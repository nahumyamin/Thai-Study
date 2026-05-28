import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase.js';
import { getDailyChallengeHistory } from '../lib/progress.js';
import { useAuth } from '../context/AuthContext.jsx';
import { cn } from '../lib/utils.js';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MASTERY_LABELS = ['Unseen', 'Seen', 'Learning', 'Familiar', 'Proficient', 'Mastered'];
const MASTERY_COLORS = [
  'bg-zinc-200 dark:bg-zinc-700',
  'bg-red-400',
  'bg-orange-400',
  'bg-yellow-400',
  'bg-lime-400',
  'bg-emerald-500',
];

function StatCard({ label, value, sub }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="text-3xl font-bold text-foreground">{value}</div>
      <div className="text-sm font-medium text-foreground mt-1">{label}</div>
      {sub && <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>}
    </div>
  );
}

export default function DashboardPage({ showPage }) {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const [progress, setProgress] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [reminders, setReminders] = useState(null);
  const [reminderSaving, setReminderSaving] = useState(false);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('vocab_progress').select('*').eq('user_id', user.id),
      supabase.from('study_sessions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10),
      supabase.from('reminder_settings').select('*').eq('user_id', user.id).single(),
      getDailyChallengeHistory(user.id),
    ]).then(([p, v, s, r, c]) => {
      setProfile(p.data);
      setProgress(v.data ?? []);
      setSessions(s.data ?? []);
      setReminders(r.data ?? { email_enabled: false, reminder_hour: 9, reminder_days: [1, 2, 3, 4, 5] });
      setChallenges(c);
      setLoading(false);
    });
  }, [user]);

  const saveReminders = useCallback(async (updated) => {
    setReminderSaving(true);
    await supabase.from('reminder_settings').upsert({ user_id: user.id, ...updated });
    setReminders(updated);
    setReminderSaving(false);
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-muted-foreground text-sm">
        Loading…
      </div>
    );
  }

  const totalWords = progress.length;
  const mastered = progress.filter(w => w.mastery_level === 5).length;
  const totalCorrect = progress.reduce((a, w) => a + w.times_correct, 0);
  const totalSeen = progress.reduce((a, w) => a + w.times_seen, 0);
  const accuracy = totalSeen > 0 ? Math.round((totalCorrect / totalSeen) * 100) : 0;

  const masteryBuckets = [0, 1, 2, 3, 4, 5].map(level => ({
    level,
    count: progress.filter(w => w.mastery_level === level).length,
  }));

  const weakWords = [...progress]
    .filter(w => w.times_seen >= 2)
    .sort((a, b) => {
      const accA = a.times_correct / a.times_seen;
      const accB = b.times_correct / b.times_seen;
      return accA - accB;
    })
    .slice(0, 8);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {profile?.display_name ? `สวัสดี, ${profile.display_name.split(' ')[0]}` : 'Dashboard'}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">{user.email}</p>
        </div>
        <button
          onClick={signOut}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg px-3 py-1.5 cursor-pointer bg-transparent"
        >
          Sign out
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatCard
          label="Day Streak"
          value={profile?.streak_count ?? 0}
          sub="days in a row"
        />
        <StatCard
          label="Words Studied"
          value={totalWords}
          sub={`${mastered} mastered`}
        />
        <StatCard
          label="Accuracy"
          value={`${accuracy}%`}
          sub={`${totalCorrect} / ${totalSeen} correct`}
        />
        <StatCard
          label="Sessions"
          value={sessions.length}
          sub="recent activity"
        />
      </div>

      {/* Daily challenge streak / history */}
      {challenges.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Daily Challenge History</h2>
            <span className="text-xs text-muted-foreground">{challenges.length} {challenges.length === 1 ? 'entry' : 'entries'}</span>
          </div>
          <div className="space-y-4">
            {challenges.map(c => (
              <div key={c.id} className="border-l-2 border-amber-400/50 pl-4">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[0.65rem] font-bold tracking-widest uppercase text-amber-600">
                    {new Date(c.submitted_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </span>
                  <span className="text-[0.65rem] text-muted-foreground">
                    · {c.word1_thai} + {c.word2_thai}
                  </span>
                </div>
                <p className="font-thai-display text-sm text-foreground leading-relaxed">{c.sentence}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mastery distribution */}
      <div className="rounded-xl border border-border bg-card p-5 mb-6">
        <h2 className="text-sm font-semibold text-foreground mb-4">Mastery Breakdown</h2>
        <div className="space-y-2">
          {masteryBuckets.map(({ level, count }) => (
            <div key={level} className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-20 shrink-0">{MASTERY_LABELS[level]}</span>
              <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className={cn('h-2 rounded-full transition-all', MASTERY_COLORS[level])}
                  style={{ width: totalWords > 0 ? `${(count / totalWords) * 100}%` : '0%' }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-6 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Weak words */}
      {weakWords.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5 mb-6">
          <h2 className="text-sm font-semibold text-foreground mb-4">Words to Practice</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {weakWords.map(w => (
              <div key={w.thai_word} className="rounded-lg bg-muted px-3 py-2 text-center">
                <div className="text-lg font-thai-display text-foreground">{w.thai_word}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {Math.round((w.times_correct / w.times_seen) * 100)}% correct
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => showPage('quiz')}
            className="mt-4 text-xs text-amber-600 hover:text-amber-500 transition-colors cursor-pointer bg-transparent border-none p-0"
          >
            Practice these in Quiz →
          </button>
        </div>
      )}

      {/* Recent sessions */}
      {sessions.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Recent Sessions</h2>
          <div className="space-y-2">
            {sessions.map(s => (
              <div key={s.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="capitalize text-foreground">{s.session_type}</span>
                  <span className="text-muted-foreground">· {s.words_studied} words</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground">
                    {s.words_studied > 0 ? Math.round((s.correct_count / s.words_studied) * 100) : 0}%
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(s.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {sessions.length === 0 && progress.length === 0 && (
        <div className="text-center text-muted-foreground text-sm py-8">
          No activity yet — go study some words and come back!
          <br />
          <button
            onClick={() => showPage('cards')}
            className="mt-3 text-amber-600 hover:text-amber-500 transition-colors cursor-pointer bg-transparent border-none p-0"
          >
            Start with Flashcards →
          </button>
        </div>
      )}

      {/* Reminder settings */}
      {reminders && (
        <div className="rounded-xl border border-border bg-card p-5 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Email Reminders</h2>
            <button
              onClick={() => saveReminders({ ...reminders, email_enabled: !reminders.email_enabled })}
              className={cn(
                'relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer border-none',
                reminders.email_enabled ? 'bg-amber-400' : 'bg-muted-foreground/30'
              )}
              aria-label="Toggle reminders"
            >
              <span className={cn(
                'inline-block h-4 w-4 rounded-full bg-white shadow transition-transform',
                reminders.email_enabled ? 'translate-x-4' : 'translate-x-0.5'
              )} />
            </button>
          </div>

          {reminders.email_enabled && (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Remind me at</label>
                <select
                  value={reminders.reminder_hour}
                  onChange={e => saveReminders({ ...reminders, reminder_hour: Number(e.target.value) })}
                  className="text-sm border border-border rounded-lg px-3 py-1.5 bg-background text-foreground cursor-pointer"
                >
                  {Array.from({ length: 24 }, (_, h) => (
                    <option key={h} value={h}>
                      {h === 0 ? '12:00 AM' : h < 12 ? `${h}:00 AM` : h === 12 ? '12:00 PM' : `${h - 12}:00 PM`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-2 block">On these days</label>
                <div className="flex gap-1.5 flex-wrap">
                  {DAYS.map((day, i) => {
                    const active = reminders.reminder_days.includes(i);
                    return (
                      <button
                        key={day}
                        onClick={() => {
                          const days = active
                            ? reminders.reminder_days.filter(d => d !== i)
                            : [...reminders.reminder_days, i].sort();
                          saveReminders({ ...reminders, reminder_days: days });
                        }}
                        className={cn(
                          'px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer border',
                          active
                            ? 'bg-amber-400 text-zinc-900 border-amber-400'
                            : 'bg-transparent text-muted-foreground border-border hover:border-amber-400/50'
                        )}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {reminderSaving && <p className="text-xs text-muted-foreground">Saving…</p>}
              <p className="text-xs text-muted-foreground">
                Reminders will be sent to <span className="text-foreground">{user.email}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
