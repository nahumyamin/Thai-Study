// ── Levels ────────────────────────────────────────────────────────
export const LEVELS = [
  { level: 1, label: 'Beginner',     minXp: 0    },
  { level: 2, label: 'Elementary',   minXp: 100  },
  { level: 3, label: 'Intermediate', minXp: 300  },
  { level: 4, label: 'Advanced',     minXp: 700  },
  { level: 5, label: 'Fluent',       minXp: 1500 },
  { level: 6, label: 'Native',       minXp: 3000 },
];

/**
 * Returns the current level info for a given XP total.
 */
export function getLevel(xp = 0) {
  let current = LEVELS[0];
  for (const l of LEVELS) {
    if (xp >= l.minXp) current = l;
    else break;
  }
  // next level is the one after current (LEVELS is 0-indexed, level is 1-indexed)
  const nextLevel = current.level < LEVELS.length ? LEVELS[current.level] : null;
  const progress = nextLevel
    ? (xp - current.minXp) / (nextLevel.minXp - current.minXp)
    : 1;
  return { ...current, xp, nextLevel, progress: Math.min(1, progress) };
}

// ── XP rewards ────────────────────────────────────────────────────
export const XP_VALUES = {
  PER_WORD: 1,        // per word studied in a session
  ACCURACY_BONUS: 5,  // bonus if ≥80% accuracy on 5+ words
  PERFECT_BONUS: 10,  // bonus if 100% accuracy on 5+ words
  DAILY_CHALLENGE: 10,// for the first daily challenge submission of a day
};

// ── Spaced-repetition review intervals (hours since last seen) ────
// Index = mastery level 0-5
export const REVIEW_INTERVALS = [0, 24, 72, 168, 336, 720];

// ── Achievements ─────────────────────────────────────────────────
export const ACHIEVEMENTS = [
  // Habit
  { id: 'first_session',   emoji: '👣', label: 'First Steps',       desc: 'Complete your first study session',           cat: 'habit'     },
  { id: 'streak_3',        emoji: '🔥', label: 'Getting Warm',       desc: 'Reach a 3-day study streak',                  cat: 'habit'     },
  { id: 'streak_7',        emoji: '🗓️', label: 'One Week Strong',    desc: 'Reach a 7-day streak',                        cat: 'habit'     },
  { id: 'streak_30',       emoji: '💪', label: 'Unstoppable',        desc: 'Reach a 30-day streak',                       cat: 'habit'     },
  { id: 'early_bird',      emoji: '🌅', label: 'Early Bird',         desc: 'Study before 8 AM',                           cat: 'habit'     },
  { id: 'night_owl',       emoji: '🦉', label: 'Night Owl',          desc: 'Study after 10 PM',                           cat: 'habit'     },
  // Vocab
  { id: 'words_10',        emoji: '📚', label: 'Word Hoarder',       desc: 'Study 10 unique words',                       cat: 'vocab'     },
  { id: 'words_50',        emoji: '📖', label: 'Vocab Builder',      desc: 'Study 50 unique words',                       cat: 'vocab'     },
  { id: 'words_100',       emoji: '💯', label: 'Century',            desc: 'Study 100 unique words',                      cat: 'vocab'     },
  { id: 'words_200',       emoji: '🧠', label: 'Word Fanatic',       desc: 'Study 200 unique words',                      cat: 'vocab'     },
  { id: 'mastered_1',      emoji: '⭐', label: 'First Master',       desc: 'Fully master your first word',                cat: 'vocab'     },
  { id: 'mastered_10',     emoji: '🌟', label: 'Word Master',        desc: 'Fully master 10 words',                       cat: 'vocab'     },
  { id: 'mastered_50',     emoji: '👑', label: 'Thai Lexicon',       desc: 'Fully master 50 words',                       cat: 'vocab'     },
  // Quiz
  { id: 'perfect_quiz',    emoji: '🎯', label: 'Perfect Score',      desc: 'Get 100% on a quiz with 5+ words',            cat: 'quiz'      },
  { id: 'quiz_veteran',    emoji: '🏆', label: 'Quiz Veteran',       desc: 'Complete 20 quiz or game sessions',           cat: 'quiz'      },
  // Daily challenge
  { id: 'first_challenge', emoji: '✍️', label: 'Sentence Maker',    desc: 'Submit your first daily challenge',            cat: 'challenge' },
  { id: 'challenge_7',     emoji: '📝', label: 'Daily Devotion',     desc: 'Complete 7 daily challenges',                 cat: 'challenge' },
  { id: 'challenge_30',    emoji: '📜', label: 'Story Builder',      desc: 'Complete 30 daily challenges',                cat: 'challenge' },
  // Level milestones
  { id: 'level_3',         emoji: '🎓', label: 'Intermediate',       desc: 'Reach Intermediate level (300 XP)',           cat: 'level'     },
  { id: 'level_5',         emoji: '🌺', label: 'Fluent',             desc: 'Reach Fluent level (1500 XP)',                cat: 'level'     },
];

/**
 * Computes the set of achievement IDs the user has earned based on their data.
 * Call this on dashboard load and compare with DB to find newly unlocked achievements.
 */
export function computeEarnedAchievements({ progress = [], sessions = [], challenges = [], profile = {} }) {
  const earned = new Set();

  const totalWords    = progress.length;
  const masteredWords = progress.filter(w => w.mastery_level === 5).length;
  const streak        = profile?.streak_count ?? 0;
  const xp            = profile?.total_xp ?? 0;
  const levelInfo     = getLevel(xp);

  // Habit
  if (sessions.length >= 1) earned.add('first_session');
  if (streak >= 3)           earned.add('streak_3');
  if (streak >= 7)           earned.add('streak_7');
  if (streak >= 30)          earned.add('streak_30');

  const hasEarlyBird = sessions.some(s => new Date(s.created_at).getUTCHours() < 8);
  if (hasEarlyBird)          earned.add('early_bird');
  const hasNightOwl  = sessions.some(s => new Date(s.created_at).getUTCHours() >= 22);
  if (hasNightOwl)           earned.add('night_owl');

  // Vocab
  if (totalWords >= 10)      earned.add('words_10');
  if (totalWords >= 50)      earned.add('words_50');
  if (totalWords >= 100)     earned.add('words_100');
  if (totalWords >= 200)     earned.add('words_200');
  if (masteredWords >= 1)    earned.add('mastered_1');
  if (masteredWords >= 10)   earned.add('mastered_10');
  if (masteredWords >= 50)   earned.add('mastered_50');

  // Quiz
  const hasPerfect = sessions.some(
    s => s.words_studied >= 5 && s.correct_count === s.words_studied && s.words_studied > 0
  );
  if (hasPerfect)            earned.add('perfect_quiz');
  const quizLikeSessions = sessions.filter(s => ['quiz', 'rush', 'scramble'].includes(s.session_type));
  if (quizLikeSessions.length >= 20) earned.add('quiz_veteran');

  // Daily challenge
  if (challenges.length >= 1)  earned.add('first_challenge');
  if (challenges.length >= 7)  earned.add('challenge_7');
  if (challenges.length >= 30) earned.add('challenge_30');

  // Level milestones
  if (levelInfo.level >= 3)  earned.add('level_3');
  if (levelInfo.level >= 5)  earned.add('level_5');

  return earned;
}
