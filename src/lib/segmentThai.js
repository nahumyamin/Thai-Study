// Thai word segmentation shared by the reading view and data scripts.
//
// Combines two sources:
//   1. Intl.Segmenter('th') word boundaries — full coverage of the text.
//   2. Longest match against the study-vocab list — so multi-word vocab
//      entries (e.g. ที่อยู่อาศัย) stay one clickable token. A vocab match
//      is only accepted when it ends on a segmenter boundary, so it never
//      splits an unrelated longer word (e.g. ลา inside ลาดพร้าว).
//
// Returns tokens of the whole string: { text, start, end, isWordLike }.
// `isWordLike` is false for spaces, digits and punctuation.

export const MAX_VOCAB_LEN = 16;

const segmenter = typeof Intl !== 'undefined' && Intl.Segmenter
  ? new Intl.Segmenter('th', { granularity: 'word' })
  : null;

export function segmentParagraph(text, vocabSet) {
  if (!segmenter) return fallbackSegment(text, vocabSet);

  const segs = [...segmenter.segment(text)];
  const boundaryEnds = new Set(segs.map(s => s.index + s.segment.length));
  const segAt = new Array(text.length);
  for (const s of segs) {
    for (let i = 0; i < s.segment.length; i++) segAt[s.index + i] = s;
  }

  const tokens = [];
  let i = 0;
  while (i < text.length) {
    let matched = null;
    for (let len = MAX_VOCAB_LEN; len >= 1; len--) {
      if (!boundaryEnds.has(i + len)) continue;
      const chunk = text.slice(i, i + len);
      if (vocabSet.has(chunk)) { matched = chunk; break; }
    }
    if (matched) {
      tokens.push({ text: matched, start: i, end: i + matched.length, isWordLike: true });
      i += matched.length;
      continue;
    }
    const s = segAt[i];
    const end = Math.max(s.index + s.segment.length, i + 1);
    tokens.push({
      text: text.slice(i, end),
      start: i,
      end,
      isWordLike: !!s.isWordLike,
    });
    i = end;
  }
  return tokens;
}

// Pre-Intl.Segmenter browsers: the old behavior — vocab longest match,
// single characters otherwise.
function fallbackSegment(text, vocabSet) {
  const tokens = [];
  let i = 0;
  while (i < text.length) {
    let matched = null;
    for (let len = MAX_VOCAB_LEN; len >= 1; len--) {
      const chunk = text.slice(i, i + len);
      if (vocabSet.has(chunk)) { matched = chunk; break; }
    }
    const t = matched ?? text[i];
    tokens.push({ text: t, start: i, end: i + t.length, isWordLike: /\S/.test(t) });
    i += t.length;
  }
  return tokens;
}
