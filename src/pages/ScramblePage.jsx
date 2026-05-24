import { useState } from 'react';
import { SCRAMBLE_SENTENCES } from '../data/scramble.js';
import { track } from '@/lib/analytics.js';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  if (a.length > 1 && a.join('|') === arr.join('|')) return shuffle(arr);
  return a;
}

// ── Drag-to-reorder chips ─────────────────────────────────────────
function WordChips({ words, onChange, disabled }) {
  const [dragIdx, setDragIdx] = useState(null);
  const [overIdx, setOverIdx] = useState(null);

  const onDragStart = (i) => setDragIdx(i);
  const onDragOver = (e, i) => { e.preventDefault(); setOverIdx(i); };
  const onDragLeave = () => setOverIdx(null);
  const onDrop = (e, i) => {
    e.preventDefault();
    if (dragIdx !== null && dragIdx !== i) {
      const next = [...words];
      const [item] = next.splice(dragIdx, 1);
      next.splice(i, 0, item);
      onChange(next);
    }
    setDragIdx(null);
    setOverIdx(null);
  };
  const onDragEnd = () => { setDragIdx(null); setOverIdx(null); };

  return (
    <div className="flex flex-wrap gap-2 min-h-[3rem]">
      {words.map((w, i) => (
        <div
          key={`${w}-${i}`}
          draggable={!disabled}
          onDragStart={() => onDragStart(i)}
          onDragOver={(e) => onDragOver(e, i)}
          onDragLeave={onDragLeave}
          onDrop={(e) => onDrop(e, i)}
          onDragEnd={onDragEnd}
          className={cn(
            'px-3 py-2 rounded-lg border text-base select-none transition-all duration-150',
            disabled
              ? 'cursor-default border-border bg-muted/40'
              : 'cursor-grab active:cursor-grabbing hover:border-primary/40',
            dragIdx === i ? 'opacity-30 scale-95 border-primary' : 'border-border bg-card',
            overIdx === i && dragIdx !== i
              ? 'ring-2 ring-primary/30 border-primary bg-primary/5 scale-105'
              : '',
          )}
        >
          {w}
        </div>
      ))}
    </div>
  );
}

// ── Setup screen ──────────────────────────────────────────────────
function SetupScreen({ count, setCount, mode, setMode, onStart, showPage }) {
  return (
    <div className="max-w-[640px] mx-auto px-5 py-8">
      <h1 className="text-3xl font-serif font-normal mb-1">
        Thai <em className="text-primary not-italic font-medium">Scramble</em>
      </h1>
      <Separator className="mb-4" />
      <p className="text-sm text-muted-foreground leading-relaxed mb-2">
        Rearrange scrambled Thai words into the correct sentence order. Choose drag mode
        to reorder chips, or type the sentence out yourself.
      </p>
      <p className="text-xs text-muted-foreground mb-8">
        Want a grammar refresher first?{' '}
        <button
          className="underline underline-offset-2 hover:text-foreground transition-colors"
          onClick={() => showPage('grammar')}
        >
          Browse the Grammar guide
        </button>
        .
      </p>

      <div className="mb-8">
        <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Words to unscramble
        </div>
        <div className="flex gap-2 flex-wrap">
          {[
            { n: 5,  label: '~5 words',  sub: 'Easy' },
            { n: 10, label: '~10 words', sub: 'Medium' },
            { n: 15, label: '~15 words', sub: 'Hard' },
          ].map(({ n, label, sub }) => (
            <button
              key={n}
              onClick={() => setCount(n)}
              className={cn(
                'px-5 py-2.5 rounded-lg border text-sm font-medium transition-all flex flex-col items-center gap-0.5 min-w-[90px]',
                count === n
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border bg-card hover:border-primary/40',
              )}
            >
              <span>{label}</span>
              <span className={cn('text-xs font-normal', count === n ? 'text-primary-foreground/70' : 'text-muted-foreground')}>{sub}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-10">
        <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Play mode
        </div>
        <div className="flex gap-2">
          {[
            { id: 'drag', label: 'Drag & Drop' },
            { id: 'type', label: 'Type it out' },
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={cn(
                'px-6 py-2.5 rounded-lg border text-sm font-medium transition-all',
                mode === m.id
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border bg-card hover:border-primary/40',
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
        {mode === 'type' && (
          <p className="text-xs text-muted-foreground mt-2">
            You will need a Thai keyboard input method enabled.
          </p>
        )}
      </div>

      <Button size="lg" onClick={onStart}>Start →</Button>
    </div>
  );
}

// ── Play screen ───────────────────────────────────────────────────
function PlayScreen({ sentences, mode, onFinish }) {
  const [current, setCurrent] = useState(0);
  const [words, setWords] = useState(sentences[0].scrambled);
  const [input, setInput] = useState('');
  const [checked, setChecked] = useState(null);
  const [scores, setScores] = useState([]);

  const sentence = sentences[current];
  const isLast = current === sentences.length - 1;
  const correctCount = scores.filter(s => s.ok).length;

  const handleCheck = () => {
    const correct = sentence.thai;
    const answer = mode === 'drag'
      ? words.join(' ')
      : input.trim().split(/\s+/).join(' ');
    setChecked({ ok: answer === correct, correct, answer });
  };

  const handleNext = () => {
    const newScores = [...scores, checked];
    if (isLast) {
      onFinish(newScores);
    } else {
      const next = current + 1;
      setScores(newScores);
      setCurrent(next);
      setWords(sentences[next].scrambled);
      setInput('');
      setChecked(null);
    }
  };

  return (
    <div className="max-w-[800px] mx-auto px-5 py-8">
      {/* Progress */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          <span className="font-semibold text-foreground">{current + 1}</span> / {sentences.length}
        </span>
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${(current / sentences.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground whitespace-nowrap">{correctCount} correct</span>
      </div>

      {/* Card */}
      <div className="border border-border rounded-xl p-5 md:p-6 bg-card mb-4">
        <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          {mode === 'drag' ? 'Drag the words into the correct order' : 'Type the sentence in Thai'}
        </div>

        {mode === 'drag' ? (
          <WordChips words={words} onChange={setWords} disabled={!!checked} />
        ) : (
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={!!checked}
            placeholder="Type the Thai sentence…"
            className="w-full px-3 py-2.5 text-base border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
            onKeyDown={e => { if (e.key === 'Enter' && !checked && input.trim()) handleCheck(); }}
            autoFocus
          />
        )}

        <div className="mt-5 pt-4 border-t border-border flex gap-2 items-baseline">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground shrink-0">
            EN
          </span>
          <span className="text-sm text-muted-foreground">{sentence.en}</span>
        </div>
      </div>

      {/* Feedback */}
      {checked && (
        <div className={cn(
          'rounded-xl border border-border bg-card p-4 mb-4 text-sm border-l-4',
          checked.ok ? 'border-l-green-500' : 'border-l-red-500',
        )}>
          {checked.ok ? (
            <span className="font-semibold text-green-600 dark:text-green-400">✓ Correct!</span>
          ) : (
            <>
              <div className="font-semibold text-red-600 dark:text-red-400 mb-2">✗ Not quite</div>
              <div className="text-muted-foreground text-xs mb-0.5">Correct answer:</div>
              <div className="font-medium text-base text-foreground">{checked.correct}</div>
            </>
          )}
        </div>
      )}

      {/* Action */}
      <div className="flex gap-2">
        {!checked ? (
          <Button
            onClick={handleCheck}
            disabled={mode === 'type' && !input.trim()}
          >
            Check
          </Button>
        ) : (
          <Button onClick={handleNext}>
            {isLast ? 'See Results →' : 'Next →'}
          </Button>
        )}
      </div>
    </div>
  );
}

// ── Results screen ────────────────────────────────────────────────
function ResultsScreen({ sentences, scores, onPlayAgain }) {
  const correct = scores.filter(s => s.ok).length;
  const total = scores.length;
  const pct = Math.round((correct / total) * 100);

  return (
    <div className="max-w-[800px] mx-auto px-5 py-8">
      <div className="flex items-baseline gap-3 mb-1">
        <h2 className="text-3xl font-serif font-normal">Results</h2>
        <span className="text-2xl font-semibold text-primary">{correct}/{total}</span>
        <span className="text-sm text-muted-foreground">({pct}%)</span>
      </div>
      <Separator className="mb-6" />

      <div className="flex flex-col gap-3 mb-8">
        {sentences.map((s, i) => {
          const sc = scores[i];
          return (
            <div
              key={i}
              className={cn(
                'p-4 rounded-xl border border-border bg-card border-l-4',
                sc.ok ? 'border-l-green-500' : 'border-l-red-500',
              )}
            >
              <div className="flex items-start gap-3">
                <span className={cn('font-bold text-base shrink-0 mt-0.5', sc.ok ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400')}>
                  {sc.ok ? '✓' : '✗'}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted-foreground mb-1">{s.en}</div>
                  <div className="text-base font-medium text-foreground">{s.thai}</div>
                  {!sc.ok && sc.answer && (
                    <div className="mt-1.5 text-sm text-muted-foreground">
                      Your answer: <span className="font-medium text-foreground">{sc.answer}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Button onClick={onPlayAgain}>Play again</Button>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────
export default function ScramblePage({ showPage }) {
  const [phase, setPhase] = useState('setup');
  const [count, setCount] = useState(5);
  const [mode, setMode] = useState('drag');
  const [sentences, setSentences] = useState([]);
  const [finalScores, setFinalScores] = useState([]);

  const handleStart = () => {
    const pool = SCRAMBLE_SENTENCES.filter(s => s.difficulty === count);
    const picked = [...pool]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5)
      .map(s => {
        const tokens = s.thai.split(' ');
        return { ...s, tokens, scrambled: shuffle(tokens) };
      });
    setSentences(picked);
    setPhase('playing');
    track('game_start', { game: 'scramble', difficulty: count, mode });
  };

  if (phase === 'setup') return (
    <SetupScreen count={count} setCount={setCount} mode={mode} setMode={setMode} onStart={handleStart} showPage={showPage} />
  );
  if (phase === 'playing') return (
    <PlayScreen sentences={sentences} mode={mode} onFinish={scores => {
      setFinalScores(scores);
      setPhase('results');
      const correct = scores.filter(s => s.ok).length;
      track('game_complete', { game: 'scramble', correct, total: scores.length, pct: Math.round((correct / scores.length) * 100), mode });
    }} />
  );
  return (
    <ResultsScreen sentences={sentences} scores={finalScores} onPlayAgain={() => setPhase('setup')} />
  );
}
