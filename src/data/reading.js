export const READING_INTRO = `Reading Thai rewards patience — the script is logical and consistent once you internalize a few core patterns. The biggest hurdle is the absence of spaces between words: Thai separates sentences and clauses with spaces, but individual words run together. The strategies here will help you move from character-level decoding to reading with real comprehension.`;

export const READING_SECTIONS = [
  {
    id: 'boundaries',
    title: 'Word boundaries without spaces',
    body: `Thai uses spaces between clauses and sentences, not between individual words. A single run of characters can contain two, three, or more words. The key is to treat each unknown string as a sequence of syllables and group them into words as you go. Common short words become visual separators once you recognize them.`,
    tips: [
      { text: 'Spaces mark clause or sentence breaks — use them to chunk long text into manageable pieces.' },
      { text: 'Short function words like ที่ (at/which), ใน (in), ของ (of), มี (have), and ไป (go) act as anchors that split longer strings.' },
      { text: 'Scan any passage first for words you already know — they establish context for everything around them.' },
    ],
  },
  {
    id: 'syllables',
    title: 'Syllable decoding',
    body: `Every Thai syllable follows a fixed pattern: initial consonant → vowel → optional final consonant → tone mark. Vowels can appear before, after, above, or below the initial consonant — and some wrap around it entirely. Recognizing this anatomy lets you parse even unfamiliar words one syllable at a time.`,
    examples: [
      { thai: 'กิน', rom: 'gin', label: 'ก (initial) + ิ (short i, above) + น (final) = eat' },
      { thai: 'เมือง', rom: 'mueang', label: 'เ–ื–อ (wraps ม) + ง (final) = city' },
      { thai: 'น้ำ', rom: 'nam', label: 'น (initial) + า + ้ (tone) + ม (final) = water' },
    ],
  },
  {
    id: 'particles',
    title: 'Key particles to recognise',
    body: `Particles are short function words that signal politeness, questions, tense, and sentence structure. Spotting them — even before you understand the surrounding vocabulary — tells you what a sentence is doing.`,
    particles: [
      { thai: 'ครับ / ค่ะ', rom: 'khrap / kha', use: 'Polite sentence endings (male / female speaker)' },
      { thai: 'ไหม / มั้ย', rom: 'mai / mai', use: 'Yes/no question marker, placed at end of sentence' },
      { thai: 'ไม่', rom: 'mai', use: 'Negation — comes directly before the verb or adjective' },
      { thai: 'แล้ว', rom: 'laeo', use: 'Completion / "already" — often follows the main verb' },
      { thai: 'กำลัง', rom: 'gamlang', use: 'Present progressive — "currently doing"' },
      { thai: 'จะ', rom: 'ja', use: 'Future marker — "will" or "going to"' },
      { thai: 'ก็', rom: 'go', use: '"Also" / "then" / "so" — links related ideas' },
      { thai: 'เพราะ', rom: 'phro', use: '"Because" — introduces a reason clause' },
      { thai: 'แต่', rom: 'tae', use: '"But" — introduces a contrast' },
      { thai: 'ถ้า', rom: 'tha', use: '"If" — opens a conditional clause' },
    ],
  },
  {
    id: 'approaches',
    title: 'Reading approaches',
    body: `Combining top-down and bottom-up reading gives the fastest results. Neither method alone is sufficient at beginner or intermediate level.`,
    approaches: [
      {
        name: 'Top-down (context first)',
        desc: 'Read the English title and any available context. Predict the vocabulary and structures you expect to encounter. Scan the Thai for recognisable words — use those as islands to infer the meaning of surrounding text.',
      },
      {
        name: 'Bottom-up (decode first)',
        desc: 'Work through the text character by character, identifying syllables and matching them to known words. More laborious, but builds pattern recognition that eventually becomes automatic.',
      },
      {
        name: 'Mixed (practical default)',
        desc: 'Skim the passage once for familiar words (top-down), then read more carefully syllable by syllable (bottom-up). Accept 70% comprehension and keep moving rather than stopping at every unknown word.',
      },
    ],
  },
  {
    id: 'reader',
    title: 'Using the interactive reader',
    body: `The Reading Passages tool has features designed specifically for learner reading sessions.`,
    features: [
      { label: 'Tap any word', desc: 'Vocabulary words are underlined with a dotted line. Tap one to see its definition, romanisation, and topic — without leaving the passage.' },
      { label: 'Listen button', desc: 'The speaker icon reads the full passage aloud at a learner-friendly pace. Use it to connect the written form to pronunciation before or after reading.' },
      { label: 'Comprehension questions', desc: 'Each passage ends with questions that test both literal understanding and inference. Try answering silently before revealing each answer.' },
      { label: 'Difficulty levels', desc: 'Beginner passages use limited vocabulary and short sentences. Intermediate introduces more complex grammar. Advanced mirrors real-world Thai text.' },
    ],
  },
  {
    id: 'fluency',
    title: 'Building reading fluency',
    body: `Fluency comes from volume and frequency, not marathon sessions. A few focused habits compound quickly.`,
    tips: [
      { text: 'Read aloud — even slowly. Connecting written form to spoken sound accelerates word recognition significantly.' },
      { text: '10–15 minutes daily beats long infrequent sessions. Frequency is more important than duration.' },
      { text: 'Accept ambiguity. Targeting 70% comprehension keeps reading fluid rather than turning every sentence into a translation exercise.' },
      { text: 'Re-read passages. A second or third pass on the same text shows dramatic gains and builds confidence.' },
      { text: 'Graduate difficulty deliberately. Spend enough time on beginner passages that they feel easy before moving to intermediate.' },
    ],
  },
];
