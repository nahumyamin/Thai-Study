export const MISTAKE_SENTENCES = [
  // ── classifier errors ────────────────────────────────────────────
  {
    words: ['ผม', 'มี', 'แมว', 'สาม', 'คน'],
    errorIndex: 4,
    correction: 'ตัว',
    explanation: '"ตัว" is the classifier for animals. "คน" is reserved for people.',
    category: 'classifier',
  },
  {
    words: ['เขา', 'ซื้อ', 'รถ', 'ใหม่', 'สอง', 'ตัว'],
    errorIndex: 5,
    correction: 'คัน',
    explanation: '"คัน" is the classifier for wheeled vehicles. "ตัว" is used for animals.',
    category: 'classifier',
  },
  {
    words: ['ฉัน', 'อยาก', 'กิน', 'ไก่', 'สาม', 'คน'],
    errorIndex: 5,
    correction: 'ชิ้น',
    explanation: '"ชิ้น" is used for pieces of food. "คน" is only for people.',
    category: 'classifier',
  },
  {
    words: ['ที่', 'ห้องสมุด', 'มี', 'หนังสือ', 'หลาย', 'คัน'],
    errorIndex: 5,
    correction: 'เล่ม',
    explanation: '"เล่ม" is the classifier for books. "คัน" is for vehicles.',
    category: 'classifier',
  },
  {
    words: ['น้อง', 'เลี้ยง', 'ปลา', 'สวย', 'สาม', 'ใบ'],
    errorIndex: 5,
    correction: 'ตัว',
    explanation: '"ตัว" is the classifier for animals including fish. "ใบ" is for flat objects.',
    category: 'classifier',
  },

  // ── negation errors ──────────────────────────────────────────────
  {
    words: ['เขา', 'ไม่ใช่', 'เข้าใจ', 'บทเรียน', 'นี้'],
    errorIndex: 1,
    correction: 'ไม่',
    explanation: '"ไม่" negates verbs and adjectives. "ไม่ใช่" is used to negate noun predicates (he is not a teacher), not verb phrases.',
    category: 'negation',
  },
  {
    words: ['ฉัน', 'ไม่', 'ใช่', 'นักเรียน', 'ดี'],
    errorIndex: 1,
    correction: 'ไม่ใช่',
    explanation: 'When negating "to be [noun]", Thai uses "ไม่ใช่" as a single unit — not separate "ไม่" + "ใช่".',
    category: 'negation',
  },
  {
    words: ['เธอ', 'ชอบ', 'ไม่', 'อาหาร', 'เผ็ด'],
    errorIndex: 2,
    correction: 'ไม่ชอบ',
    explanation: '"ไม่" must come directly before the verb it negates. It cannot appear after the subject and before the object.',
    category: 'negation',
  },
  {
    words: ['ผม', 'กิน', 'ข้าว', 'ไม่', 'แล้ว'],
    errorIndex: 3,
    correction: 'ไม่ได้',
    explanation: 'To negate a past completed action, Thai uses "ไม่ได้" before the verb, not bare "ไม่" after the object.',
    category: 'negation',
  },

  // ── adjective order errors ───────────────────────────────────────
  {
    words: ['เธอ', 'กิน', 'อร่อย', 'อาหาร'],
    errorIndex: 2,
    correction: 'อาหาร',
    explanation: 'In Thai, adjectives follow the noun they describe — "อาหารอร่อย" (tasty food), not "อร่อยอาหาร".',
    category: 'adjective-order',
  },
  {
    words: ['ผม', 'มี', 'ใหม่', 'รถ', 'คันหนึ่ง'],
    errorIndex: 2,
    correction: 'รถ',
    explanation: 'Thai adjectives come after the noun: "รถใหม่" (new car). Placing the adjective before the noun is an English-style error.',
    category: 'adjective-order',
  },
  {
    words: ['เขา', 'เป็น', 'ดี', 'คนทำงาน'],
    errorIndex: 2,
    correction: 'คนทำงาน',
    explanation: '"ดี" (good) must follow the noun: "คนทำงานดี" (a good worker). Adjectives never precede nouns in Thai.',
    category: 'adjective-order',
  },
  {
    words: ['ฉัน', 'ซื้อ', 'สวย', 'ชุด', 'ตัวนี้'],
    errorIndex: 2,
    correction: 'ชุด',
    explanation: 'Descriptive adjectives in Thai follow their noun. "ชุดสวย" means "beautiful dress" — not "สวยชุด".',
    category: 'adjective-order',
  },

  // ── aspect marker errors ─────────────────────────────────────────
  {
    words: ['เขา', 'กิน', 'กำลัง', 'ข้าว', 'อยู่'],
    errorIndex: 2,
    correction: 'กำลัง',
    explanation: '"กำลัง" marks ongoing action and must come directly before the verb: "กำลังกิน" (is eating), not after the subject and after the verb.',
    category: 'aspect-marker',
  },
  {
    words: ['ฉัน', 'จะ', 'ไป', 'แล้ว', 'ตลาด'],
    errorIndex: 3,
    correction: 'ตลาด',
    explanation: '"แล้ว" (already/completion) follows the verb or at the end — it should not interrupt the verb-object relationship.',
    category: 'aspect-marker',
  },
  {
    words: ['พวกเขา', 'แล้ว', 'กลับ', 'บ้าน', 'ไป'],
    errorIndex: 1,
    correction: 'กลับ',
    explanation: '"แล้ว" indicating completion comes after the verb phrase, not before it. The correct order is subject → verb → แล้ว.',
    category: 'aspect-marker',
  },
  {
    words: ['เธอ', 'จะ', 'กำลัง', 'เรียน', 'พรุ่งนี้'],
    errorIndex: 2,
    correction: 'เรียน',
    explanation: '"กำลัง" marks present progressive and cannot combine with "จะ" (future). Remove กำลัง — use จะ alone for future actions.',
    category: 'aspect-marker',
  },

  // ── question particle errors ─────────────────────────────────────
  {
    words: ['คุณ', 'ชอบ', 'กาแฟ', 'ไหม', 'ร้อน'],
    errorIndex: 3,
    correction: 'ร้อน',
    explanation: '"ไหม" is a yes/no question particle that must come at the very end of the sentence — nothing can follow it.',
    category: 'question-particle',
  },
  {
    words: ['ไหม', 'คุณ', 'เป็น', 'คนไทย'],
    errorIndex: 0,
    correction: 'คุณ',
    explanation: '"ไหม" is a sentence-final particle in Thai. It must come at the end, never at the beginning of a sentence.',
    category: 'question-particle',
  },
  {
    words: ['เขา', 'อยู่', 'ที่นี่', 'เหรอ', 'ยัง'],
    errorIndex: 3,
    correction: 'ยัง',
    explanation: '"เหรอ" is a sentence-final particle expressing mild surprise or confirmation. "ยัง" (still) must come after the subject and before the verb — not after เหรอ.',
    category: 'question-particle',
  },
];
