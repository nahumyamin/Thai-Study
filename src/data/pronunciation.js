export const PRONUNCIATION_INTRO = `Thai is a tonal language written in its own script. This guide covers the five tones, the 44 consonants grouped by class, and the main vowel forms — the three things that most directly affect whether you are understood.`;

export const TONES = [
  {
    name: 'Mid',
    mark: '—',
    svgPath: '<line x1="8" y1="20" x2="72" y2="20" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>',
    example: 'ไก่',
    rom: 'kai',
    en: 'chicken',
    desc: 'Steady, flat pitch — your natural speaking voice',
  },
  {
    name: 'Low',
    mark: '◌่',
    svgPath: '<line x1="8" y1="16" x2="72" y2="28" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>',
    example: 'ข่าว',
    rom: 'khao',
    en: 'news',
    desc: 'Starts slightly low, falls gently — relaxed and flat',
  },
  {
    name: 'Falling',
    mark: '◌้',
    svgPath: '<path d="M8 10 Q40 14 72 34" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"/>',
    example: 'ข้าว',
    rom: 'khao',
    en: 'rice',
    desc: 'Starts high, drops firmly — like a statement ending',
  },
  {
    name: 'High',
    mark: '◌้ (H)',
    svgPath: '<line x1="8" y1="28" x2="72" y2="10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>',
    example: 'เข้า',
    rom: 'khao',
    en: 'to enter',
    desc: 'Starts mid, rises sharply — like a surprised question',
  },
  {
    name: 'Rising',
    mark: '◌๋',
    svgPath: '<path d="M8 28 Q40 32 56 24 Q68 16 72 10" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"/>',
    example: 'เขา',
    rom: 'khao',
    en: 'he / she',
    desc: 'Dips first, then rises — like a curious question',
  },
];

export const TONE_TABLE = {
  headers: ['Class', 'No mark', '◌่ (mái èek)', '◌้ (mái tho)', '◌๊ (mái trí)', '◌๋ (mái jàt-tà-wá)'],
  rows: [
    { cls: 'Mid', clsClass: 'mid-cls', tones: ['Mid', 'Low', 'Falling', 'High', 'Rising'] },
    { cls: 'High', clsClass: 'high-cls', tones: ['Rising', 'Low', 'Falling', '—', '—'] },
    { cls: 'Low', clsClass: 'low-cls', tones: ['Mid', 'Falling', 'High', '—', '—'] },
  ],
  note: 'Mid-class consonants can use all five tone marks. High and low class consonants only use two marks, and the resulting tones differ from mid class.',
};

export const CORE_VOWELS = [
  { short: '–ะ', long: '–า', sound: 'a / aa' },
  { short: '–ิ', long: '–ี', sound: 'i / ii' },
  { short: '–ึ', long: '–ื', sound: 'ue / uue' },
  { short: '–ุ', long: '–ู', sound: 'u / uu' },
  { short: 'เ–ะ', long: 'เ–', sound: 'e / ee' },
  { short: 'แ–ะ', long: 'แ–', sound: 'ae / aae' },
  { short: 'โ–ะ', long: 'โ–', sound: 'o / oo' },
  { short: 'เ–าะ', long: '–อ', sound: 'or / aaw' },
  { short: 'เ–อะ', long: 'เ–อ', sound: 'oe / ooe' },
];

export const COMPOUND_VOWELS = [
  { form: '–ัว / –วา', sound: 'ua / uua', example: 'วัว (cow)' },
  { form: 'เ–ีย', sound: 'ia', example: 'เบียร์ (beer)' },
  { form: 'เ–ือ', sound: 'uea', example: 'เรือ (boat)' },
  { form: '–าย / ไ– / ใ–', sound: 'ai', example: 'ไป (go)' },
  { form: '–าว', sound: 'ao', example: 'ข้าว (rice)' },
  { form: 'เ–า', sound: 'ao', example: 'เเก่า (old)' },
];

export const TIPS = [
  {
    num: '01',
    title: 'Tones matter more than vowels',
    body: 'A foreigner mispronouncing a vowel is usually understood from context. A wrong tone can produce a completely different word — or be incomprehensible. Focus on tones first.',
  },
  {
    num: '02',
    title: 'Thai has no spaces between words',
    body: 'Sentences are written without spaces — spaces only appear between clauses or sentences. Learning to identify word boundaries comes with exposure, not a rule.',
  },
  {
    num: '03',
    title: 'Final consonants are unreleased',
    body: 'Syllables ending in p, t, or k are not released — the mouth closes but no puff of air comes out. This is why Thai words can sound like they end abruptly to English ears.',
  },
  {
    num: '04',
    title: 'ร is often silent or becomes น',
    body: 'In everyday speech, ร (r) at the end of a syllable or in a consonant cluster is often dropped or pronounced as น (n). ไทย sounds like "tai", not "tair".',
  },
  {
    num: '05',
    title: 'Vowels can be above, below, before, or around',
    body: 'Unlike Latin script, Thai vowel symbols are placed in all directions around the consonant. Reading order is still left-to-right, but you must scan all four positions to identify the vowel.',
  },
  {
    num: '06',
    title: 'The script has no uppercase',
    body: 'Thai script has no capital letters. Names, sentence beginnings, and titles are not marked by case — only by context and spacing.',
  },
];
