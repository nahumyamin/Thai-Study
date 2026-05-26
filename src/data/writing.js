export const WRITING_INTRO = `Writing Thai well is less about grammar rules and more about register, connector choice, and knowing when to omit. The biggest shift from speaking to writing is formality: spoken particles, casual connectors, and pronoun-heavy sentences all mark written text as amateurish. The strategies here focus on what actually moves your writing from accurate to natural.`;

export const WRITING_SECTIONS = [
  {
    id: 'register',
    title: 'Register: formal vs. spoken',
    body: `Thai has a sharper formal/spoken divide than most languages. Connectors, verbs, and even common nouns have distinct written equivalents that rarely appear in speech. Using a spoken form in formal writing signals low literacy; using a formal form in casual writing sounds stiff. Knowing which register fits the context is the single biggest lever for writing quality.`,
    registerTable: [
      { spoken: 'เพราะ / เพราะว่า', formal: 'เนื่องจาก', meaning: 'because' },
      { spoken: 'ถ้า / ถ้าหาก', formal: 'หาก / หากว่า', meaning: 'if' },
      { spoken: 'ก็เลย / เลย', formal: 'จึง / ดังนั้น', meaning: 'therefore, so' },
      { spoken: 'แต่', formal: 'อย่างไรก็ตาม / ทว่า', meaning: 'however' },
      { spoken: 'บอกว่า', formal: 'กล่าวว่า / ระบุว่า', meaning: 'said that / states that' },
      { spoken: 'ตอนนี้', formal: 'ในปัจจุบัน / ขณะนี้', meaning: 'currently, at present' },
      { spoken: 'เยอะ / เยอะมาก', formal: 'มาก / จำนวนมาก', meaning: 'a lot, many' },
      { spoken: 'อยากจะ / อยาก', formal: 'ต้องการ / มุ่งหวัง', meaning: 'want to, wish to' },
    ],
  },
  {
    id: 'structure',
    title: 'Thai sentence structure',
    body: `Thai is topic-prominent — the topic is introduced first, then commented on. Subject pronouns are routinely dropped when context makes them clear. Tense is carried by time markers and particles, not verb forms. Understanding these patterns prevents the most common translation-from-English errors.`,
    tips: [
      { text: 'Drop subject pronouns when context is clear. Repeating ผม/ฉัน/เขา in every sentence reads as unnatural or overly emphatic.' },
      { text: 'Front the topic. เรื่องนี้... (as for this matter...) or สำหรับ... (as for...) are natural topic-openers in formal Thai.' },
      { text: 'Use time markers instead of verb tenses. แล้ว (completed), จะ (future), กำลัง (progressive) carry all temporal meaning.' },
      { text: 'Classifiers are expected in formal writing. เด็กสองคน not เด็กสอง; นักศึกษาสามคน not นักศึกษาสาม.' },
      { text: 'Move descriptive weight after the verb. Thai avoids heavy pre-verbal noun phrases — stack modifiers after the noun using ที่.' },
    ],
  },
  {
    id: 'connectors',
    title: 'Linking ideas',
    body: `Clear Thai writing uses connectors deliberately — one type per logical relationship. Overusing แต่ for every contrast, or เพราะ for every reason, flattens the logic of your prose. Matching the connector to the relationship (cause, contrast, addition, result, condition) makes arguments far easier to follow.`,
    approaches: [
      {
        name: 'Cause & reason',
        desc: 'เพราะ / เพราะว่า (spoken), เนื่องจาก (formal). Place before the reason clause. เนื่องจากต้นทุนสูงขึ้น บริษัทจึงปรับราคาสินค้า',
      },
      {
        name: 'Result & conclusion',
        desc: 'จึง and ดังนั้น for formal writing; ก็เลย for casual. จึง follows the subject directly. ดังนั้น / เพราะฉะนั้น opens a new clause.',
      },
      {
        name: 'Contrast & concession',
        desc: 'แต่ (simple), อย่างไรก็ตาม (formal "however"), ทั้งๆ ที่ (despite), แม้ว่า (even though). อย่างไรก็ตาม opens a new sentence, never mid-clause.',
      },
      {
        name: 'Addition',
        desc: 'นอกจากนี้ / นอกจากนั้น (moreover), ยิ่งไปกว่านั้น (what\'s more), อีกทั้ง (furthermore). Use these to extend an argument across sentences.',
      },
      {
        name: 'Condition',
        desc: 'ถ้า (spoken), หาก / หากว่า (formal). Follow with ก็ in the result clause: หากมีปัญหา ก็ควรแจ้งเจ้าหน้าที่',
      },
      {
        name: 'Purpose',
        desc: 'เพื่อ / เพื่อที่จะ (in order to). Place directly before the purpose verb. โครงการนี้จัดขึ้นเพื่อช่วยเหลือผู้ที่ได้รับผลกระทบ',
      },
    ],
  },
  {
    id: 'pitfalls',
    title: 'Common pitfalls',
    body: `Most writing errors in Thai come from a small set of habits carried over from English. Knowing these in advance prevents the most frequent mistakes.`,
    tips: [
      { text: 'Avoid spoken particles in writing. นะ, อะ, เนอะ, ว่ะ are exclusively spoken. Even ครับ/ค่ะ rarely appears mid-paragraph in formal text.' },
      { text: 'Don\'t stack modifiers before the noun. English puts them before; Thai puts them after using ที่. ผู้ชายที่สูงและหล่อ ✓, ผู้ชายสูงหล่อ ✗ (in formal writing).' },
      { text: 'เกินไป follows the adjective — never precedes it. แพงเกินไป ✓, เกินไปแพง ✗.' },
      { text: 'Match the negator to the sentence type. ไม่ negates verbs and adjectives; อย่า is for commands and prohibitions only.' },
      { text: 'ก็ is not always "also." It can mean "then," "so," or link a topic to its comment. Read it in context before translating.' },
    ],
  },
  {
    id: 'fluency',
    title: 'Building writing fluency',
    body: `Writing fluency in Thai comes from imitation before innovation. Modelling good Thai prose is more effective than writing freely from the start.`,
    tips: [
      { text: 'Copy model sentences. Choose well-written Thai texts and retype them. This ingrains rhythm, connector placement, and sentence length naturally.' },
      { text: 'Translate short English paragraphs into Thai, then compare with a native text on the same topic. The gap shows exactly what patterns to study.' },
      { text: 'Write one paragraph daily, not occasional long essays. Regular short practice builds more than sporadic bursts.' },
      { text: 'Read your writing aloud. Thai writing that sounds unnatural when spoken usually has a structural problem — this test catches awkward word order quickly.' },
      { text: 'Focus on connectors first. A paragraph with accurate nouns and verbs but poor connectors reads as a list. Get the logical links right and fluency follows.' },
    ],
  },
];
