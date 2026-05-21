import { useState, useRef, useCallback } from 'react';
import { PASSAGES, PASSAGE_DIFFICULTY } from '../data/passages.js';
import { allVocab } from '../data/vocab.js';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
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
                    className={`cursor-pointer rounded-sm transition-colors border-b border-dotted border-primary ${isActive ? 'bg-primary/10' : 'hover:bg-primary/8'}`}
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

// ── Difficulty badge ──────────────────────────────────────────────
const DIFF_STYLES = {
  beginner:     'text-green-700 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950/40 dark:border-green-800',
  intermediate: 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/40 dark:border-amber-800',
  advanced:     'text-red-700 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950/40 dark:border-red-800',
};

function DifficultyBadge({ level }) {
  return (
    <span className={cn(
      'text-[0.62rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded border',
      DIFF_STYLES[level] || DIFF_STYLES.intermediate
    )}>
      {level}
    </span>
  );
}

// ── Speaker icons ─────────────────────────────────────────────────
function SpeakerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
      <path d="M2 5H4.5L8 2V12L4.5 9H2V5Z" fill="currentColor" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M10 4.5C10.8 5.3 11.3 6.1 11.3 7C11.3 7.9 10.8 8.7 10 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="2" y="2" width="10" height="10" rx="2" fill="currentColor" />
    </svg>
  );
}

export default function ReadingPassagesPage() {
  const [passageIdx, setPassageIdx] = useState(0);
  const [popup, setPopup] = useState(null);
  const [activeWord, setActiveWord] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const popupRef = useRef();

  const passage = PASSAGES[passageIdx];
  const difficulty = PASSAGE_DIFFICULTY[passage.title] || 'intermediate';

  const stopSpeech = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, []);

  const handlePassageChange = useCallback((val) => {
    stopSpeech();
    setPassageIdx(Number(val));
    setPopup(null);
    setActiveWord(null);
  }, [stopSpeech]);

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;
    stopSpeech();
    const utt = new SpeechSynthesisUtterance(passage.text);
    utt.lang = 'th-TH';
    utt.rate = 0.82;
    utt.onstart = () => setSpeaking(true);
    utt.onend   = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utt);
  };

  const handleWordClick = useCallback((tok, e) => {
    const rect = e.target.getBoundingClientRect();
    const popupWidth = 220;
    const x = Math.max(8, Math.min(rect.left, window.innerWidth - popupWidth - 8));
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
      className="max-w-[1200px] mx-auto px-5 py-8 overflow-x-hidden"
      onClick={(e) => {
        if (popup && !e.target.closest('[data-word]')) closePopup();
      }}
    >
      <h1 className="text-3xl font-serif font-normal mb-1">
        Reading <em className="text-primary not-italic font-medium">Passages</em>
      </h1>
      <Separator className="mb-6" />

      {/* Passage picker + read-aloud button */}
      <div className="flex gap-2 items-center mb-4 flex-wrap">
        <Select
          value={String(passageIdx)}
          onValueChange={handlePassageChange}
        >
          <SelectTrigger className="flex-1 rounded-none min-w-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-none">
            {PASSAGES.map((p, i) => {
              const diff = PASSAGE_DIFFICULTY[p.title] || 'intermediate';
              const dot = diff === 'beginner' ? 'bg-green-500' : diff === 'advanced' ? 'bg-red-500' : 'bg-amber-500';
              return (
                <SelectItem key={i} value={String(i)} className="rounded-none">
                  <span className="flex items-center gap-2">
                    <span className={cn('w-1.5 h-1.5 rounded-full shrink-0 inline-block', dot)} />
                    {p.title}
                  </span>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        {!speaking ? (
          <button
            onClick={handleSpeak}
            className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card hover:border-primary/40 hover:text-primary text-sm text-muted-foreground transition-colors"
          >
            <SpeakerIcon />
            Read aloud
          </button>
        ) : (
          <button
            onClick={stopSpeech}
            className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg border border-primary/50 bg-primary/8 text-primary text-sm transition-colors"
          >
            <StopIcon />
            Stop
          </button>
        )}
      </div>

      {/* Difficulty badge */}
      <div className="flex items-center gap-2 mb-4">
        <DifficultyBadge level={difficulty} />
        {speaking && (
          <span className="text-[0.65rem] text-muted-foreground animate-pulse">Reading aloud…</span>
        )}
      </div>

      {/* Passage text */}
      <Card className="mb-6 rounded-none shadow-none overflow-hidden">
        <CardContent className="p-6 text-base leading-[2.2] text-foreground [overflow-wrap:break-word] [word-break:break-word] min-w-0">
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
