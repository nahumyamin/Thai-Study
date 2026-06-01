import { useState } from 'react';
import { MISTAKE_SENTENCES } from '../data/mistakeHunter.js';
import ExitButton from '@/components/ExitButton';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ROUND_SIZE = 20;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildRound() {
  const pool = shuffle([...MISTAKE_SENTENCES]);
  return pool.slice(0, Math.min(ROUND_SIZE, pool.length));
}

const CATEGORY_LABELS = {
  'classifier':       'Classifier',
  'negation':         'Negation',
  'adjective-order':  'Adjective order',
  'aspect-marker':    'Aspect marker',
  'question-particle':'Question particle',
};

// ── Round summary ────────────────────────────────────────────────
function RoundSummary({ questions, results, onPlayAgain }) {
  const correct = results.filter(r => r.firstCorrect).length;
  const total   = results.length;
  const pct     = Math.round((correct / total) * 100);

  const byCat = {};
  results.forEach((r, i) => {
    const cat = questions[i].category;
    if (!byCat[cat]) byCat[cat] = { correct: 0, total: 0 };
    byCat[cat].total++;
    if (r.firstCorrect) byCat[cat].correct++;
  });

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-serif font-normal mb-1">Round complete!</h2>
      <div className="text-2xl font-bold text-primary mb-6">
        {correct}/{total} <span className="text-base font-normal text-muted-foreground">({pct}%)</span>
      </div>

      <div className="border border-border rounded-xl bg-card p-4 mb-6">
        <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          By category
        </div>
        <div className="flex flex-col gap-2">
          {Object.entries(byCat).map(([cat, { correct: c, total: t }]) => (
            <div key={cat} className="flex items-center gap-3">
              <span className="text-sm text-foreground w-36 shrink-0">{CATEGORY_LABELS[cat] || cat}</span>
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${Math.round((c / t) * 100)}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-10 text-right">{c}/{t}</span>
            </div>
          ))}
        </div>
      </div>

      <Button onClick={onPlayAgain}>Play again</Button>
    </div>
  );
}

// ── Instructions screen ──────────────────────────────────────────
function IntroScreen({ onStart, showPage }) {
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif font-normal mb-1">
        Mistake <em className="text-primary not-italic font-medium">Hunter</em>
      </h1>
      <div className="h-px bg-border my-4" />
      <p className="text-sm text-muted-foreground leading-relaxed mb-2">
        Each sentence contains exactly one grammar error — a wrong classifier, misplaced negation,
        bad adjective order, and so on. Tap the word you think is wrong, then read why. Each round
        has up to {ROUND_SIZE} sentences across several error types.
      </p>
      {showPage && (
        <p className="text-xs text-muted-foreground mb-6">
          Want a refresher first?{' '}
          <button
            className="underline underline-offset-2 hover:text-foreground transition-colors"
            onClick={() => showPage('grammar')}
          >
            Browse the Grammar guide
          </button>
          .
        </p>
      )}
      <Button onClick={onStart}>Start →</Button>
    </div>
  );
}

// ── Main game ────────────────────────────────────────────────────
export default function MistakeHunterPage({ showPage }) {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent]     = useState(0);
  const [score, setScore]         = useState(0);
  const [tapped, setTapped]       = useState(null); // index tapped, or null
  const [results, setResults]     = useState([]);
  const [phase, setPhase]         = useState('intro'); // 'intro' | 'playing' | 'done'

  const handleStart = () => {
    setQuestions(buildRound());
    setCurrent(0);
    setScore(0);
    setTapped(null);
    setResults([]);
    setPhase('playing');
  };

  const handleExit = () => setPhase('intro');

  const q = questions[current];
  const revealed = tapped !== null;

  const handleTap = (idx) => {
    if (revealed) return;
    const firstCorrect = idx === q.errorIndex;
    if (firstCorrect) setScore(s => s + 1);
    setTapped(idx);
  };

  const handleNext = () => {
    const newResults = [...results, { firstCorrect: tapped === q.errorIndex }];
    if (current + 1 >= questions.length) {
      setResults(newResults);
      setPhase('done');
    } else {
      setResults(newResults);
      setCurrent(c => c + 1);
      setTapped(null);
    }
  };

  const handlePlayAgain = () => {
    setQuestions(buildRound());
    setCurrent(0);
    setScore(0);
    setTapped(null);
    setResults([]);
    setPhase('playing');
  };

  if (phase === 'intro') {
    return <IntroScreen onStart={handleStart} showPage={showPage} />;
  }

  if (phase === 'done') {
    return <RoundSummary questions={questions} results={results} onPlayAgain={handlePlayAgain} />;
  }

  const progress = (current / questions.length) * 100;
  const catLabel = CATEGORY_LABELS[q.category] || q.category;

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-serif font-normal">
          Mistake <em className="text-primary not-italic font-medium">Hunter</em>
        </h1>
        <span className="text-sm font-semibold text-foreground">
          <span className="text-amber-500">★</span> {score}
        </span>
      </div>
      <div className="mb-2">
        <ExitButton onClick={handleExit} />
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {current + 1} / {questions.length}
        </span>
      </div>

      {/* Instruction card */}
      <div className="border border-border rounded-xl bg-card p-5 mb-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex-1">
            Tap the mistake
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
            {catLabel}
          </span>
        </div>

        {/* Word chips */}
        <div className="flex flex-wrap gap-2">
          {q.words.map((word, idx) => {
            let chipStyle = 'border-border bg-card hover:border-primary/40 cursor-pointer active:scale-95';

            if (revealed) {
              if (idx === q.errorIndex) {
                chipStyle = 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 cursor-default';
              } else if (idx === tapped && tapped !== q.errorIndex) {
                chipStyle = 'border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400 cursor-default';
              } else {
                chipStyle = 'border-border bg-muted/30 text-muted-foreground cursor-default';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleTap(idx)}
                disabled={revealed}
                className={cn(
                  'px-3 py-2 rounded-lg border text-lg font-medium transition-all duration-150 select-none',
                  chipStyle,
                )}
              >
                {word}
                {revealed && idx === q.errorIndex && (
                  <span className="ml-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">✓</span>
                )}
                {revealed && idx === tapped && tapped !== q.errorIndex && (
                  <span className="ml-1 text-xs font-bold text-rose-500">✗</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback */}
      {revealed && (
        <div className={cn(
          'rounded-xl border p-4 mb-5 border-l-4',
          tapped === q.errorIndex
            ? 'border-emerald-500/40 bg-emerald-500/10 border-l-emerald-500'
            : 'border-rose-500/40 bg-rose-500/10 border-l-rose-500',
        )}>
          {tapped === q.errorIndex ? (
            <p className="font-semibold text-emerald-700 dark:text-emerald-400 mb-2">✓ You found it!</p>
          ) : (
            <p className="font-semibold text-rose-600 dark:text-rose-400 mb-2">
              ✗ The error was "<span className="text-foreground">{q.words[q.errorIndex]}</span>"
              → should be "<span className="text-foreground">{q.correction}</span>"
            </p>
          )}
          <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
            {q.explanation}
          </p>
          {tapped === q.errorIndex && (
            <p className="mt-2 text-sm text-foreground">
              Correction: <span className="font-medium">{q.words[q.errorIndex]}</span>{' '}
              → <span className="font-medium text-emerald-700 dark:text-emerald-400">{q.correction}</span>
            </p>
          )}
        </div>
      )}

      {/* Next button */}
      {revealed && (
        <Button className="w-full" onClick={handleNext}>
          {current + 1 >= questions.length ? 'See results →' : 'Next →'}
        </Button>
      )}
    </div>
  );
}
