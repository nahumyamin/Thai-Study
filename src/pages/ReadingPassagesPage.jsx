import { useState, useRef, useCallback } from 'react';
import { PASSAGES } from '../data/passages.js';
import { allVocab } from '../data/vocab.js';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Build a lookup map: thai string -> word entry
const vocabMap = new Map();
allVocab.forEach(w => vocabMap.set(w.thai, w));

// Greedy longest-match tokenizer
function tokenize(text) {
  const tokens = [];
  let i = 0;
  while (i < text.length) {
    let matched = false;
    for (let len = 8; len >= 1; len--) {
      const chunk = text.slice(i, i + len);
      if (vocabMap.has(chunk)) {
        tokens.push({ text: chunk, def: vocabMap.get(chunk) });
        i += len;
        matched = true;
        break;
      }
    }
    if (!matched) {
      tokens.push({ text: text[i], def: null });
      i++;
    }
  }
  return tokens;
}

function PassageText({ text, onWordClick, activeWord }) {
  const paragraphs = text.split(/\n\n+/);
  return (
    <div>
      {paragraphs.map((para, pi) => {
        const tokens = tokenize(para);
        return (
          <p key={pi} className={pi < paragraphs.length - 1 ? 'mb-4' : ''}>
            {tokens.map((tok, ti) => {
              if (tok.def) {
                const isActive = activeWord === tok.text;
                return (
                  <span
                    key={ti}
                    className={`cursor-pointer rounded-sm transition-colors border-b border-dotted border-primary ${isActive ? 'bg-red-100' : 'hover:bg-red-100/60'}`}
                    onClick={(e) => onWordClick(tok, e)}
                  >
                    {tok.text}
                  </span>
                );
              }
              return <span key={ti}>{tok.text}</span>;
            })}
          </p>
        );
      })}
    </div>
  );
}

export default function ReadingPassagesPage() {
  const [passageIdx, setPassageIdx] = useState(0);
  const [popup, setPopup] = useState(null);
  const [activeWord, setActiveWord] = useState(null);
  const popupRef = useRef();

  const passage = PASSAGES[passageIdx];

  const handleWordClick = useCallback((tok, e) => {
    const rect = e.target.getBoundingClientRect();
    const x = Math.min(rect.left, window.innerWidth - 230);
    const y = rect.bottom + 8;
    setActiveWord(tok.text);
    setPopup({ word: tok.def, x, y });
  }, []);

  const closePopup = () => {
    setPopup(null);
    setActiveWord(null);
  };

  return (
    <div
      className="max-w-[1200px] mx-auto px-5 py-8"
      onClick={(e) => {
        if (popup && !e.target.closest('[data-word]')) closePopup();
      }}
    >
      <h1 className="text-3xl font-serif font-normal mb-1">
        Reading <em className="text-primary not-italic font-medium">Passages</em>
      </h1>
      <Separator className="mb-6" />

      {/* Passage picker */}
      <div className="flex gap-2 items-center mb-6 flex-wrap">
        <Select
          value={String(passageIdx)}
          onValueChange={(val) => { setPassageIdx(Number(val)); closePopup(); }}
        >
          <SelectTrigger className="flex-1 rounded-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-none">
            {PASSAGES.map((p, i) => (
              <SelectItem key={i} value={String(i)} className="rounded-none">
                {p.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Passage text */}
      <Card className="mb-6 rounded-none shadow-none">
        <CardContent className="p-6 text-base leading-[2.2] text-foreground">
          <PassageText
            text={passage.text}
            onWordClick={handleWordClick}
            activeWord={activeWord}
          />
        </CardContent>
      </Card>

      {/* Discussion questions */}
      <div className="border-t border-border pt-5">
        <div className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-3">
          Discussion questions
        </div>
        {passage.questions.map((q, i) => (
          <div key={i} className={`flex gap-3 py-2 text-sm text-muted-foreground leading-relaxed ${i < passage.questions.length - 1 ? 'border-b border-border' : ''}`}>
            <span className="font-serif italic text-primary shrink-0 text-base leading-relaxed">{i + 1}.</span>
            <span>{q}</span>
          </div>
        ))}
      </div>

      {/* Word popup */}
      {popup && (
        <div
          ref={popupRef}
          className="fixed z-50 bg-popover text-popover-foreground shadow-md rounded p-2 text-sm pointer-events-none max-w-[220px]"
          style={{ left: popup.x, top: popup.y }}
        >
          <strong className="block">{popup.word.thai}</strong>
          <em className="text-xs opacity-75">{popup.word.rom}</em>
          <br />
          {popup.word.en}
        </div>
      )}
    </div>
  );
}
