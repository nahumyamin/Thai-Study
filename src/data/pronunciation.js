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

// Pitch-contour shapes + colour per tone, reused by the Tone Pairs section.
// viewBox is 0 0 80 40 to match the TONES cards above.
export const TONE_META = {
  Mid: {
    order: 0,
    svgPath: '<line x1="8" y1="20" x2="72" y2="20" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>',
    dot: 'bg-slate-400',
    text: 'text-slate-600 dark:text-slate-300',
    chip: 'bg-slate-100 text-slate-700 dark:bg-slate-700/40 dark:text-slate-200',
    ring: 'border-slate-300 dark:border-slate-600',
  },
  Low: {
    order: 1,
    svgPath: '<line x1="8" y1="16" x2="72" y2="28" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>',
    dot: 'bg-sky-500',
    text: 'text-sky-600 dark:text-sky-300',
    chip: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-200',
    ring: 'border-sky-300 dark:border-sky-700',
  },
  Falling: {
    order: 2,
    svgPath: '<path d="M8 10 Q40 14 72 34" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"/>',
    dot: 'bg-rose-500',
    text: 'text-rose-600 dark:text-rose-300',
    chip: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200',
    ring: 'border-rose-300 dark:border-rose-700',
  },
  High: {
    order: 3,
    svgPath: '<line x1="8" y1="28" x2="72" y2="10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>',
    dot: 'bg-emerald-500',
    text: 'text-emerald-600 dark:text-emerald-300',
    chip: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200',
    ring: 'border-emerald-300 dark:border-emerald-700',
  },
  Rising: {
    order: 4,
    svgPath: '<path d="M8 28 Q40 32 56 24 Q68 16 72 10" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"/>',
    dot: 'bg-violet-500',
    text: 'text-violet-600 dark:text-violet-300',
    chip: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-200',
    ring: 'border-violet-300 dark:border-violet-700',
  },
};

export const TONE_ORDER = ['Mid', 'Low', 'Falling', 'High', 'Rising'];

export const TONE_PAIRS_INTRO = `Most Thai words are two syllables, and each syllable carries its own tone. Hearing how two tones sit next to each other — a steady mid followed by a sharp rising, or two fallings in a row — is the fastest way to train your ear. Below are common everyday words grouped by their tone combination. Tap any word to hear it.`;

export const TONE_PAIRS = [
  { first: 'Mid', second: 'Mid', words: [
    { thai: 'เวลา', en: 'time', rom: 'wee-laa' },
    { thai: 'กีฬา', en: 'sport', rom: 'gii-laa' },
    { thai: 'กาแฟ', en: 'coffee', rom: 'gaa-fae' },
    { thai: 'บันได', en: 'stairs', rom: 'ban-dai' },
    { thai: 'ราคา', en: 'price', rom: 'raa-khaa' },
  ]},
  { first: 'Mid', second: 'Low', words: [
    { thai: 'ตาไก่', en: 'eyelet / target', rom: 'dtaa-gài' },
    { thai: 'มีไข่', en: 'to have eggs', rom: 'mii-khài' },
    { thai: 'ตาใหญ่', en: 'big eyes', rom: 'dtaa-yài' },
    { thai: 'ไปป่า', en: 'go to the forest', rom: 'bpai-bpàa' },
    { thai: 'ดูเต่า', en: 'look at a turtle', rom: 'duu-dtào' },
  ]},
  { first: 'Mid', second: 'Falling', words: [
    { thai: 'กินข้าว', en: 'eat rice', rom: 'gin-khâao' },
    { thai: 'ไปเที่ยว', en: 'go travel', rom: 'bpai-thîao' },
    { thai: 'เดินเล่น', en: 'walk / stroll', rom: 'dern-lên' },
    { thai: 'มีพี่', en: 'have an older sibling', rom: 'mii-phîi' },
    { thai: 'ปีหน้า', en: 'next year', rom: 'bpii-nâa' },
  ]},
  { first: 'Mid', second: 'High', words: [
    { thai: 'เจอน้า', en: 'meet an aunt / uncle', rom: 'jer-náa' },
    { thai: 'วันพุธ', en: 'Wednesday', rom: 'wan-phút' },
    { thai: 'รองเท้า', en: 'shoes', rom: 'rong-tháo' },
    { thai: 'ดูช้าง', en: 'watch elephants', rom: 'duu-cháang' },
    { thai: 'กินเนื้อ', en: 'eat meat', rom: 'gin-núea' },
  ]},
  { first: 'Mid', second: 'Rising', words: [
    { thai: 'ดินสอ', en: 'pencil', rom: 'din-sǎaw' },
    { thai: 'คนสวย', en: 'beautiful person', rom: 'khon-sǔay' },
    { thai: 'ดูเสือ', en: 'watch tigers', rom: 'duu-sǔea' },
    { thai: 'ไปไหม', en: 'going?', rom: 'bpai-mǎi' },
    { thai: 'มีสี', en: 'have color', rom: 'mii-sǐi' },
  ]},
  { first: 'Low', second: 'Mid', words: [
    { thai: 'ปากกา', en: 'pen', rom: 'bpàak-gaa' },
    { thai: 'ป่าดิน', en: 'forest soil', rom: 'bpàa-din' },
    { thai: 'ออกไป', en: 'go out', rom: 'àawk-bpai' },
    { thai: 'ปิดไฟ', en: 'turn off the light', rom: 'bpìt-fai' },
    { thai: 'เปิดไฟ', en: 'turn on the light', rom: 'bpèrt-fai' },
  ]},
  { first: 'Low', second: 'Low', words: [
    { thai: 'กระดาษ', en: 'paper', rom: 'grà-dàat' },
    { thai: 'ตลาด', en: 'market', rom: 'dtà-làat' },
    { thai: 'อ่านข่าว', en: 'read news', rom: 'àan-khàao' },
    { thai: 'แดดออก', en: 'sunny', rom: 'dàet-àawk' },
    { thai: 'แก่แดด', en: 'precocious', rom: 'gàe-dàet' },
  ]},
  { first: 'Low', second: 'Falling', words: [
    { thai: 'กลับบ้าน', en: 'go home', rom: 'glàp-bâan' },
    { thai: 'กล่องข้าว', en: 'lunch box', rom: 'glàwng-khâao' },
    { thai: 'ใส่เสื้อ', en: 'wear a shirt', rom: 'sài-sûea' },
  ]},
  { first: 'Low', second: 'High', words: [
    { thai: 'ขับรถ', en: 'drive', rom: 'khàp-rót' },
    { thai: 'ใส่เอี๊ยม', en: 'wear overalls', rom: 'sài-íam' },
    { thai: 'ป่าไม้', en: 'forest / wood', rom: 'bpàa-máai' },
    { thai: 'ใส่น้ำ', en: 'add water', rom: 'sài-náam' },
  ]},
  { first: 'Low', second: 'Rising', words: [
    { thai: 'ขีดเขียน', en: 'to scribble / write', rom: 'khìit-khǐan' },
    { thai: 'กระเป๋า', en: 'bag', rom: 'grà-bpǎo' },
    { thai: 'ใส่สี', en: 'add color', rom: 'sài-sǐi' },
    { thai: 'ตลอด', en: 'all / always', rom: 'dtà-làawt' },
    { thai: 'เห่าหอน', en: 'howl', rom: 'hào-hǎawn' },
  ]},
  { first: 'Falling', second: 'Mid', words: [
    { thai: 'ไม่กิน', en: 'not eat', rom: 'mâi-gin' },
    { thai: 'ไม่มี', en: 'not have', rom: 'mâi-mii' },
    { thai: 'เมื่อวาน', en: 'yesterday', rom: 'mûea-waan' },
    { thai: 'ต้องมา', en: 'must come', rom: 'dtâwng-maa' },
    { thai: 'เรื่อยไป', en: 'continue', rom: 'rûeay-bpai' },
  ]},
  { first: 'Falling', second: 'Low', words: [
    { thai: 'แก้วแตก', en: 'broken glass', rom: 'gâew-dtàek' },
    { thai: 'ผ้าห่ม', en: 'blanket', rom: 'phâa-hòm' },
    { thai: 'ต้องบอก', en: 'must tell', rom: 'dtâwng-bàawk' },
    { thai: 'เรื่อยเปื่อย', en: 'ramble', rom: 'rûeay-bpùeay' },
  ]},
  { first: 'Falling', second: 'Falling', words: [
    { thai: 'ภาพวาด', en: 'drawing', rom: 'phâap-wâat' },
    { thai: 'ผ้าม่าน', en: 'curtains', rom: 'phâa-mâan' },
    { thai: 'เก้าอี้', en: 'chair', rom: 'gâo-îi' },
    { thai: 'เล่าเรื่อง', en: 'tell a story', rom: 'lâo-rûeang' },
    { thai: 'วาดภาพ', en: 'to draw', rom: 'wâat-phâap' },
  ]},
  { first: 'Falling', second: 'High', words: [
    { thai: 'แก้วน้ำ', en: 'glass of water', rom: 'gâew-náam' },
    { thai: 'พูดเยอะ', en: 'talk a lot', rom: 'phûut-yúh' },
    { thai: 'ต้นไม้', en: 'tree', rom: 'dtôn-máai' },
    { thai: 'น่ารัก', en: 'cute', rom: 'nâa-rák' },
    { thai: 'ท่อน้ำ', en: 'water pipe', rom: 'thâaw-náam' },
  ]},
  { first: 'Falling', second: 'Rising', words: [
    { thai: 'แค่ไหน', en: 'how much / to what extent', rom: 'khâe-nǎi' },
    { thai: 'ที่ไหน', en: 'where', rom: 'thîi-nǎi' },
    { thai: 'ใกล้เขา', en: 'near the mountain', rom: 'glâi-khǎo' },
    { thai: 'เหล้าขาว', en: 'white liquor', rom: 'lâo-khǎao' },
  ]},
  { first: 'High', second: 'Mid', words: [
    { thai: 'ทะเล', en: 'sea', rom: 'thá-lee' },
    { thai: 'ทุเรียน', en: 'durian', rom: 'thú-rian' },
    { thai: 'ร้องเพลง', en: 'sing', rom: 'ráawng-phleeng' },
    { thai: 'ทุกวัน', en: 'every day', rom: 'thúk-wan' },
    { thai: 'ล้างจาน', en: 'wash dishes', rom: 'láang-jaan' },
  ]},
  { first: 'High', second: 'Low', words: [
    { thai: 'เนื้อไก่', en: 'chicken meat', rom: 'núea-gài' },
    { thai: 'ช้างใหญ่', en: 'big elephant', rom: 'cháang-yài' },
    { thai: 'น้ำป่า', en: 'flash flood', rom: 'náam-bpàa' },
    { thai: 'เลี้ยงไก่', en: 'raise chickens', rom: 'líang-gài' },
  ]},
  { first: 'High', second: 'Falling', words: [
    { thai: 'นกแก้ว', en: 'parrot', rom: 'nók-gâew' },
    { thai: 'ซื้อผ้า', en: 'buy fabric', rom: 'súe-phâa' },
    { thai: 'เนื้อย่าง', en: 'grilled meat', rom: 'núea-yâang' },
    { thai: 'น้ำเน่า', en: 'stagnant / rotten water', rom: 'náam-nâo' },
  ]},
  { first: 'High', second: 'High', words: [
    { thai: 'ร้านค้า', en: 'shop', rom: 'ráan-kháa' },
    { thai: 'ท้องฟ้า', en: 'sky', rom: 'tháawng-fáa' },
    { thai: 'ล้มแล้ว', en: 'already fell', rom: 'lóm-láew' },
    { thai: 'ร้องแล้ว', en: 'already sang', rom: 'ráawng-láew' },
  ]},
  { first: 'High', second: 'Rising', words: [
    { thai: 'ทุกเสา', en: 'every pole', rom: 'thúk-sǎo' },
    { thai: 'น้ำหอม', en: 'perfume', rom: 'náam-hǎawm' },
    { thai: 'รถเสีย', en: 'broken car', rom: 'rót-sǐa' },
    { thai: 'ย้อมผม', en: 'dye hair', rom: 'yáawm-phǒm' },
    { thai: 'เนื้อหมู', en: 'pork', rom: 'núea-mǔu' },
  ]},
  { first: 'Rising', second: 'Mid', words: [
    { thai: 'หูฟัง', en: 'headphones', rom: 'hǔu-fang' },
    { thai: 'แสงไฟ', en: 'light', rom: 'sǎeng-fai' },
    { thai: 'สีแดง', en: 'red color', rom: 'sǐi-daeng' },
    { thai: 'เสาไฟ', en: 'lamp post', rom: 'sǎo-fai' },
    { thai: 'ผายลม', en: 'fart', rom: 'phǎai-lom' },
  ]},
  { first: 'Rising', second: 'Low', words: [
    { thai: 'หัวแตก', en: 'broken head', rom: 'hǔa-dtàek' },
    { thai: 'ขาวกว่า', en: 'whiter', rom: 'khǎao-gwàa' },
    { thai: 'หนาวอีก', en: 'cold again', rom: 'nǎao-ìik' },
  ]},
  { first: 'Rising', second: 'Falling', words: [
    { thai: 'หมอนข้าง', en: 'bolster', rom: 'mǎawn-khâang' },
    { thai: 'หนาวมาก', en: 'very cold', rom: 'nǎao-mâak' },
    { thai: 'ขาวมาก', en: 'very white', rom: 'khǎao-mâak' },
    { thai: 'สวยมาก', en: 'very beautiful', rom: 'sǔay-mâak' },
    { thai: 'ถุงผ้า', en: 'cloth bag', rom: 'thǔng-phâa' },
  ]},
  { first: 'Rising', second: 'High', words: [
    { thai: 'ถุงเท้า', en: 'socks', rom: 'thǔng-tháo' },
    { thai: 'หัวนี้', en: 'this head', rom: 'hǔa-níi' },
    { thai: 'ผมร้อง', en: 'I sing', rom: 'phǒm-ráawng' },
    { thai: 'หอมเนื้อ', en: 'smell of meat', rom: 'hǎawm-núea' },
    { thai: 'หัวม้า', en: 'horse head', rom: 'hǔa-máa' },
  ]},
  { first: 'Rising', second: 'Rising', words: [
    { thai: 'สีเขียว', en: 'green', rom: 'sǐi-khǐao' },
    { thai: 'สีขาว', en: 'white', rom: 'sǐi-khǎao' },
    { thai: 'หัวหอม', en: 'onion', rom: 'hǔa-hǎawm' },
    { thai: 'หนังสือ', en: 'book', rom: 'nǎng-sǔe' },
    { thai: 'ขายตั๋ว', en: 'sell ticket', rom: 'khǎai-dtǔa' },
  ]},
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
