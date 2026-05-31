import { supabase } from './supabase.js';
import { XP_VALUES } from './gamification.js';

// `word` is a vocab item ({ id, thai }). A bare Thai string is also accepted
// for backwards compatibility, in which case progress is keyed by thai_word.
export async function recordAnswer(userId, word, correct) {
  if (!userId || !supabase) return;

  const wordId   = typeof word === 'object' && word ? word.id   : undefined;
  const thaiWord = typeof word === 'object' && word ? word.thai : word;
  if (!thaiWord && !wordId) return;

  // Prefer the stable word_id; fall back to thai_word for legacy callers/rows.
  let lookup = supabase.from('vocab_progress').select('*').eq('user_id', userId);
  lookup = wordId ? lookup.eq('word_id', wordId) : lookup.eq('thai_word', thaiWord);
  const { data: existing } = await lookup.maybeSingle();

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
      // keep word_id / thai_word current in case the word was re-keyed or respelled
      ...(wordId ? { word_id: wordId } : {}),
      ...(thaiWord ? { thai_word: thaiWord } : {}),
      times_seen: newSeen,
      times_correct: newCorrect,
      times_incorrect: newIncorrect,
      mastery_level: mastery,
      last_seen_at: now,
    }).eq('id', existing.id);
  } else {
    await supabase.from('vocab_progress').insert({
      user_id: userId,
      word_id: wordId ?? null,
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

  // Award XP: 1 per word + accuracy bonus
  let xp = wordsStudied * XP_VALUES.PER_WORD;
  if (wordsStudied >= 5 && correctCount === wordsStudied) {
    xp += XP_VALUES.PERFECT_BONUS;
  } else if (wordsStudied >= 5 && correctCount / wordsStudied >= 0.8) {
    xp += XP_VALUES.ACCURACY_BONUS;
  }
  await awardXP(userId, xp);
}

export async function submitDailyChallenge(userId, { sentence, word1Thai, word2Thai, day }) {
  if (!userId || !supabase) return null;
  // Check if this is a new submission (not an edit) to award XP once per day
  const existing = await getDailyChallenge(userId, day);
  const { data, error } = await supabase
    .from('daily_challenges')
    .upsert(
      { user_id: userId, day, sentence, word1_thai: word1Thai, word2_thai: word2Thai },
      { onConflict: 'user_id,day' }
    )
    .select()
    .single();
  if (error) { console.error('submitDailyChallenge:', error); return null; }
  // Only award XP on first submission, not on edits
  if (!existing) {
    await awardXP(userId, XP_VALUES.DAILY_CHALLENGE);
  }
  return data;
}

export async function getDailyChallenge(userId, day) {
  if (!userId || !supabase) return null;
  const { data } = await supabase
    .from('daily_challenges')
    .select('*')
    .eq('user_id', userId)
    .eq('day', day)
    .maybeSingle();
  return data ?? null;
}

export async function updateDailyChallenge(userId, id, sentence) {
  if (!userId || !supabase) return null;
  const { data, error } = await supabase
    .from('daily_challenges')
    .update({ sentence })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();
  if (error) { console.error('updateDailyChallenge:', error); return null; }
  return data;
}

export async function deleteDailyChallenge(userId, id) {
  if (!userId || !supabase) return false;
  const { error } = await supabase
    .from('daily_challenges')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  return !error;
}

export async function getDailyChallengeHistory(userId, limit = 14) {
  if (!userId || !supabase) return [];
  const { data } = await supabase
    .from('daily_challenges')
    .select('*')
    .eq('user_id', userId)
    .order('day', { ascending: false })
    .limit(limit);
  return data ?? [];
}

async function updateStreak(userId) {
  const today = new Date().toISOString().slice(0, 10);

  const { data: profile } = await supabase
    .from('profiles')
    .select('streak_count, streak_best, last_active_date')
    .eq('id', userId)
    .single();

  if (!profile) return;

  const last = profile.last_active_date;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  let newStreak = profile.streak_count ?? 0;
  if (last === today) return; // already counted today
  if (last === yesterday) newStreak += 1;
  else newStreak = 1; // streak broken

  const newBest = Math.max(newStreak, profile.streak_best ?? 0);

  await supabase.from('profiles').update({
    streak_count: newStreak,
    streak_best: newBest,
    last_active_date: today,
  }).eq('id', userId);
}

// ── XP & achievements ─────────────────────────────────────────────

export async function awardXP(userId, amount) {
  if (!userId || !supabase || !amount || amount <= 0) return;
  const { data } = await supabase
    .from('profiles').select('total_xp').eq('id', userId).single();
  if (!data) return;
  await supabase.from('profiles').update({
    total_xp: (data.total_xp ?? 0) + amount,
  }).eq('id', userId);
}

/**
 * Inserts any achievements in earnedIds that aren't already in existingIds.
 * Pass existingIds (array of achievement_id strings) to avoid an extra DB round-trip.
 * Returns the list of newly inserted achievement IDs.
 */
export async function unlockAchievements(userId, earnedIds, existingIds = null) {
  if (!userId || !supabase || !earnedIds?.size) return [];

  let existingSet;
  if (existingIds !== null) {
    existingSet = new Set(existingIds);
  } else {
    const { data } = await supabase
      .from('achievements').select('achievement_id').eq('user_id', userId);
    existingSet = new Set(data?.map(a => a.achievement_id) ?? []);
  }

  const newIds = [...earnedIds].filter(id => !existingSet.has(id));
  if (!newIds.length) return [];

  await supabase.from('achievements').insert(
    newIds.map(achievement_id => ({ user_id: userId, achievement_id }))
  );
  return newIds;
}
