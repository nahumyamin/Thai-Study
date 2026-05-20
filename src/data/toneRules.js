// ─────────────────────────────────────────────────────────────────
// Thai Tone Rules
// ─────────────────────────────────────────────────────────────────

// ── Consonant classes ─────────────────────────────────────────────
export const MID_CLASS  = new Set([...'กจดตบปอฎฏ']);
export const HIGH_CLASS = new Set([...'ขฃฉฐถผฝศษสห']);
export const LOW_CLASS  = new Set([...'คฅฆงชซฌญณนทธพฟภมยรลวฬฮ']);

export const CLASS_LABEL = { mid: 'mid class', high: 'high class', low: 'low class' };
export const CLASS_EN    = { mid: 'Mid',       high: 'High',       low: 'Low'       };

// Low-class consonants that ห can lead (ห นำ → effective high class)
const H_LEADABLE = new Set([...'งนมยวญณรลฬ']);

// Thai consonants (all)
const THAI_CONSONANTS = new Set([
  ...'กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮ'
]);

// Leading vowels – come BEFORE the consonant in Unicode byte order
const LEADING_VOWELS = new Set([...'เแโใไ']);

// Vowel diacritics written above or below the consonant
const ABOVE_DIACRITICS = new Set([...'ัิีึื็ํ']);
const BELOW_DIACRITICS = new Set([...'ุู']);

// Tone mark characters
const TONE_MARK_CHARS = new Set([...'่้๊๋']);
const TONE_MARK_KEY   = { '่': 'mai_ek', '้': 'mai_tho', '๊': 'mai_tri', '๋': 'mai_chat' };
export const TONE_MARK_NAME = {
  mai_ek:   'ไม้เอก (่)',
  mai_tho:  'ไม้โท (้)',
  mai_tri:  'ไม้ตรี (๊)',
  mai_chat: 'ไม้จัตวา (๋)',
  none:     'none',
};

// Short above-vowels (ิ ึ ุ) — long are (ี ื ู)
const SHORT_ABOVE = new Set([...'ิึุ']);
const LONG_ABOVE  = new Set([...'ีืู']);

// Finals that produce a dead syllable (unreleased stops /k/ /p/ /t/)
// /k/: ก ข ค ฆ
// /p/: บ ป พ ฟ ภ
// /t/: ด ต จ ช ซ ฌ ฎ ฏ ฐ ฑ ฒ ถ ท ธ ศ ษ ส ห อ ฃ ฉ
const STOP_FINALS = new Set([...'กขคฆบปพฟภดตจชซฌฎฏฐฑฒถทธศษสหอฃฉ']);

// ── Tone lookup table ─────────────────────────────────────────────
// key: `${effectiveClass}_${syllType}_${markKey}`
// syllType: live | dead_short | dead_long
const T = {
  // ── Mid class ────────────────────────────────
  mid_live_none:           'mid',
  mid_live_mai_ek:         'low',
  mid_live_mai_tho:        'falling',
  mid_live_mai_tri:        'high',
  mid_live_mai_chat:       'rising',
  mid_dead_short_none:     'low',
  mid_dead_long_none:      'low',
  mid_dead_short_mai_ek:   'low',
  mid_dead_long_mai_ek:    'low',
  mid_dead_short_mai_tho:  'falling',
  mid_dead_long_mai_tho:   'falling',

  // ── High class ───────────────────────────────
  high_live_none:          'rising',
  high_live_mai_ek:        'low',
  high_live_mai_tho:       'falling',
  high_live_mai_tri:       'high',
  high_live_mai_chat:      'rising',
  high_dead_short_none:    'low',
  high_dead_long_none:     'low',
  high_dead_short_mai_ek:  'low',
  high_dead_long_mai_ek:   'low',
  high_dead_short_mai_tho: 'falling',
  high_dead_long_mai_tho:  'falling',

  // ── Low class ────────────────────────────────
  low_live_none:           'mid',
  low_live_mai_ek:         'falling',
  low_live_mai_tho:        'high',
  low_live_mai_tri:        'high',
  low_live_mai_chat:       'rising',
  low_dead_short_none:     'high',
  low_dead_long_none:      'falling',
  low_dead_short_mai_ek:   'falling',
  low_dead_long_mai_ek:    'falling',
  low_dead_short_mai_tho:  'high',
  low_dead_long_mai_tho:   'high',
};

// ── Tone display metadata ─────────────────────────────────────────
// contour: SVG path on viewBox "0 0 48 28"; y=6 = high, y=22 = low
export const TONE_INFO = {
  mid:     { name: 'สามัญ', nameEn: 'Mid',     color: '#3b82f6', contour: 'M6,14 L42,14' },
  low:     { name: 'เอก',   nameEn: 'Low',     color: '#a855f7', contour: 'M6,13 C16,14 30,20 42,22' },
  falling: { name: 'โท',    nameEn: 'Falling', color: '#ef4444', contour: 'M6,7  C14,9  30,18 42,22' },
  high:    { name: 'ตรี',   nameEn: 'High',    color: '#f59e0b', contour: 'M6,16 C16,13 30,9  42,6'  },
  rising:  { name: 'จัตวา', nameEn: 'Rising',  color: '#22c55e', contour: 'M6,19 C12,23 26,14 42,7'  },
};

// ── Syllable parser ───────────────────────────────────────────────
export function parseSyllables(text) {
  const chars = [...text.trim()];
  const syllables = [];
  let i = 0;

  while (i < chars.length) {
    // Skip non-Thai characters
    if (!THAI_CONSONANTS.has(chars[i]) && !LEADING_VOWELS.has(chars[i])) {
      i++;
      continue;
    }

    const syl = {
      raw: '',
      leadingVowel:  null,
      initial:       null,   // written initial consonant
      cluster:       null,   // second consonant (cluster / ห นำ target)
      aboveVowels:   [],
      belowVowels:   [],
      toneMark:      null,
      followingVowel: null,  // า  ะ  ำ  ็ (as trailing)
      final:         null,
    };

    // 1. Leading vowel?
    if (LEADING_VOWELS.has(chars[i])) {
      syl.leadingVowel = chars[i];
      syl.raw += chars[i];
      i++;
    }

    // 2. Initial consonant (required)
    if (i >= chars.length || !THAI_CONSONANTS.has(chars[i])) {
      if (syl.raw) syllables.push(syl);
      break;
    }
    syl.initial = chars[i];
    syl.raw += chars[i];
    i++;

    // 3. Possible cluster / ห นำ
    if (i < chars.length && THAI_CONSONANTS.has(chars[i])) {
      const c2 = chars[i];
      const c3 = chars[i + 1];
      const nextIsVowelOrMark = c3 && (
        ABOVE_DIACRITICS.has(c3) || BELOW_DIACRITICS.has(c3) ||
        TONE_MARK_CHARS.has(c3)  || c3 === 'า' || c3 === 'ะ' || c3 === 'ำ'
      );
      const isHLeading = syl.initial === 'ห' && H_LEADABLE.has(c2);
      if (nextIsVowelOrMark || isHLeading) {
        syl.cluster = c2;
        syl.raw += c2;
        i++;
      }
    }

    // 4. Above/below vowels and tone mark (any order)
    while (i < chars.length && (
      ABOVE_DIACRITICS.has(chars[i]) || BELOW_DIACRITICS.has(chars[i]) ||
      TONE_MARK_CHARS.has(chars[i])
    )) {
      const c = chars[i];
      if (TONE_MARK_CHARS.has(c))       syl.toneMark = c;
      else if (ABOVE_DIACRITICS.has(c)) syl.aboveVowels.push(c);
      else                               syl.belowVowels.push(c);
      syl.raw += c;
      i++;
    }

    // 5. Following vowel: า  ะ  ำ
    if (i < chars.length && (chars[i] === 'า' || chars[i] === 'ะ' || chars[i] === 'ำ')) {
      syl.followingVowel = chars[i];
      syl.raw += chars[i];
      i++;
    }

    // 6. Final consonant — take it if NOT followed by a vowel/mark
    //    (which would mean it starts a new syllable instead)
    if (i < chars.length && THAI_CONSONANTS.has(chars[i])) {
      const cFinal   = chars[i];
      const afterFin = chars[i + 1];
      const nextIsVowel = afterFin && (
        ABOVE_DIACRITICS.has(afterFin) || BELOW_DIACRITICS.has(afterFin) ||
        TONE_MARK_CHARS.has(afterFin)  || afterFin === 'า' || afterFin === 'ะ' || afterFin === 'ำ'
      );
      if (!nextIsVowel) {
        syl.final = cFinal;
        syl.raw += cFinal;
        i++;
      }
    }

    if (syl.initial) syllables.push(syl);
  }

  return syllables;
}

// ── Syllable analyser ─────────────────────────────────────────────
export function analyzeSyllable(syl) {
  const { initial, cluster, toneMark, aboveVowels, belowVowels, followingVowel, final } = syl;

  // ห นำ: ห + leadable low-class consonant → effective high-class behaviour
  const isHLeading = initial === 'ห' && cluster && H_LEADABLE.has(cluster);
  const effectiveInitial = isHLeading ? cluster : initial;

  const writtenClass   = getConsonantClass(initial);
  const effectiveClass = isHLeading ? 'high' : (getConsonantClass(effectiveInitial) || 'mid');

  // Tone mark
  const toneMarkKey = toneMark ? TONE_MARK_KEY[toneMark] : 'none';

  // Vowel length
  const allVowels   = [...aboveVowels, ...belowVowels];
  const hasShortAb  = allVowels.some(v => SHORT_ABOVE.has(v));
  const hasLongAb   = allVowels.some(v => LONG_ABOVE.has(v));
  const isShortVowel = (
    followingVowel === 'ะ'      ||
    allVowels.includes('็')     ||
    (hasShortAb && !hasLongAb)
  );
  // ำ ends in ม → live syllable (long vowel for tone purposes)
  const endsInSaraAm = followingVowel === 'ำ';

  // Syllable type
  const isDeadFinal   = final ? STOP_FINALS.has(final) : false;
  const isDeadNoFinal = !final && (followingVowel === 'ะ');
  const isDeadSyllable = isDeadFinal || isDeadNoFinal;
  const syllType = !isDeadSyllable
    ? 'live'
    : isShortVowel ? 'dead_short' : 'dead_long';

  // Tone lookup
  const key      = `${effectiveClass}_${syllType}_${toneMarkKey}`;
  const fallback = `${effectiveClass}_live_${toneMarkKey}`;
  const toneKey  = T[key] || T[fallback] || 'mid';

  // ── Explanation steps ─────────────────────────────────────────
  const steps = [];

  if (isHLeading) {
    steps.push({
      label: 'ห นำ',
      detail: `ห leads ${cluster} — ${cluster} (low class) is raised to high-class behaviour`,
    });
  } else {
    const cls = effectiveClass ? CLASS_LABEL[effectiveClass] : 'unknown class';
    steps.push({ label: 'Initial consonant', detail: `${effectiveInitial} → ${cls}` });
  }

  const sylDesc = isDeadSyllable
    ? `dead syllable (${isShortVowel ? 'short' : 'long'} vowel${final ? ', ends in ' + final : ''})`
    : `live syllable${final ? ' (ends in ' + final + ')' : endsInSaraAm ? ' (ends in implied ม via ำ)' : ''}`;
  steps.push({ label: 'Syllable type', detail: sylDesc });

  steps.push({
    label: 'Tone mark',
    detail: toneMarkKey === 'none' ? 'none' : TONE_MARK_NAME[toneMarkKey],
  });

  steps.push({ label: 'Rule', detail: buildRule(effectiveClass, syllType, toneMarkKey, toneKey) });

  return {
    writtenClass,
    effectiveClass,
    isHLeading,
    isDeadSyllable,
    isShortVowel,
    syllType,
    toneMarkKey,
    toneKey,
    tone: TONE_INFO[toneKey],
    steps,
  };
}

export function getConsonantClass(c) {
  if (!c) return null;
  if (MID_CLASS.has(c))  return 'mid';
  if (HIGH_CLASS.has(c)) return 'high';
  if (LOW_CLASS.has(c))  return 'low';
  return null;
}

function buildRule(cls, syllType, mark, tone) {
  const toneLabel = {
    mid: 'mid / สามัญ', low: 'low / เอก',
    falling: 'falling / โท', high: 'high / ตรี', rising: 'rising / จัตวา',
  };
  const markLabel = {
    none: 'no mark', mai_ek: 'ไม้เอก',
    mai_tho: 'ไม้โท', mai_tri: 'ไม้ตรี', mai_chat: 'ไม้จัตวา',
  };
  const parts = [CLASS_LABEL[cls]];
  if (mark !== 'none') {
    parts.push(markLabel[mark]);
  } else {
    const st = syllType === 'live' ? 'live syllable'
      : syllType === 'dead_short' ? 'dead syllable (short)'
      : 'dead syllable (long)';
    parts.push(st);
    parts.push('no mark');
  }
  return parts.join(' + ') + ' → ' + toneLabel[tone];
}
