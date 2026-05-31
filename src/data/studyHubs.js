// ─────────────────────────────────────────────────────────────────
// Study hubs — group the individual practice tools into a few
// category landing pages so the Study menu stays shallow.
// Each hub renders an intro paragraph + launch cards (see StudyHubPage).
// Shared by Nav (sub-tabs + active highlight) and App (routing/titles).
// ─────────────────────────────────────────────────────────────────

export const STUDY_HUBS = [
  {
    id: 'words',
    label: 'Vocabulary',
    title: 'Vocabulary',
    accent: 'Practice',
    intro:
      'Grow and retain your Thai word bank. Flip through flashcards to meet new words, ' +
      'test recall with quizzes, then let spaced review and sentence-based fill-ins move ' +
      'them into long-term memory.',
    tools: [
      { page: 'cards',  emoji: '🃏', name: 'Flashcards',     desc: 'Flip through words by topic and star the ones to drill.' },
      { page: 'quiz',   emoji: '📝', name: 'Quiz',           desc: 'Test recall with multiple-choice, typed, or listening modes.' },
      { page: 'review', emoji: '🔁', name: 'Spaced Review',  desc: 'Drill the words that are due today on a memory-friendly schedule.', note: 'Account needed' },
      { page: 'cloze',  emoji: '✏️', name: 'Fill the Blank', desc: 'Recall each word inside a real example sentence.' },
    ],
  },
  {
    id: 'sentences',
    label: 'Grammar',
    title: 'Grammar',
    accent: 'Practice',
    intro:
      'Practice building correct Thai sentences. Reorder scrambled words, hunt down hidden ' +
      'grammar mistakes, and match nouns with their classifiers to internalise how Thai fits together.',
    tools: [
      { page: 'scramble',        emoji: '🔀', name: 'Word Scramble',   desc: 'Reorder scrambled words into the correct sentence.' },
      { page: 'mistake-hunter',  emoji: '🔍', name: 'Mistake Hunter',  desc: 'Spot the single grammar error in each sentence.' },
      { page: 'classifier-drop', emoji: '🎯', name: 'Classifier Drop', desc: 'Pick the right classifier for each noun, against the clock.' },
    ],
  },
  {
    id: 'script',
    label: 'Reading & Script',
    title: 'Reading & Script',
    accent: '',
    intro:
      'Build the literacy fundamentals. Drill consonant classes for speed, read graded passages ' +
      'with discussion questions, and master the Thai calendar — the building blocks for reading real Thai.',
    tools: [
      { page: 'rush',     emoji: '⚡', name: 'Class Rush',       desc: 'Race to tag each consonant’s class before the timer runs out.' },
      { page: 'passages', emoji: '📖', name: 'Reading Passages', desc: 'Read real graded texts with comprehension questions.' },
      { page: 'months',   emoji: '📅', name: 'Months',           desc: 'Learn and quiz the twelve Thai months.' },
    ],
  },
];

export const STUDY_HUB_IDS = STUDY_HUBS.map(h => h.id);

// Returns the hub id for a given page — the hub itself, or the hub that
// owns the given tool page. Null if the page isn't part of a study hub.
export function hubForPage(pageId) {
  if (STUDY_HUB_IDS.includes(pageId)) return pageId;
  const parent = STUDY_HUBS.find(h => h.tools.some(t => t.page === pageId));
  return parent ? parent.id : null;
}

export function getHub(hubId) {
  return STUDY_HUBS.find(h => h.id === hubId) ?? null;
}
