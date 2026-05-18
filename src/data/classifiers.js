export const CLASSIFIERS_INTRO = `Thai requires a <em>classifier</em> (ลักษณนาม) between a number and the noun it counts — similar to English "two <em>cups of</em> tea" or "three <em>sheets of</em> paper", but mandatory for every noun. The pattern is: <strong>noun + number + classifier</strong>. Without the right classifier, the sentence sounds grammatically incomplete.`;

export const CLASSIFIER_GROUPS = [
  {
    label: 'People & living things',
    items: [
      { thai: 'คน', rom: 'khon', en: 'person', nouns: 'people, humans', example: 'นักเรียนสองคน — two students' },
      { thai: 'ตัว', rom: 'tua', en: 'body', nouns: 'animals, shirts, tables, chairs, letters (alphabet)', example: 'หมาสามตัว — three dogs' },
      { thai: 'องค์', rom: 'ong', en: 'body (royal)', nouns: 'monks, royalty, Buddha images', example: 'พระสี่องค์ — four monks' },
    ],
  },
  {
    label: 'Flat & thin objects',
    items: [
      { thai: 'แผ่น', rom: 'phaen', en: 'sheet / slice', nouns: 'paper, CDs, bread slices, tiles, sheets', example: 'กระดาษห้าแผ่น — five sheets of paper' },
      { thai: 'ใบ', rom: 'bai', en: 'leaf', nouns: 'leaves, cards, tickets, documents, bills, bags, bowls, cups', example: 'ตั๋วสองใบ — two tickets' },
      { thai: 'ผืน', rom: 'phuen', en: 'sheet (fabric)', nouns: 'cloth, rugs, flags, mats', example: 'ผ้าสองผืน — two pieces of cloth' },
    ],
  },
  {
    label: 'Long & rod-like objects',
    items: [
      { thai: 'เล่ม', rom: 'lem', en: 'volume', nouns: 'books, notebooks, knives, candles, needles', example: 'หนังสือสามเล่ม — three books' },
      { thai: 'อัน', rom: 'an', en: 'piece / item', nouns: 'small objects (general default): rings, keys, pens, tools', example: 'กุญแจสองอัน — two keys' },
      { thai: 'ด้าม', rom: 'dam', en: 'handle', nouns: 'pens, pencils, umbrellas', example: 'ปากกาหนึ่งด้าม — one pen' },
    ],
  },
  {
    label: 'Vehicles & buildings',
    items: [
      { thai: 'คัน', rom: 'khan', en: 'handle', nouns: 'cars, motorbikes, bicycles, spoons, forks, umbrellas', example: 'รถสองคัน — two cars' },
      { thai: 'ลำ', rom: 'lam', en: 'hull', nouns: 'boats, aircraft', example: 'เครื่องบินสามลำ — three planes' },
      { thai: 'หลัง', rom: 'lang', en: 'back', nouns: 'houses, buildings', example: 'บ้านสองหลัง — two houses' },
      { thai: 'ห้อง', rom: 'hong', en: 'room', nouns: 'rooms (counted as rooms)', example: 'ห้องเช่าสามห้อง — three rental rooms' },
    ],
  },
  {
    label: 'Food, containers & servings',
    items: [
      { thai: 'จาน', rom: 'jan', en: 'plate', nouns: 'plates of food, dishes ordered', example: 'ผัดไทยสองจาน — two plates of pad thai' },
      { thai: 'ถ้วย', rom: 'thuai', en: 'cup/bowl', nouns: 'cups of drink, bowls of food', example: 'กาแฟหนึ่งถ้วย — one cup of coffee' },
      { thai: 'ขวด', rom: 'khuat', en: 'bottle', nouns: 'bottles of liquid', example: 'น้ำสองขวด — two bottles of water' },
      { thai: 'ชิ้น', rom: 'chin', en: 'piece', nouns: 'pieces of food, cloth, meat', example: 'ไก่สามชิ้น — three pieces of chicken' },
    ],
  },
  {
    label: 'Miscellaneous & general',
    items: [
      { thai: 'ครั้ง', rom: 'khrang', en: 'time / occasion', nouns: 'times, occasions, instances', example: 'มาสามครั้ง — came three times' },
      { thai: 'อย่าง', rom: 'yang', en: 'kind / type', nouns: 'types, kinds, varieties', example: 'ผักสองอย่าง — two kinds of vegetable' },
      { thai: 'แห่ง', rom: 'haeng', en: 'place', nouns: 'places, locations, institutions', example: 'ร้านสะดวกซื้อสองแห่ง — two convenience stores' },
      { thai: 'งาน', rom: 'ngan', en: 'event / work', nouns: 'events, ceremonies, jobs', example: 'งานศพหนึ่งงาน — one funeral' },
    ],
  },
];
