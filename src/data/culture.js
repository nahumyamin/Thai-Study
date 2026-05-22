export const ANTHEMS = [
  {
    id: 'national',
    title: 'National Anthem',
    thaiTitle: 'เพลงชาติไทย',
    romanTitle: 'Phleng Chat Thai',
    subtitle: 'The Song of Thailand',
    youtubeId: 'HTHpkQJ3pVI',
    intro: `Thailand's national anthem was adopted in 1939, with music composed by Peter Feit (Phra Chenduriyang), a German-born Thai composer, and lyrics by Luang Saranupraphan. It replaced an earlier royal-focused anthem, deliberately centering the nation and its people rather than the monarchy. The anthem is broadcast every day at 8 am and 6 pm — at public spaces across the country, people stop and stand in respectful silence.`,
    facts: [
      { label: 'Music',   value: 'Peter Feit (Phra Chenduriyang), 1932' },
      { label: 'Lyrics',  value: 'Luang Saranupraphan, 1939' },
      { label: 'Adopted', value: '10 December 1939' },
      { label: 'Played',  value: 'Daily at 8:00 am and 6:00 pm nationwide' },
    ],
    lines: [
      {
        thai: 'ประเทศไทยรวมเลือดเนื้อชาติเชื้อไทย',
        rom:  'Prathet thai ruam lueat nuea chat chuea thai',
        en:   'Thailand unites the blood and flesh of the Thai nation,',
      },
      {
        thai: 'เป็นประชารัฐ ไผทของไทยทุกส่วน',
        rom:  'Pen prachaRat phai thong thai thuk suan',
        en:   'A state of the people; every inch of Thailand belongs to the Thais.',
      },
      {
        thai: 'อยู่ดำรงคงไว้ได้ทั้งมวล',
        rom:  'Yu damrong khong wai dai thang muan',
        en:   'It has long maintained its sovereignty,',
      },
      {
        thai: 'ด้วยไทยล้วนหมาย รักสามัคคี',
        rom:  'Duai thai luan mai rak samakkhi',
        en:   'Because the Thais have always been united in love and harmony.',
      },
      {
        thai: 'ไทยนี้รักสงบ แต่ถึงรบไม่ขลาด',
        rom:  'Thai ni rak sangop tae thueng rop mai khlat',
        en:   'The Thai people are peace-loving, but in battle they are not cowards;',
      },
      {
        thai: 'เอกราชจะไม่ให้ใครข่มขี่',
        rom:  'Ekkarat cha mai hai khrai khom khi',
        en:   'They will never let anyone threaten their independence.',
      },
      {
        thai: 'สละเลือดทุกหยาดเป็นชาติพลี',
        rom:  'Sala lueat thuk yat pen chat phli',
        en:   'They will sacrifice every drop of their blood for the nation,',
      },
      {
        thai: 'เถลิงประเทศชาติไทยทวี มีชัย ชโย',
        rom:  'Thaleng prathet chat thai thawi mi chai — chaiyo',
        en:   'Raising Thailand to lasting glory, to victory — Chaiyo!',
      },
    ],
    note: 'ชโย (chaiyo) is a traditional Thai exclamation of victory or celebration, equivalent to "hurrah" or "long live."',
  },
  {
    id: 'royal',
    title: 'Royal Anthem',
    thaiTitle: 'เพลงสรรเสริญพระบารมี',
    romanTitle: 'Sansoen Phra Barami',
    subtitle: 'Glorifying His Majesty\'s Virtue',
    youtubeId: 'v_PsivwtY0I',
    intro: `The Royal Anthem honours the reigning monarch and is distinct from the National Anthem. It is played before every film screening in Thai cinemas — audiences rise and stand in silence — and at royal ceremonies, official broadcasts, and national holidays. The melody was composed by Peter Feit; the current lyrics were written by Prince Narisara Nuvadtivongs and have remained largely unchanged since the reign of Rama V.`,
    facts: [
      { label: 'Music',   value: 'Peter Feit (Phra Chenduriyang)' },
      { label: 'Lyrics',  value: 'Prince Narisara Nuvadtivongs' },
      { label: 'Era',     value: 'Reign of Rama V (late 19th century)' },
      { label: 'Played',  value: 'Before cinema screenings, royal ceremonies, official broadcasts' },
    ],
    lines: [
      {
        thai: 'ข้าวรพุทธเจ้า เอามโนและศิระกราน',
        rom:  'Kha wraphutthacho ao mano lae sira kran',
        en:   'We, your humble servants, bow our minds and heads,',
      },
      {
        thai: 'นบพระภูมิบาล บุญดิเรก',
        rom:  'Nop phra phumi ban bun direk',
        en:   'Paying homage to the protector of the land, abundantly blessed,',
      },
      {
        thai: 'เอกบรมจักริน พระสยามินทร์',
        rom:  'Ek borom chakkrin phra saya min',
        en:   'The supreme sovereign of the Chakri dynasty, lord of Siam,',
      },
      {
        thai: 'พระยศยิ่งยง เย็นศิระเพราะพระบริบาล',
        rom:  'Phra yot ying yong yen sira phro phra bori ban',
        en:   'Your glory stands supreme; we are at peace under your protection.',
      },
      {
        thai: 'ผลพระคุณ ธ รักษา ปวงประชา เป็นสุขศานต์',
        rom:  'Phon phra khun tho raksa puang pracha pen suk san',
        en:   'The fruit of your virtue shelters all the people in happiness and peace.',
      },
      {
        thai: 'ขอบันดาล ธ ประสงค์ใด',
        rom:  'Kho ban dan tho prasong dai',
        en:   'May whatever you wish for',
      },
      {
        thai: 'จงสฤษฎ์ดัง หวังวใจ',
        rom:  'Chong sarit dang wang wai chai',
        en:   'Be brought to fruition, as you have hoped,',
      },
      {
        thai: 'ดุจถวายชัย ชโย',
        rom:  'Dut thawai chai — chaiyo',
        en:   'As we offer our victory — Chaiyo!',
      },
    ],
    note: 'ธ (tho) is a formal pronoun used exclusively for royalty, equivalent to "His/Her Majesty" or simply "you" in a royal context.',
  },
];

export const IDIOMS_INTRO = `Thai idioms (สำนวนไทย, samnuan thai) are vivid, often nature-based expressions that have been passed down through generations. Many draw on rice farming, animals, and Buddhist thought. Understanding them gives real insight into how Thai people think and communicate.`;

export const IDIOMS = [
  {
    thai: 'น้ำขึ้นให้รีบตัก',
    rom: 'Nam khuen hai rip tak',
    literal: 'When the water rises, quickly scoop it up',
    meaning: 'Make the most of an opportunity while it lasts. Don\'t hesitate when the timing is right.',
    equivalent: 'Make hay while the sun shines',
  },
  {
    thai: 'ช้าๆ ได้พร้าเล่มงาม',
    rom: 'Cha cha dai phra lem ngam',
    literal: 'Go slowly and you\'ll get a fine machete',
    meaning: 'Patience and care produce better results than rushing. Quality takes time.',
    equivalent: 'Slow and steady wins the race',
  },
  {
    thai: 'หนีเสือปะจระเข้',
    rom: 'Ni suea pa chorakhe',
    literal: 'Flee from a tiger, run into a crocodile',
    meaning: 'Escaping one danger only to face another equally bad or worse.',
    equivalent: 'Out of the frying pan, into the fire',
  },
  {
    thai: 'ปากหวานก้นเปรี้ยว',
    rom: 'Pak wan kon priao',
    literal: 'Sweet mouth, sour behind',
    meaning: 'Someone who says nice things to your face but is unpleasant or dishonest behind your back.',
    equivalent: 'Two-faced; honey-tongued',
  },
  {
    thai: 'กบในกะลา',
    rom: 'Kop nai kala',
    literal: 'A frog under a coconut shell',
    meaning: 'A person who is narrow-minded and ignorant of the wider world, convinced their small view is all there is.',
    equivalent: 'A frog in a well',
  },
  {
    thai: 'ยิงปืนนัดเดียวได้นกสองตัว',
    rom: 'Ying puen nat diao dai nok song tua',
    literal: 'Fire one shot, get two birds',
    meaning: 'Accomplish two things with a single action or effort.',
    equivalent: 'Kill two birds with one stone',
  },
  {
    thai: 'รักวัวให้ผูก รักลูกให้ตี',
    rom: 'Rak wua hai phuk, rak luk hai ti',
    literal: 'Love your cow — tie it up; love your child — discipline them',
    meaning: 'True love means setting boundaries and correcting those you care about, not just indulging them.',
    equivalent: 'Spare the rod, spoil the child',
  },
  {
    thai: 'เข้าเมืองตาหลิ่ว ต้องหลิ่วตาตาม',
    rom: 'Khao mueang ta lio, tong lio ta tam',
    literal: 'Enter the city of squinting eyes — you must squint too',
    meaning: 'Adapt to local customs and norms wherever you go.',
    equivalent: 'When in Rome, do as the Romans do',
  },
  {
    thai: 'ปิดทองหลังพระ',
    rom: 'Pit thong lang phra',
    literal: 'Gilding the back of a Buddha image',
    meaning: 'Doing good deeds quietly, without recognition or praise. True virtue needs no audience.',
    equivalent: 'Doing good in secret',
  },
  {
    thai: 'ขิงก็ราข่าก็แรง',
    rom: 'Khing ko ra, kha ko raeng',
    literal: 'Ginger is fierce, galangal is fierce too',
    meaning: 'Two people or sides that are equally stubborn, competitive, or well-matched — neither will back down.',
    equivalent: 'An irresistible force meets an immovable object',
  },
  {
    thai: 'ไก่งามเพราะขน คนงามเพราะแต่ง',
    rom: 'Kai ngam phro khon, khon ngam phro taeng',
    literal: 'A chicken is beautiful because of its feathers; a person is beautiful because of their dress',
    meaning: 'Appearance and presentation matter — how you dress and present yourself shapes how others see you.',
    equivalent: 'Clothes make the man',
  },
  {
    thai: 'น้ำตาลใกล้มด',
    rom: 'Nam tan klai mot',
    literal: 'Sugar near ants',
    meaning: 'When temptation or trouble is close at hand, problems are inevitable. Danger follows attraction.',
    equivalent: 'Playing with fire',
  },
];

