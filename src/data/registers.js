// Register & Formality data
// Four registers shown for each common situation:
//   formal   — written Thai, official documents, speeches, news
//   polite   — everyday spoken with strangers / elders / colleagues (uses ครับ/ค่ะ)
//   casual   — with friends, family, peers (drops politeness particles)
//   slang    — very informal, youth language, texting, online

export const REGISTER_INTRO = `Thai has four clearly distinct registers that learners rarely study side by side. The same idea can sound perfectly natural — or bizarrely wrong — depending on who you're talking to. This table shows 15 everyday situations across all four levels so you can see exactly how the language shifts.`;

export const REGISTER_LABELS = {
  formal: { th: 'ทางการ', en: 'Formal / Written', color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/40', border: 'border-blue-200 dark:border-blue-800' },
  polite: { th: 'สุภาพ',  en: 'Polite Spoken',    color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40', border: 'border-emerald-200 dark:border-emerald-800' },
  casual: { th: 'ปกติ',   en: 'Casual',           color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40', border: 'border-amber-200 dark:border-amber-800' },
  slang:  { th: 'สแลง',   en: 'Slang / Online',   color: 'text-purple-700 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/40', border: 'border-purple-200 dark:border-purple-800' },
};

export const REGISTER_CATEGORIES = [
  {
    id: 'greetings',
    label: 'Greetings & Farewells',
    items: [
      {
        id: 'hello',
        concept: 'Hello',
        context: 'Greeting someone',
        formal: { thai: 'สวัสดีครับ / ค่ะ', rom: 'sa-wat-di khrap / kha', note: 'Standard — already formal enough for any context' },
        polite: { thai: 'สวัสดีครับ / ค่ะ', rom: 'sa-wat-di khrap / kha', note: 'Same form — the polite greeting is the default in Thai' },
        casual: { thai: 'หวัดดี', rom: 'wat-di', note: 'Truncated สวัสดี — with close friends only' },
        slang:  { thai: 'เฮ้ / ว้าย', rom: 'he / waai', note: 'Borrowed from English "hey" / "wai" — texting and youth speech' },
      },
      {
        id: 'goodbye',
        concept: 'Goodbye / See you',
        context: 'Leaving or ending a conversation',
        formal: { thai: 'ลากลับแล้วครับ / ค่ะ', rom: 'la klap laeo khrap / kha', note: 'Polite announcement of departure' },
        polite: { thai: 'ลาก่อนนะครับ / ค่ะ', rom: 'la kon na khrap / kha', note: 'Common polite farewell' },
        casual: { thai: 'ลาก่อน / แล้วเจอกัน', rom: 'la kon / laeo choe kan', note: 'Everyday, particle dropped' },
        slang:  { thai: 'บาย / โบ๊ะ', rom: 'bai / bo', note: '"Bye" borrowed from English; โบ๊ะ is playful/youth' },
      },
    ],
  },
  {
    id: 'gratitude',
    label: 'Gratitude & Apology',
    items: [
      {
        id: 'thank-you',
        concept: 'Thank you',
        context: 'Expressing gratitude',
        formal: { thai: 'ขอขอบพระคุณอย่างสูง', rom: 'kho khop phra khun yang sung', note: 'Highly formal — letters, speeches, addressing superiors' },
        polite: { thai: 'ขอบคุณมากครับ / ค่ะ', rom: 'khop khun mak khrap / kha', note: 'Standard everyday thank-you' },
        casual: { thai: 'ขอบใจนะ', rom: 'khop jai na', note: 'Warmer and less stiff than ขอบคุณ — for peers' },
        slang:  { thai: 'ขอบๆ นะ / ขอบคุณมากกก', rom: 'khop khop na / khop khun makkkk', note: 'Repeated letters for emphasis — common in line/chat' },
      },
      {
        id: 'sorry',
        concept: 'Sorry / Excuse me',
        context: 'Apologising or getting attention',
        formal: { thai: 'ขออภัยเป็นอย่างยิ่ง', rom: 'kho aphai pen yang ying', note: 'Deep formal apology — written letters, official contexts' },
        polite: { thai: 'ขอโทษนะครับ / ค่ะ', rom: 'kho thot na khrap / kha', note: 'Standard polite apology or polite interruption' },
        casual: { thai: 'ขอโทษ / โทษทีนะ', rom: 'kho thot / thot thi na', note: 'Everyday quick apology between friends' },
        slang:  { thai: 'ซอร์รี่ / ผิดเองนะ', rom: 'sorry / phit eng na', note: 'English borrow common among younger speakers' },
      },
    ],
  },
  {
    id: 'understanding',
    label: 'Understanding & Agreement',
    items: [
      {
        id: 'i-see',
        concept: 'I understand / Got it',
        context: 'Confirming you follow what was said',
        formal: { thai: 'รับทราบครับ / ค่ะ', rom: 'rap sap khrap / kha', note: 'Military/official acknowledgement — "noted and understood"' },
        polite: { thai: 'เข้าใจแล้วครับ / ค่ะ', rom: 'khao jai laeo khrap / kha', note: 'Clear and polite confirmation' },
        casual: { thai: 'โอเค / เข้าใจ', rom: 'o-ke / khao jai', note: 'Everyday — particle dropped' },
        slang:  { thai: 'โอเคเลย / เข้าใจๆ', rom: 'o-ke loei / khao jai khao jai', note: 'Repeated word for casual emphasis' },
      },
      {
        id: 'i-agree',
        concept: 'I agree / That\'s right',
        context: 'Expressing agreement',
        formal: { thai: 'เห็นด้วยอย่างยิ่งครับ / ค่ะ', rom: 'hen duai yang ying khrap / kha', note: 'Emphatic formal agreement' },
        polite: { thai: 'เห็นด้วยครับ / ค่ะ', rom: 'hen duai khrap / kha', note: 'Standard polite agreement' },
        casual: { thai: 'ใช่เลย / ถูกต้อง', rom: 'chai loei / thuk tong', note: 'Everyday affirmation' },
        slang:  { thai: 'ใช่เลยยย / ปัง', rom: 'chai loei-y / pang', note: 'ปัง = "on point / totally right" — current youth slang' },
      },
      {
        id: 'never-mind',
        concept: 'Never mind / It\'s OK',
        context: 'Dismissing an issue',
        formal: { thai: 'ไม่เป็นไรครับ / ค่ะ', rom: 'mai pen rai khrap / kha', note: 'Polite and formal — works everywhere' },
        polite: { thai: 'ไม่เป็นไรครับ / ค่ะ', rom: 'mai pen rai khrap / kha', note: 'Same as formal — ไม่เป็นไร is already neutral' },
        casual: { thai: 'ไม่เป็นไร', rom: 'mai pen rai', note: 'Dropped particle — famous phrase, very common' },
        slang:  { thai: 'ช่างมัน / โอเคอยู่', rom: 'chang man / o-ke yu', note: 'ช่างมัน = "whatever / forget it" — more dismissive' },
      },
    ],
  },
  {
    id: 'questions',
    label: 'Questions & Responses',
    items: [
      {
        id: 'dont-know',
        concept: 'I don\'t know',
        context: 'Admitting you lack information',
        formal: { thai: 'ไม่ทราบครับ / ค่ะ', rom: 'mai sap khrap / kha', note: 'ทราบ is the formal verb for "to know" — used with superiors' },
        polite: { thai: 'ไม่รู้ครับ / ค่ะ', rom: 'mai ru khrap / kha', note: 'รู้ is the everyday verb for "to know"' },
        casual: { thai: 'ไม่รู้', rom: 'mai ru', note: 'Particle dropped — fine with friends' },
        slang:  { thai: 'ไม่รู้วะ / ไม่รู้เลยอะ', rom: 'mai ru wa / mai ru loei a', note: 'วะ and อะ are informal sentence particles — adds attitude' },
      },
      {
        id: 'where-going',
        concept: 'Where are you going?',
        context: 'Asking someone\'s destination (common Thai small talk)',
        formal: { thai: 'ท่านจะเดินทางไปที่ใดครับ / ค่ะ', rom: 'than cha doen thang pai thi dai khrap / kha', note: 'ท่าน = formal "you"; เดินทาง = formal "travel"' },
        polite: { thai: 'คุณจะไปไหนครับ / ค่ะ', rom: 'khun cha pai nai khrap / kha', note: 'คุณ = standard polite "you"' },
        casual: { thai: 'ไปไหน', rom: 'pai nai', note: 'Subject dropped — this is standard small-talk, not rude' },
        slang:  { thai: 'ไปไหนมา / ออกไปไหนวะ', rom: 'pai nai ma / ok pai nai wa', note: 'ไปไหนมา = "where have you been?" — implies you\'ve been away' },
      },
      {
        id: 'what-think',
        concept: 'What do you think?',
        context: 'Asking for someone\'s opinion',
        formal: { thai: 'ท่านมีความคิดเห็นอย่างไรครับ / ค่ะ', rom: 'than mi khwam khit hen yang rai khrap / kha', note: 'Full formal construction — written memos, formal meetings' },
        polite: { thai: 'คิดยังไงครับ / ค่ะ', rom: 'khit yang ngai khrap / kha', note: 'Casual word order but polite particles' },
        casual: { thai: 'คิดยังไง / ว่าไง', rom: 'khit yang ngai / wa ngai', note: 'ว่าไง = "what do you say?" — very direct but not rude' },
        slang:  { thai: 'คิดว่าไงอะ / ว่าไงดีอ่ะ', rom: 'khit wa ngai a / wa ngai di a', note: 'อ่ะ/อะ softens the question in casual speech' },
      },
    ],
  },
  {
    id: 'requests',
    label: 'Requests & Reactions',
    items: [
      {
        id: 'please-wait',
        concept: 'Please wait a moment',
        context: 'Asking someone to hold on',
        formal: { thai: 'กรุณารอสักครู่ครับ / ค่ะ', rom: 'ka ru na ro sak khru khrap / kha', note: 'กรุณา = formal "please" — used in official settings, announcements' },
        polite: { thai: 'รอสักครู่นะครับ / ค่ะ', rom: 'ro sak khru na khrap / kha', note: 'Warm and polite — common in shops and service contexts' },
        casual: { thai: 'รอก่อนนะ', rom: 'ro kon na', note: 'ก่อน = "first/a moment" — everyday with friends' },
        slang:  { thai: 'แป๊บนึง / เดี๋ยวๆ', rom: 'paep nueng / diao diao', note: 'แป๊บนึง = "just a sec" — very quick and casual' },
      },
      {
        id: 'help-me',
        concept: 'Please help me',
        context: 'Asking for assistance',
        formal: { thai: 'ขอความกรุณาช่วยเหลือด้วยครับ / ค่ะ', rom: 'kho khwam ka ru na chuai lue duai khrap / kha', note: 'Highly formal — written requests, urgent official contexts' },
        polite: { thai: 'ช่วยหน่อยได้ไหมครับ / ค่ะ', rom: 'chuai noi dai mai khrap / kha', note: 'Standard polite request — หน่อย softens it naturally' },
        casual: { thai: 'ช่วยหน่อยนะ', rom: 'chuai noi na', note: 'Direct but friendly — fine with friends' },
        slang:  { thai: 'ช่วยทีเลย / ขอแรงหน่อย', rom: 'chuai thi loei / kho raeng noi', note: 'ขอแรง = "lend me your strength" — playful casual request' },
      },
      {
        id: 'delicious',
        concept: 'It\'s delicious',
        context: 'Reacting to food you enjoy',
        formal: { thai: 'อาหารนี้มีรสชาติดีมากครับ / ค่ะ', rom: 'a-han ni mi rot chat di mak khrap / kha', note: 'Full descriptive sentence — appropriate at formal dinners' },
        polite: { thai: 'อร่อยมากครับ / ค่ะ', rom: 'a-roi mak khrap / kha', note: 'Simple, warm, and polite — the standard compliment' },
        casual: { thai: 'อร่อยเลย', rom: 'a-roi loei', note: 'เลย intensifies — very natural between friends' },
        slang:  { thai: 'อร่อยโคตร / ปังมาก', rom: 'a-roi khoet / pang mak', note: 'โคตร = extremely (crude intensifier); ปัง = "it\'s everything"' },
      },
      {
        id: 'tired',
        concept: 'I\'m tired',
        context: 'Expressing fatigue',
        formal: { thai: 'รู้สึกเหนื่อยล้ามากครับ / ค่ะ', rom: 'ru suek nueai la mak khrap / kha', note: 'Full verb phrase — appropriate in formal reports of wellbeing' },
        polite: { thai: 'เหนื่อยมากครับ / ค่ะ', rom: 'nueai mak khrap / kha', note: 'Common polite expression of tiredness' },
        casual: { thai: 'เหนื่อย / ล้าแล้ว', rom: 'nueai / la laeo', note: 'ล้า = utterly exhausted; used between friends' },
        slang:  { thai: 'เหนื่อยมากกก / ดับแล้ว', rom: 'nueai makkk / dap laeo', note: 'ดับแล้ว = "I\'m dead/burnt out" — youth slang for total exhaustion' },
      },
    ],
  },
];
