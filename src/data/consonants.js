export const CONSONANTS = [
  // low class (24)
  { l: 'ค', name: 'khwai',     sound: 'kh',    cls: 'low'  },
  { l: 'ฅ', name: 'khon',      sound: 'kh',    cls: 'low'  },
  { l: 'ง', name: 'nguu',      sound: 'ng',    cls: 'low'  },
  { l: 'ช', name: 'chaang',    sound: 'ch',    cls: 'low'  },
  { l: 'ซ', name: 'soo',       sound: 's',     cls: 'low'  },
  { l: 'ญ', name: 'ying',      sound: 'y',     cls: 'low'  },
  { l: 'ณ', name: 'nen',       sound: 'n',     cls: 'low'  },
  { l: 'น', name: 'nuu',       sound: 'n',     cls: 'low'  },
  { l: 'พ', name: 'phaan',     sound: 'ph',    cls: 'low'  },
  { l: 'ฟ', name: 'fan',       sound: 'f',     cls: 'low'  },
  { l: 'ภ', name: 'sampao',    sound: 'ph',    cls: 'low'  },
  { l: 'ม', name: 'maa',       sound: 'm',     cls: 'low'  },
  { l: 'ย', name: 'yak',       sound: 'y',     cls: 'low'  },
  { l: 'ร', name: 'ruea',      sound: 'r',     cls: 'low'  },
  { l: 'ล', name: 'ling',      sound: 'l',     cls: 'low'  },
  { l: 'ว', name: 'waen',      sound: 'w',     cls: 'low'  },
  { l: 'ฬ', name: 'ju-laa',    sound: 'l',     cls: 'low'  },
  { l: 'ฮ', name: 'nok-huk',   sound: 'h',     cls: 'low'  },
  { l: 'ฆ', name: 'ra-khang',  sound: 'kh',    cls: 'low'  },
  { l: 'ท', name: 'thahaan',   sound: 'th',    cls: 'low'  },
  { l: 'ธ', name: 'thong',     sound: 'th',    cls: 'low'  },
  { l: 'ฑ', name: 'montho',    sound: 'th',    cls: 'low'  },
  { l: 'ฒ', name: 'phuu-thao', sound: 'th',    cls: 'low'  },
  { l: 'ฌ', name: 'choe',      sound: 'ch',    cls: 'low'  },
  // mid class (9)
  { l: 'ก', name: 'gai',       sound: 'g/k',   cls: 'mid'  },
  { l: 'จ', name: 'jaan',      sound: 'j',     cls: 'mid'  },
  { l: 'ด', name: 'dek',       sound: 'd',     cls: 'mid'  },
  { l: 'ต', name: 'tao',       sound: 't',     cls: 'mid'  },
  { l: 'บ', name: 'baimai',    sound: 'b',     cls: 'mid'  },
  { l: 'ป', name: 'plaa',      sound: 'p',     cls: 'mid'  },
  { l: 'อ', name: 'ang',       sound: 'silent', cls: 'mid' },
  { l: 'ฎ', name: 'chada',     sound: 'd',     cls: 'mid'  },
  { l: 'ฏ', name: 'pataak',    sound: 't',     cls: 'mid'  },
  // high class (11)
  { l: 'ข', name: 'khai',      sound: 'kh',    cls: 'high' },
  { l: 'ฃ', name: 'khuat',     sound: 'kh',    cls: 'high' },
  { l: 'ฉ', name: 'ching',     sound: 'ch',    cls: 'high' },
  { l: 'ถ', name: 'thung',     sound: 'th',    cls: 'high' },
  { l: 'ผ', name: 'phung',     sound: 'ph',    cls: 'high' },
  { l: 'ฝ', name: 'faa',       sound: 'f',     cls: 'high' },
  { l: 'ษ', name: 'rue-si',    sound: 's',     cls: 'high' },
  { l: 'ส', name: 'suea',      sound: 's',     cls: 'high' },
  { l: 'ห', name: 'heep',      sound: 'h',     cls: 'high' },
  { l: 'ศ', name: 'sala',      sound: 's',     cls: 'high' },
  { l: 'ฐ', name: 'thaan2',    sound: 'th',    cls: 'high' },
];

export const DIFF = {
  easy:   { time: 4000, label: 'Easy' },
  normal: { time: 2500, label: 'Normal' },
  hard:   { time: 1500, label: 'Hard' },
};

// ── Final consonant (ตัวสะกด) sounds & syllable type ──────────────────
// When a consonant closes a syllable it collapses to one of eight final
// sounds. Stop finals (k, t, p) cut the syllable short → a DEAD syllable;
// sonorant finals (ng, n, m, y, w) let it ring on → a LIVE syllable.
// The six consonants ฉ ผ ฝ ห อ ฮ are never used as a final (no entry below).
export const FINAL_SOUND = {
  // → /k/ (dead)
  'ก': 'k', 'ข': 'k', 'ฃ': 'k', 'ค': 'k', 'ฅ': 'k', 'ฆ': 'k',
  // → /t/ (dead)
  'จ': 't', 'ช': 't', 'ซ': 't', 'ฌ': 't', 'ฎ': 't', 'ฏ': 't', 'ฐ': 't', 'ฑ': 't', 'ฒ': 't',
  'ด': 't', 'ต': 't', 'ถ': 't', 'ท': 't', 'ธ': 't', 'ศ': 't', 'ษ': 't', 'ส': 't',
  // → /p/ (dead)
  'บ': 'p', 'ป': 'p', 'พ': 'p', 'ฟ': 'p', 'ภ': 'p',
  // → sonorant (live)
  'ง': 'ng',
  'ญ': 'n', 'ณ': 'n', 'น': 'n', 'ร': 'n', 'ล': 'n', 'ฬ': 'n',
  'ม': 'm', 'ย': 'y', 'ว': 'w',
};

const DEAD_FINALS = new Set(['k', 'p', 't']);

// Returns { final, syllable } for a consonant used as a final, or null for the
// six consonants (ฉ ผ ฝ ห อ ฮ) that never act as a final.
export function finalInfo(letter) {
  const final = FINAL_SOUND[letter];
  if (!final) return null;
  return { final, syllable: DEAD_FINALS.has(final) ? 'dead' : 'live' };
}
