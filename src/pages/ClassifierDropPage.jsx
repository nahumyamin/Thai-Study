import { useState, useCallback } from 'react';
import { CLASSIFIER_QUESTIONS } from '../data/classifierDrop.js';
import ExitButton from '@/components/ExitButton';
import { Button } from '@/components/ui/button';
import { useRomaji } from '../context/RomajiContext.jsx';
import { useScrollTopOnChange } from '@/lib/useScrollTopOnChange.js';
import { cn } from '@/lib/utils';

const ROUND_SIZE = 30;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildRound() {
  return shuffle([...CLASSIFIER_QUESTIONS]).slice(0, ROUND_SIZE);
}

// ── Round-complete screen ────────────────────────────────────────
function RoundComplete({ score, total, onPlayAgain }) {
  const pct = Math.round((score / total) * 100);
  const grade =
    pct >= 90 ? { label: 'Excellent!', color: 'text-emerald-600 dark:text-emerald-400' } :
    pct >= 70 ? { label: 'Good job!',  color: 'text-primary' } :
               { label: 'Keep practising!', color: 'text-amber-600 dark:text-amber-400' };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 text-center">
      <div className="text-6xl mb-4">🎯</div>
      <h2 className="text-3xl font-serif font-normal mb-1">Round complete!</h2>
      <p className={cn('text-xl font-semibold mb-6', grade.color)}>{grade.label}</p>

      <div className="border border-border rounded-xl bg-card p-6 mb-8 inline-block min-w-[220px]">
        <div className="text-5xl font-bold text-foreground mb-1">
          {score}<span className="text-2xl text-muted-foreground">/{total}</span>
        </div>
        <div className="text-sm text-muted-foreground">{pct}% accuracy</div>
        <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <Button onClick={onPlayAgain}>Play again</Button>
      </div>
    </div>
  );
}

// ── Instructions screen ──────────────────────────────────────────
function IntroScreen({ onStart, showPage }) {
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif font-normal mb-1">
        Classifier <em className="text-primary not-italic font-medium">Drop</em>
      </h1>
      <div className="h-px bg-border my-4" />
      <p className="text-sm text-muted-foreground leading-relaxed mb-2">
        A Thai noun appears with four classifier options. Tap the correct classifier (ลักษณนาม)
        for that noun before moving on. Each round has {ROUND_SIZE} nouns, with a hint after every answer.
      </p>
      {showPage && (
        <p className="text-xs text-muted-foreground mb-6">
          Want a refresher first?{' '}
          <button
            className="underline underline-offset-2 hover:text-foreground transition-colors"
            onClick={() => showPage('classifiers')}
          >
            Browse the Numbers &amp; Classifiers guide
          </button>
          .
        </p>
      )}
      <Button onClick={onStart}>Start →</Button>
    </div>
  );
}

// ── Main game ────────────────────────────────────────────────────
export default function ClassifierDropPage({ showPage }) {
  const { showRomaji } = useRomaji();
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent]     = useState(0);
  const [score, setScore]         = useState(0);
  const [streak, setStreak]       = useState(0);
  const [choice, setChoice]       = useState(null); // null | { selected, correct, hint }
  const [phase, setPhase]         = useState('intro'); // 'intro' | 'playing' | 'done'
  useScrollTopOnChange(phase);

  const handleStart = () => {
    setQuestions(buildRound());
    setCurrent(0);
    setScore(0);
    setStreak(0);
    setChoice(null);
    setPhase('playing');
  };

  const handleExit = () => setPhase('intro');

  const q = questions[current];

  // Build shuffled options for this question
  const options = useCallback(() => {
    return q ? shuffle([q.correct, ...q.distractors]) : [];
  }, [q])();

  const handleChoice = (opt) => {
    if (choice) return;
    const correct = opt === q.correct;
    setChoice({ selected: opt, correct, hint: q.hint });
    if (correct) {
      setScore(s => s + 1);
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    const nextIdx = current + 1;
    if (nextIdx >= questions.length) {
      setPhase('done');
    } else {
      setCurrent(nextIdx);
      setChoice(null);
    }
  };

  const handlePlayAgain = () => {
    setQuestions(buildRound());
    setCurrent(0);
    setScore(0);
    setStreak(0);
    setChoice(null);
    setPhase('playing');
  };

  if (phase === 'intro') {
    return <IntroScreen onStart={handleStart} showPage={showPage} />;
  }

  if (phase === 'done') {
    return <RoundComplete score={score} total={questions.length} onPlayAgain={handlePlayAgain} />;
  }

  const progress = ((current) / questions.length) * 100;

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-serif font-normal">
          Classifier <em className="text-primary not-italic font-medium">Drop</em>
        </h1>
        <div className="flex items-center gap-3 text-sm">
          <span className="flex items-center gap-1 font-semibold text-foreground">
            <span className="text-amber-500">★</span> {score}
          </span>
          {streak >= 2 && (
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
              🔥 {streak}
            </span>
          )}
        </div>
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

      {/* Noun card */}
      <div className="border border-border rounded-xl bg-card p-6 text-center mb-6">
        <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Which classifier?
        </div>
        <div className="text-5xl font-medium text-foreground mb-2">{q.noun}</div>
        <div className="text-sm text-muted-foreground">{showRomaji ? `${q.rom} · ${q.en}` : q.en}</div>
      </div>

      {/* 2×2 option grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {options.map((opt) => {
          let style = 'border-border bg-card hover:border-primary/40';
          if (choice) {
            if (opt === q.correct) {
              style = 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300';
            } else if (opt === choice.selected && !choice.correct) {
              style = 'border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300';
            } else {
              style = 'border-border bg-muted/40 opacity-50';
            }
          }
          return (
            <button
              key={opt}
              onClick={() => handleChoice(opt)}
              disabled={!!choice}
              className={cn(
                'py-5 rounded-xl border text-2xl font-medium transition-all duration-150',
                choice ? 'cursor-default' : 'cursor-pointer active:scale-95',
                style,
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {choice && (
        <div className={cn(
          'rounded-xl border p-4 mb-5 border-l-4',
          choice.correct
            ? 'border-emerald-500/40 bg-emerald-500/10 border-l-emerald-500'
            : 'border-rose-500/40 bg-rose-500/10 border-l-rose-500',
        )}>
          {choice.correct ? (
            <p className="font-semibold text-emerald-700 dark:text-emerald-400 mb-1">✓ Correct!</p>
          ) : (
            <p className="font-semibold text-rose-600 dark:text-rose-400 mb-1">
              ✗ The answer is <span className="text-lg">{q.correct}</span> — {q.correctEn}
            </p>
          )}
          <p className="text-sm text-amber-900 dark:text-amber-200">{choice.hint}</p>
        </div>
      )}

      {/* Next button */}
      {choice && (
        <Button className="w-full" onClick={handleNext}>
          {current + 1 >= questions.length ? 'See results →' : 'Next →'}
        </Button>
      )}
    </div>
  );
}
