// Extract every unique word token from all passages, using the same
// segmentation the reading view uses (src/lib/segmentThai.js). Prints
// words missing from the POS lexicon so they can be tagged in
// src/data/posLexicon.js.
import { PASSAGES } from '../src/data/passages.js';
import { allVocab } from '../src/data/vocab.js';
import { segmentParagraph } from '../src/lib/segmentThai.js';

let POS_LEXICON = {};
try {
  ({ POS_LEXICON } = await import('../src/data/posLexicon.js'));
} catch { /* lexicon not created yet */ }

const vocabSet = new Set(allVocab.map(w => w.thai));
const counts = new Map();

for (const p of PASSAGES) {
  for (const para of p.text.split(/\n\n+/)) {
    for (const tok of segmentParagraph(para, vocabSet)) {
      if (!tok.isWordLike) continue;
      if (/^[\d๐-๙,.\-–—%x×/:()!?"']+$/.test(tok.text)) continue;
      counts.set(tok.text, (counts.get(tok.text) || 0) + 1);
    }
  }
}

const words = [...counts.entries()].sort((a, b) => b[1] - a[1]);
const missing = words.filter(([w]) => !(w in POS_LEXICON));
console.log('unique word tokens:', words.length);
console.log('missing from lexicon:', missing.length);
for (const [w, c] of missing) console.log(`${w}\t${c}`);
