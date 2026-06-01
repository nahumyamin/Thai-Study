// Font Recognition game — curated word list
// Short, common Thai words that look interestingly different across fonts

export const FONT_GAME_INTRO = `Thai is commonly taught using clean sans-serif fonts like Sarabun — but real-world Thai uses dozens of typefaces that can look dramatically different. A word you recognise instantly in one font may be unreadable in another. This game trains your eye to identify Thai words across five distinct typographic styles.`;

export const FONT_GAME_WORDS = [
  // Body
  { thai: 'ตา', rom: 'ta', en: 'eye' },
  { thai: 'หู', rom: 'hu', en: 'ear' },
  { thai: 'มือ', rom: 'mue', en: 'hand' },
  { thai: 'เท้า', rom: 'thao', en: 'foot' },
  { thai: 'หน้า', rom: 'na', en: 'face' },
  { thai: 'ปาก', rom: 'pak', en: 'mouth' },
  { thai: 'ฟัน', rom: 'fan', en: 'teeth' },
  { thai: 'ผม', rom: 'phom', en: 'hair' },

  // Nature
  { thai: 'น้ำ', rom: 'nam', en: 'water' },
  { thai: 'ไฟ', rom: 'fai', en: 'fire' },
  { thai: 'ฝน', rom: 'fon', en: 'rain' },
  { thai: 'ลม', rom: 'lom', en: 'wind' },
  { thai: 'ฟ้า', rom: 'fa', en: 'sky' },
  { thai: 'ดิน', rom: 'din', en: 'soil' },
  { thai: 'ดาว', rom: 'dao', en: 'star' },
  { thai: 'ดวงจันทร์', rom: 'duang chan', en: 'moon' },

  // Animals
  { thai: 'หมา', rom: 'ma', en: 'dog' },
  { thai: 'แมว', rom: 'maeo', en: 'cat' },
  { thai: 'ปลา', rom: 'pla', en: 'fish' },
  { thai: 'ไก่', rom: 'kai', en: 'chicken' },
  { thai: 'หมู', rom: 'mu', en: 'pig' },
  { thai: 'วัว', rom: 'wua', en: 'cow' },
  { thai: 'ช้าง', rom: 'chang', en: 'elephant' },
  { thai: 'งู', rom: 'ngu', en: 'snake' },

  // Food & drink
  { thai: 'ข้าว', rom: 'khao', en: 'rice' },
  { thai: 'กาแฟ', rom: 'kafae', en: 'coffee' },
  { thai: 'เบียร์', rom: 'bia', en: 'beer' },
  { thai: 'ส้ม', rom: 'som', en: 'orange' },
  { thai: 'เกลือ', rom: 'klue', en: 'salt' },
  { thai: 'น้ำตาล', rom: 'nam tan', en: 'sugar' },

  // Colors
  { thai: 'แดง', rom: 'daeng', en: 'red' },
  { thai: 'ขาว', rom: 'khao', en: 'white' },
  { thai: 'ดำ', rom: 'dam', en: 'black' },
  { thai: 'เหลือง', rom: 'lueang', en: 'yellow' },
  { thai: 'เขียว', rom: 'khiao', en: 'green' },
  { thai: 'ฟ้า', rom: 'fa', en: 'light blue' },

  // Place & things
  { thai: 'บ้าน', rom: 'ban', en: 'house' },
  { thai: 'วัด', rom: 'wat', en: 'temple' },
  { thai: 'ถนน', rom: 'tha-non', en: 'road' },
  { thai: 'รถ', rom: 'rot', en: 'car' },
  { thai: 'ร้าน', rom: 'ran', en: 'shop' },
  { thai: 'ใจ', rom: 'jai', en: 'heart' },
  { thai: 'ดอกไม้', rom: 'dok mai', en: 'flower' },
  { thai: 'หนังสือ', rom: 'nang sue', en: 'book' },
];

// Fonts loaded via Google Fonts — from most familiar to most decorative
export const FONT_GAME_FONTS = [
  { family: 'Sriracha',    label: 'Sriracha',    style: 'Handwritten' },
  { family: 'Charmonman',  label: 'Charmonman',  style: 'Decorative script' },
  { family: 'Srisakdi',    label: 'Srisakdi',    style: 'Bold display' },
  { family: 'Mali',        label: 'Mali',        style: 'Casual handwritten' },
  { family: 'Chonburi',    label: 'Chonburi',    style: 'Thick display' },
];

export const ROUND_SIZE = 10;
