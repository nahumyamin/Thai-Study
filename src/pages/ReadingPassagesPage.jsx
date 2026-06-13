import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { PASSAGES, PASSAGE_DIFFICULTY } from '../data/passages.js';
import { allVocab } from '../data/vocab.js';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useRomaji } from '../context/RomajiContext.jsx';
import { useScrollTopOnChange } from '@/lib/useScrollTopOnChange.js';
import PassageFontControl, { FONT_MIN, FONT_MAX } from '@/components/PassageFontControl.jsx';
import { cn } from '@/lib/utils';

// ── Vocab tokenizer ───────────────────────────────────────────────
const vocabMap = new Map();
allVocab.forEach(w => vocabMap.set(w.thai, w));

// Tokenize a paragraph, tagging each token with its absolute character offset
// into the full passage text (so speech-boundary char indices can be mapped
// back to the rendered tokens for karaoke-style highlighting).
function tokenizeWithOffsets(text, base) {
  const tokens = [];
  let i = 0;
  while (i < text.length) {
    let matched = false;
    for (let len = 16; len >= 1; len--) {
      const chunk = text.slice(i, i + len);
      if (vocabMap.has(chunk)) {
        tokens.push({ text: chunk, def: vocabMap.get(chunk), start: base + i, end: base + i + len });
        i += len;
        matched = true;
        break;
      }
    }
    if (!matched) { tokens.push({ text: text[i], def: null, start: base + i, end: base + i + 1 }); i++; }
  }
  return tokens;
}

// Split the passage into paragraphs (on blank lines) while keeping every
// token's offset absolute within the original string passed to the utterance.
function buildParagraphs(text) {
  const paras = [];
  let cursor = 0;
  for (const part of text.split(/(\n\n+)/)) {
    if (part === '') continue;
    if (/^\n\n+$/.test(part)) { cursor += part.length; continue; }
    paras.push(tokenizeWithOffsets(part, cursor));
    cursor += part.length;
  }
  return paras;
}

// End offset of the word starting at `start`: use the engine-provided length
// when available, otherwise run to the next whitespace (Thai chunks are
// space-delimited), so the whole spoken chunk highlights.
function chunkEnd(text, start, len) {
  if (len > 0) return start + len;
  let j = start;
  while (j < text.length && !/\s/.test(text[j])) j++;
  return Math.max(j, start + 1);
}

function PassageText({ paragraphs, onWordClick, activeWord, spokenRange }) {
  const isSpoken = (tok) => spokenRange && tok.start < spokenRange.end && tok.end > spokenRange.start;
  return (
    <div>
      {paragraphs.map((toks, pi) => (
        <p key={pi} className={pi < paragraphs.length - 1 ? 'mb-4' : ''}>
          {toks.map((tok, ti) => {
            const spoken = isSpoken(tok);
            if (!tok.def) {
              return <span key={ti} className={spoken ? 'bg-primary/30 rounded-[3px]' : undefined}>{tok.text}</span>;
            }
            const isActive = activeWord === tok.text;
            return (
              <span
                key={ti}
                className={cn(
                  'cursor-pointer rounded-sm transition-colors border-b border-dotted border-primary',
                  spoken ? 'bg-primary/30' : isActive ? 'bg-primary/10' : 'hover:bg-primary/10'
                )}
                onClick={(e) => onWordClick(tok, e)}
              >
                {tok.text}
              </span>
            );
          })}
        </p>
      ))}
    </div>
  );
}

// ── Difficulty styling ────────────────────────────────────────────
const DIFF_STRIP = {
  beginner:     '#16a34a',
  intermediate: '#d97706',
  advanced:     '#dc2626',
};

// High-contrast badge: dark-on-light / light-on-dark
const DIFF_BADGE = {
  beginner:
    'text-green-900 bg-green-100 border-green-300 dark:text-green-200 dark:bg-green-900/60 dark:border-green-700',
  intermediate:
    'text-amber-900 bg-amber-100 border-amber-300 dark:text-amber-200 dark:bg-amber-900/60 dark:border-amber-700',
  advanced:
    'text-red-900 bg-red-100 border-red-300 dark:text-red-200 dark:bg-red-900/60 dark:border-red-700',
};

function DifficultyBadge({ level, className }) {
  return (
    <span className={cn(
      'text-[0.62rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded border shrink-0',
      DIFF_BADGE[level] || DIFF_BADGE.intermediate,
      className
    )}>
      {level}
    </span>
  );
}

// ── Icons ─────────────────────────────────────────────────────────
function SpeakerIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
      <path d="M2 5H4.5L8 2V12L4.5 9H2V5Z" fill="currentColor" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M10 4.5C10.8 5.3 11.3 6.1 11.3 7C11.3 7.9 10.8 8.7 10 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <rect x="2" y="2" width="10" height="10" rx="2" fill="currentColor" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <rect x="2.5" y="2" width="3" height="10" rx="1" fill="currentColor" />
      <rect x="8.5" y="2" width="3" height="10" rx="1" fill="currentColor" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <path d="M3.5 2.5L11 7L3.5 11.5V2.5Z" fill="currentColor" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

// ── Parse title into Thai + English parts ─────────────────────────
function parseTitle(title) {
  const sep = title.indexOf(' — ');
  if (sep === -1) return { thai: '', en: title };
  return { thai: title.slice(0, sep), en: title.slice(sep + 3) };
}

// ── Passage card (browse grid) ────────────────────────────────────
function PassageCard({ passage, idx, onSelect }) {
  const diff  = PASSAGE_DIFFICULTY[passage.title] || 'intermediate';
  const strip = DIFF_STRIP[diff];
  const { thai, en } = parseTitle(passage.title);
  const preview = passage.text.slice(0, 110) + '…';

  return (
    <button
      onClick={() => onSelect(idx)}
      className="group text-left rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col w-full"
    >
      <div className="h-1 w-full shrink-0" style={{ background: strip }} />
      <div className="p-4 flex flex-col flex-1 gap-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="font-semibold text-sm text-foreground leading-snug truncate">{en}</div>
            <div className="font-thai-display text-base text-muted-foreground leading-snug mt-0.5 truncate">{thai}</div>
          </div>
          <DifficultyBadge level={diff} />
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 flex-1 font-thai-display">
          {preview}
        </p>
        <div className="text-[0.63rem] text-muted-foreground/55 flex items-center gap-1 mt-0.5">
          <span>{passage.questions.length} questions</span>
          <span className="group-hover:translate-x-0.5 transition-transform">→</span>
        </div>
      </div>
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────
export default function ReadingPassagesPage({ showPage }) {
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [diffFilter, setDiffFilter]   = useState('all');
  const [speaking, setSpeaking]       = useState(false);
  const [popup, setPopup]             = useState(null);
  const { showRomaji } = useRomaji();
  const [activeWord, setActiveWord]   = useState(null);
  const [paused, setPaused]           = useState(false);
  const [spokenRange, setSpokenRange] = useState(null);
  const [fontScale, setFontScale]     = useState(() => {
    const v = parseFloat(localStorage.getItem('passage-font-scale'));
    return v >= FONT_MIN && v <= FONT_MAX ? v : FONT_MIN;
  });
  const popupRef = useRef();

  // Stop any speech if the user leaves the passages page entirely.
  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  useEffect(() => {
    localStorage.setItem('passage-font-scale', String(fontScale));
  }, [fontScale]);

  // Selecting a passage / going back swaps the view without a route change,
  // so reset scroll to the top of the new view.
  useScrollTopOnChange(selectedIdx);

  const stopSpeech = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    setPaused(false);
    setSpokenRange(null);
  }, []);

  const selectPassage = useCallback((idx) => {
    stopSpeech();
    setSelectedIdx(idx);
    setPopup(null);
    setActiveWord(null);
  }, [stopSpeech]);

  const goBack = useCallback(() => {
    stopSpeech();
    setSelectedIdx(null);
    setPopup(null);
    setActiveWord(null);
  }, [stopSpeech]);

  const handleSpeak = useCallback(() => {
    if (!('speechSynthesis' in window) || selectedIdx === null) return;
    const ss = window.speechSynthesis;
    ss.cancel();
    const text = PASSAGES[selectedIdx].text;
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'th-TH';
    utt.rate = 0.82;
    utt.onstart = () => { setSpeaking(true); setPaused(false); };
    utt.onend   = () => { setSpeaking(false); setPaused(false); setSpokenRange(null); };
    utt.onerror = () => { setSpeaking(false); setPaused(false); setSpokenRange(null); };
    utt.onboundary = (e) => {
      if (e.name && e.name !== 'word') return;
      const start = e.charIndex ?? 0;
      setSpokenRange({ start, end: chunkEnd(text, start, e.charLength || 0) });
    };
    // Chrome drops speak() called in the same tick as cancel(); defer it.
    setTimeout(() => ss.speak(utt), 60);
  }, [selectedIdx]);

  const pauseSpeech  = useCallback(() => { window.speechSynthesis?.pause();  setPaused(true);  }, []);
  const resumeSpeech = useCallback(() => { window.speechSynthesis?.resume(); setPaused(false); }, []);
  // Reset: restart reading from the beginning.
  const resetSpeech  = useCallback(() => { handleSpeak(); }, [handleSpeak]);

  const handleWordClick = useCallback((tok, e) => {
    const rect = e.target.getBoundingClientRect();
    const popupWidth = 220;
    const x = Math.max(8, Math.min(rect.left, window.innerWidth - popupWidth - 8));
    setActiveWord(tok.text);
    setPopup({ word: tok.def, x, y: rect.bottom + 8 });
  }, []);

  const closePopup = () => { setPopup(null); setActiveWord(null); };

  // Counts per difficulty for filter tabs
  const counts = useMemo(() => {
    const c = { all: PASSAGES.length, beginner: 0, intermediate: 0, advanced: 0 };
    PASSAGES.forEach(p => { const d = PASSAGE_DIFFICULTY[p.title] || 'intermediate'; c[d]++; });
    return c;
  }, []);

  const filteredPassages = useMemo(() =>
    PASSAGES.map((p, i) => ({ p, i }))
      .filter(({ p }) => diffFilter === 'all' || PASSAGE_DIFFICULTY[p.title] === diffFilter),
    [diffFilter]
  );

  const paragraphs = useMemo(
    () => (selectedIdx === null ? [] : buildParagraphs(PASSAGES[selectedIdx].text)),
    [selectedIdx]
  );

  const FILTER_TABS = [
    { id: 'all',          label: 'All',          count: counts.all },
    { id: 'beginner',     label: 'Beginner',     count: counts.beginner },
    { id: 'intermediate', label: 'Intermediate', count: counts.intermediate },
    { id: 'advanced',     label: 'Advanced',     count: counts.advanced },
  ];

  // ── Browse view ───────────────────────────────────────────────
  if (selectedIdx === null) {
    return (
      <div className="max-w-[1200px] mx-auto px-5 py-8">
        <h1 className="text-3xl font-serif font-normal mb-1">
          Reading <em className="text-primary not-italic font-medium">Passages</em>
        </h1>
        <p className="text-xs text-muted-foreground mt-1 mb-4">
          New to reading Thai?{' '}
          <button
            className="underline underline-offset-2 hover:text-foreground transition-colors"
            onClick={() => showPage('reading')}
          >
            Read the Reading Strategies guide
          </button>
          {' '}first.
        </p>
        <Separator className="mb-6" />

        {/* Difficulty filter tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {FILTER_TABS.map(({ id, label, count }) => (
            <button
              key={id}
              onClick={() => setDiffFilter(id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all',
                diffFilter === id
                  ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-primary dark:text-primary-foreground dark:border-primary'
                  : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground'
              )}
            >
              {label}
              <span className={cn(
                'text-[0.65rem] font-bold tabular-nums px-1.5 py-0.5 rounded-full',
                diffFilter === id
                  ? 'bg-primary-foreground/20 text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              )}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPassages.map(({ p, i }) => (
            <PassageCard key={i} passage={p} idx={i} onSelect={selectPassage} />
          ))}
        </div>
      </div>
    );
  }

  // ── Reading view ──────────────────────────────────────────────
  const passage    = PASSAGES[selectedIdx];
  const difficulty = PASSAGE_DIFFICULTY[passage.title] || 'intermediate';
  const { thai, en } = parseTitle(passage.title);

  return (
    <div
      className="max-w-[1200px] mx-auto px-5 py-8 overflow-x-hidden"
      onClick={(e) => { if (popup && !e.target.closest('[data-word]')) closePopup(); }}
    >
      {/* Back + header */}
      <div className="flex items-start gap-4 mb-1">
        <button
          onClick={goBack}
          className="mt-1 shrink-0 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors bg-transparent border-none cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Passages
        </button>
        <div className="min-w-0">
          <h1 className="text-3xl font-serif font-normal leading-tight">{en}</h1>
          <div className="font-thai-display text-lg text-muted-foreground leading-snug mt-0.5">{thai}</div>
        </div>
      </div>
      <Separator className="mb-5" />

      {/* Meta row: difficulty + read-aloud controls */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <DifficultyBadge level={difficulty} className="mr-1" />
        {!speaking ? (
          <button
            onClick={handleSpeak}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:border-primary/40 hover:text-primary text-sm text-muted-foreground transition-colors"
          >
            <SpeakerIcon />
            Read aloud
          </button>
        ) : (
          <>
            <button
              onClick={paused ? resumeSpeech : pauseSpeech}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/50 bg-primary/8 text-primary text-sm transition-colors hover:bg-primary/15"
            >
              {paused ? <PlayIcon /> : <PauseIcon />}
              {paused ? 'Resume' : 'Pause'}
            </button>
            <button
              onClick={stopSpeech}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:border-primary/40 hover:text-primary text-sm text-muted-foreground transition-colors"
            >
              <StopIcon />
              Stop
            </button>
            <button
              onClick={resetSpeech}
              title="Restart from the beginning"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:border-primary/40 hover:text-primary text-sm text-muted-foreground transition-colors"
            >
              <ResetIcon />
              Reset
            </button>
          </>
        )}
        {speaking && (
          <span className="text-[0.65rem] text-muted-foreground animate-pulse">
            {paused ? 'Paused' : 'Reading aloud…'}
          </span>
        )}
        <PassageFontControl scale={fontScale} setScale={setFontScale} />
      </div>

      {/* Passage text */}
      <Card className="mb-6 rounded-none shadow-none overflow-hidden">
        <CardContent
          className="p-6 leading-[2.2] text-foreground [overflow-wrap:break-word] [word-break:break-word] min-w-0"
          style={{ fontSize: `${fontScale}rem` }}
        >
          <PassageText
            paragraphs={paragraphs}
            onWordClick={handleWordClick}
            activeWord={activeWord}
            spokenRange={spokenRange}
          />
        </CardContent>
      </Card>

      {/* Discussion questions */}
      <div className="border-t border-border pt-5 mb-8">
        <div className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-3">
          Discussion questions
        </div>
        {passage.questions.map((q, i) => (
          <div
            key={i}
            className={`flex gap-3 py-2 text-sm text-muted-foreground leading-relaxed ${i < passage.questions.length - 1 ? 'border-b border-border' : ''}`}
          >
            <span className="font-serif italic text-primary shrink-0 text-base leading-relaxed">{i + 1}.</span>
            <span>{q}</span>
          </div>
        ))}
      </div>

      {/* Prev / Next navigation */}
      <div className="flex justify-between gap-3 border-t border-border pt-5">
        {selectedIdx > 0 ? (
          <button
            onClick={() => selectPassage(selectedIdx - 1)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors bg-transparent border-none cursor-pointer group"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>
              <span className="block text-[0.62rem] uppercase tracking-widest opacity-60">Previous</span>
              <span className="block truncate max-w-[180px]">{parseTitle(PASSAGES[selectedIdx - 1].title).en}</span>
            </span>
          </button>
        ) : <div />}

        {selectedIdx < PASSAGES.length - 1 ? (
          <button
            onClick={() => selectPassage(selectedIdx + 1)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors bg-transparent border-none cursor-pointer text-right group ml-auto"
          >
            <span>
              <span className="block text-[0.62rem] uppercase tracking-widest opacity-60">Next</span>
              <span className="block truncate max-w-[180px]">{parseTitle(PASSAGES[selectedIdx + 1].title).en}</span>
            </span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ) : <div />}
      </div>

      {/* Word popup */}
      {popup && (
        <div
          ref={popupRef}
          className="fixed z-50 bg-popover text-popover-foreground shadow-md rounded p-2 text-sm pointer-events-none max-w-[220px]"
          style={{ left: popup.x, top: popup.y }}
        >
          <strong className="block">{popup.word.thai}</strong>
          {showRomaji && <><em className="text-xs opacity-70">{popup.word.rom}</em><br /></>}
          {popup.word.en}
        </div>
      )}
    </div>
  );
}
