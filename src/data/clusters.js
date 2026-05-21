// ── Consonant Clusters (พยัญชนะควบกล้ำ) ────────────────────────────

export const CLUSTERS_INTRO =
  'Thai allows a limited set of initial consonant clusters — two consonants that open the same syllable. ' +
  'They fall into two types: อักษรควบแท้ (true clusters) where both consonants are fully pronounced, ' +
  'and อักษรควบไม่แท้ (false clusters) where the second letter is written but silent. ' +
  'The tone class of the syllable is always determined by the first consonant.';

// cls = consonant class of the FIRST (leading) consonant
// special = true → mark with a note chip
export const TRUE_CLUSTER_GROUPS = [
  {
    second: 'ร',
    label: 'Clusters with ร (r)',
    note: 'The most frequent cluster type. In rapid Bangkok speech the /r/ often reduces to a brief schwa or disappears entirely — กราบ may sound like กาบ in casual register.',
    items: [
      {
        cluster: 'กร', rom: 'kr',  cls: 'mid',
        ex: 'กราบ',     exRom: 'kràap',     exEn: 'to prostrate (in respect)',
        more: [{ th: 'กรน', rom: 'kron', en: 'to snore' }, { th: 'กรุณา', rom: 'grù-naa', en: 'please / kindness' }],
      },
      {
        cluster: 'ขร', rom: 'khr', cls: 'high',
        ex: 'ขรุขระ',   exRom: 'khrù-khrà', exEn: 'rough / uneven',
        more: [],
      },
      {
        cluster: 'คร', rom: 'khr', cls: 'low',
        ex: 'ครู',      exRom: 'khruu',     exEn: 'teacher',
        more: [{ th: 'ครอบ', rom: 'khrôop', en: 'to cover' }, { th: 'คร่าว', rom: 'khrâao', en: 'rough / approximate' }],
      },
      {
        cluster: 'ตร', rom: 'tr',  cls: 'mid',
        ex: 'ตรง',      exRom: 'trong',     exEn: 'straight / direct',
        more: [{ th: 'ตรวจ', rom: 'trùat', en: 'to inspect / check' }],
      },
      {
        cluster: 'ตล', rom: 'tl',  cls: 'mid',
        ex: 'ตลาด',     exRom: 'tà-làat',   exEn: 'market',
        more: [{ th: 'ตลก', rom: 'tà-lòk', en: 'funny / comedian' }, { th: 'ตลับ', rom: 'tà-làp', en: 'small compact box' }],
      },
      {
        cluster: 'ปร', rom: 'pr',  cls: 'mid',
        ex: 'ประตู',    exRom: 'prà-dtuu',  exEn: 'door / gate',
        more: [{ th: 'ปราบ', rom: 'pràap', en: 'to suppress / defeat' }],
      },
      {
        cluster: 'พร', rom: 'phr', cls: 'low',
        ex: 'พระ',      exRom: 'phrá',      exEn: 'monk / sacred / royal',
        more: [{ th: 'พร้อม', rom: 'phróom', en: 'ready / together' }, { th: 'พราน', rom: 'phraan', en: 'hunter' }],
      },
      {
        cluster: 'ทร', rom: 'thr / s', cls: 'low', special: true,
        ex: 'ทราย',     exRom: 'saai',      exEn: 'sand',
        more: [{ th: 'ทราบ', rom: 'sâap', en: 'to know / understand' }, { th: 'ทรวง', rom: 'thruang', en: 'chest (body) — /thr/ pronunciation' }],
      },
      {
        cluster: 'ฝร', rom: 'fr',  cls: 'high', special: true,
        ex: 'ฝรั่ง',    exRom: 'fà-ràng',   exEn: 'Westerner / guava',
        more: [{ th: 'ฝรั่งเศส', rom: 'fà-ràng-sèet', en: 'France' }],
      },
    ],
  },
  {
    second: 'ล',
    label: 'Clusters with ล (l)',
    note: null,
    items: [
      {
        cluster: 'กล', rom: 'kl',  cls: 'mid',
        ex: 'กลาง',     exRom: 'klaang',    exEn: 'middle / center',
        more: [{ th: 'กลม', rom: 'klom', en: 'round' }, { th: 'กล้วย', rom: 'klûay', en: 'banana' }],
      },
      {
        cluster: 'ขล', rom: 'khl', cls: 'high',
        ex: 'ขลุ่ย',    exRom: 'khlùi',     exEn: 'Thai wooden flute',
        more: [{ th: 'ขลัง', rom: 'khlǎng', en: 'sacred / having potent power' }],
      },
      {
        cluster: 'คล', rom: 'khl', cls: 'low',
        ex: 'คลอง',     exRom: 'khlong',    exEn: 'canal',
        more: [{ th: 'คลื่น', rom: 'khlûen', en: 'wave' }, { th: 'คลาย', rom: 'khlaai', en: 'to loosen / relax' }],
      },
      {
        cluster: 'ปล', rom: 'pl',  cls: 'mid',
        ex: 'ปลา',      exRom: 'plaa',      exEn: 'fish',
        more: [{ th: 'ปลาย', rom: 'plaai', en: 'end / tip' }, { th: 'ปลุก', rom: 'plùk', en: 'to wake someone up' }],
      },
      {
        cluster: 'ผล', rom: 'phl', cls: 'high',
        ex: 'ผล',       exRom: 'phǒn',      exEn: 'result / fruit',
        more: [{ th: 'ผลไม้', rom: 'phǒn-lámai', en: 'fruit (food)' }],
      },
      {
        cluster: 'พล', rom: 'phl', cls: 'low',
        ex: 'พลาด',     exRom: 'phlâat',    exEn: 'to miss / to fail',
        more: [{ th: 'พล', rom: 'phon', en: 'force / power / soldier' }],
      },
      {
        cluster: 'ฟล', rom: 'fl',  cls: 'low', special: true,
        ex: 'ฟลุก',     exRom: 'flûk',      exEn: 'lucky (loanword: fluke)',
        more: [{ th: 'ฟลอร์', rom: 'flɔɔ', en: 'floor (loanword)' }],
      },
    ],
  },
  {
    second: 'ว',
    label: 'Clusters with ว (w)',
    note: null,
    items: [
      {
        cluster: 'กว', rom: 'kw',  cls: 'mid',
        ex: 'กว้าง',    exRom: 'kwâang',    exEn: 'wide',
        more: [{ th: 'กวาง', rom: 'kwaang', en: 'deer' }, { th: 'กว่า', rom: 'kwàa', en: 'more than / while' }],
      },
      {
        cluster: 'ขว', rom: 'khw', cls: 'high',
        ex: 'ขวา',      exRom: 'khwǎa',     exEn: 'right (direction)',
        more: [{ th: 'ขวาง', rom: 'khwǎang', en: 'to obstruct / be in the way' }, { th: 'ขวัญ', rom: 'khwǎn', en: 'morale / spirit' }],
      },
      {
        cluster: 'คว', rom: 'khw', cls: 'low',
        ex: 'ความ',     exRom: 'khwaam',    exEn: 'abstract noun prefix',
        more: [{ th: 'คว้า', rom: 'khwâa', en: 'to snatch / grab' }, { th: 'ควาย', rom: 'khwaai', en: 'water buffalo' }],
      },
    ],
  },
];

// False/silent clusters — ร is written but not pronounced
export const FALSE_CLUSTERS = [
  {
    cluster: 'ทร',
    rom: 's',
    cls: 'low',
    note: 'Mostly pronounced /s/ in everyday vocabulary. A handful of formal/poetic words retain /thr/.',
    items: [
      { th: 'ทราย', rom: 'saai', en: 'sand' },
      { th: 'ทราบ', rom: 'sâap', en: 'to know / understand (formal)' },
      { th: 'ทรุด', rom: 'sùt', en: 'to deteriorate / sink' },
      { th: 'ทรง', rom: 'song', en: 'to maintain / shape (honorific)' },
      { th: 'ทรวง', rom: 'thruang', en: 'chest (body) ← /thr/ retained' },
    ],
  },
  {
    cluster: 'สร',
    rom: 's',
    cls: 'high',
    note: 'The ร is always silent. Tone is determined by ส (high class).',
    items: [
      { th: 'สร้าง', rom: 'sâang', en: 'to build / create' },
      { th: 'สรุป', rom: 'sà-rùp', en: 'to summarise' },
      { th: 'สระ', rom: 'sà-rà', en: 'vowel / swimming pool' },
      { th: 'สรวล', rom: 'sǔan', en: 'to laugh (literary)' },
    ],
  },
  {
    cluster: 'ศร',
    rom: 's',
    cls: 'high',
    note: 'The ร is silent. ศ is a high-class consonant making the same /s/ sound as ส.',
    items: [
      { th: 'ศร', rom: 'sǒon', en: 'arrow' },
      { th: 'ศรี', rom: 'sǐi', en: 'glory / auspiciousness (title)' },
      { th: 'ศรัทธา', rom: 'sàt-thaa', en: 'faith / devotion' },
    ],
  },
];

export const CLUSTER_RULES = [
  {
    heading: 'Tone class = first consonant',
    body: 'In any cluster, the tone of the syllable follows the class of the leading (first) consonant. ' +
          'กร uses mid-class rules (from ก). คร uses low-class rules (from ค). The second consonant ร/ล/ว ' +
          'contributes only to the opening sound.',
  },
  {
    heading: 'ทร — dual reading',
    body: 'The cluster ทร has two pronunciations depending on the word\'s origin. ' +
          'In common Thai-origin vocabulary it is read as /s/ (ทราย → saai, ทราบ → saap). ' +
          'In some formal or literary words the full /thr/ cluster is preserved (ทรวง → thruang). ' +
          'When in doubt, /s/ is more likely in everyday speech.',
  },
  {
    heading: 'Clusters in rapid speech',
    body: 'In casual Bangkok Thai, clusters ending in ร are frequently simplified: the /r/ weakens to ' +
          'a schwa or drops entirely. กลาย may be heard as /klaai/ in careful speech but closer to /laai/ ' +
          'at speed. Aim for the full cluster when speaking carefully or formally.',
  },
  {
    heading: 'ฝร and ฟล — loanword clusters',
    body: 'ฝรั่ง (Westerner / guava) contains ฝร, originally from a foreign-language borrowing. ' +
          'ฟล appears in modern English loanwords (ฟลุก, ฟลอร์). These clusters are not productive in ' +
          'native Thai vocabulary.',
  },
];
