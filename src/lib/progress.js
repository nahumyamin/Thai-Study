import { supabase } from './supabase.js';

export async function recordAnswer(userId, thaiWord, correct) {
  if (!userId || !supabase) return;

  const { data: existing } = await supabase
    .from('vocab_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('thai_word', thaiWord)
    .single();

  const now = new Date().toISOString();

  if (existing) {
    const newCorrect = existing.times_correct + (correct ? 1 : 0);
    const newIncorrect = existing.times_incorrect + (correct ? 0 : 1);
    const newSeen = existing.times_seen + 1;
    const accuracy = newCorrect / newSeen;
    const mastery = accuracy >= 0.9 && newSeen >= 5 ? 5
      : accuracy >= 0.8 && newSeen >= 4 ? 4
      : accuracy >= 0.7 && newSeen >= 3 ? 3
      : accuracy >= 0.5 && newSeen >= 2 ? 2
      : newSeen >= 1 ? 1 : 0;

    await supabase.from('vocab_progress').update({
      times_seen: newSeen,
      times_correct: newCorrect,
      times_incorrect: newIncorrect,
      mastery_level: mastery,
      last_seen_at: now,
    }).eq('id', existing.id);
  } else {
    await supabase.from('vocab_progress').insert({
      user_id: userId,
      thai_word: thaiWord,
      times_seen: 1,
      times_correct: correct ? 1 : 0,
      times_incorrect: correct ? 0 : 1,
      mastery_level: 1,
      last_seen_at: now,
    });
  }
}

export async function recordSession(userId, sessionType, wordsStudied, correctCount, durationSecs) {
  if (!userId || !supabase) return;
  await supabase.from('study_sessions').insert({
    user_id: userId,
    session_type: sessionType,
    words_studied: wordsStudied,
    correct_count: correctCount,
    duration_secs: durationSecs,
  });
  await updateStreak(userId);
}

async function updateStreak(userId) {
  const today = new Date().toISOString().slice(0, 10);

  const { data: profile } = await supabase
    .from('profiles')
    .select('streak_count, last_active_date')
    .eq('id', userId)
    .single();

  if (!profile) return;

  const last = profile.last_active_date;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  let newStreak = profile.streak_count;
  if (last === today) return; // already counted today
  if (last === yesterday) newStreak += 1;
  else newStreak = 1; // streak broken

  await supabase.from('profiles').update({
    streak_count: newStreak,
    last_active_date: today,
  }).eq('id', userId);
}
