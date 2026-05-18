export const NUMBERS_INTRO = `Thai has its own numeral symbols (๐–๙) used alongside Arabic numerals in everyday life — on lottery tickets, official documents, clocks, and building floors. Both systems use the same spoken words, so learning the symbols is simply a matter of recognition.`;

export const DIGITS = [
  { thai: '๐', arabic: 0, word: 'ศูนย์', rom: 'suun' },
  { thai: '๑', arabic: 1, word: 'หนึ่ง', rom: 'nueng' },
  { thai: '๒', arabic: 2, word: 'สอง', rom: 'song' },
  { thai: '๓', arabic: 3, word: 'สาม', rom: 'sam' },
  { thai: '๔', arabic: 4, word: 'สี่', rom: 'si' },
  { thai: '๕', arabic: 5, word: 'ห้า', rom: 'ha' },
  { thai: '๖', arabic: 6, word: 'หก', rom: 'hok' },
  { thai: '๗', arabic: 7, word: 'เจ็ด', rom: 'jet' },
  { thai: '๘', arabic: 8, word: 'แปด', rom: 'paet' },
  { thai: '๙', arabic: 9, word: 'เก้า', rom: 'kao' },
  { thai: '๑๐', arabic: 10, word: 'สิบ', rom: 'sip', small: true },
];

export const BUILDING_RULES = [
  {
    title: 'Tens: สิบ (sip) × digit',
    body: 'สิบ = 10. Add a digit after it for 11–19. For multiples of ten, put the digit before สิบ. Exception: 20 uses ยี่ (yii) not สอง.',
    examples: [
      { thai: 'สิบเอ็ด', rom: 'sip et', en: '11' },
      { thai: 'ยี่สิบ', rom: 'yii sip', en: '20' },
      { thai: 'ยี่สิบห้า', rom: 'yii sip ha', en: '25' },
      { thai: 'สามสิบสอง', rom: 'sam sip song', en: '32' },
    ],
  },
  {
    title: 'Hundreds & thousands',
    body: 'ร้อย (roi) = 100 · พัน (phan) = 1,000 · หมื่น (muen) = 10,000 · แสน (saen) = 100,000 · ล้าน (lan) = 1,000,000. Note: Thai has individual words for 10,000 and 100,000 — they don\'t say "ten thousand".',
    examples: [
      { thai: 'สองร้อย', rom: 'song roi', en: '200' },
      { thai: 'หนึ่งพัน', rom: 'nueng phan', en: '1,000' },
      { thai: 'สามหมื่น', rom: 'sam muen', en: '30,000' },
      { thai: 'ห้าแสน', rom: 'ha saen', en: '500,000' },
      { thai: 'สองล้าน', rom: 'song lan', en: '2,000,000' },
    ],
  },
  {
    title: 'Ordinals: ที่ (thi) + number',
    body: 'To make an ordinal (first, second, third…), put ที่ before the number. Alternatively, อันดับ (an dap) is used for rankings.',
    examples: [
      { thai: 'ที่หนึ่ง', rom: 'thi nueng', en: 'first / 1st' },
      { thai: 'ที่สอง', rom: 'thi song', en: 'second / 2nd' },
      { thai: 'ชั้นสาม', rom: 'chan sam', en: '3rd floor' },
    ],
  },
];

export const CONTEXT_CARDS = [
  {
    title: 'Prices',
    body: 'บาท (baht) follows the number. สตางค์ (satang) = cents, rarely used.',
    ex: 'สามสิบสองบาท',
    rom: 'sam sip song baht — 32 baht',
  },
  {
    title: 'Time',
    body: 'Thai uses a 6-hour clock system informally. นาที = minutes, ชั่วโมง = hours.',
    ex: 'สองทุ่ม',
    rom: 'song thum — 8pm (2nd evening bell)',
  },
  {
    title: 'Dates & years',
    body: 'Thailand uses the Buddhist Era (พ.ศ.) — add 543 to the Western year. วันที่ = date.',
    ex: 'วันที่ห้า / พ.ศ. ๒๕๖๗',
    rom: 'the 5th / B.E. 2567 (= 2024)',
  },
  {
    title: 'Percentages & fractions',
    body: 'เปอร์เซ็นต์ = percent. ร้อยละ (roi la) = per hundred (formal). ครึ่ง = half.',
    ex: 'ร้อยละสิบเจ็ด',
    rom: '17 percent (formal written style)',
  },
  {
    title: 'Phone & lottery numbers',
    body: 'Digits read one by one. เบอร์ (boe) = number/telephone number. เลข (lek) = number/digit.',
    ex: 'เบอร์โทรศัพท์เลขมงคล',
    rom: 'an auspicious phone number',
  },
  {
    title: 'Floors & addresses',
    body: 'ชั้น (chan) = floor/level. Thai buildings sometimes skip floor 13 (Western superstition).',
    ex: 'ชั้นสิบสาม',
    rom: '13th floor (often absent in buildings)',
  },
];
