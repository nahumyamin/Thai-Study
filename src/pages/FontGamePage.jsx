import { useState, useMemo } from 'react';
import { FONT_GAME_WORDS, FONT_GAME_FONTS, FONT_GAME_INTRO, ROUND_SIZE } from '../data/fontGame.js';
import { Button } from '@/components/ui/button';
import ExitButton from '@/components/ExitButton';
import { cn } from '@/lib/utils';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildRound() {
  const pool = shuffle([...FONT_GAME_WORDS]);
  return pool.slice(0, ROUND_SIZE).map(word => {
    const font = FONT_GAME_FONTS[Math.floor(Math.random() * FONT_GAME_FONTS.length)];
    // Build 3 wrong answers from the rest of the pool
    const others = shuffle(FONT_GAME_WORDS.filter(w => w.thai !== word.thai));
    const choices = shuffle([word, ...others.slice(0, 3)]);
    return { word, font, choices };
  });
}

// ── Intro screen ──────────────────────────────────────────────────
function IntroScreen({ onStart, showPage }) {
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif font-normal mb-1">
        Font <em className="text-primary not-italic font-medium">Recognition</em>
      </h1>
      <div className="h-px bg-border my-4" />
      <p className="text-sm text-muted-foreground leading-relaxed mb-6">{FONT_GAME_INTRO}</p>

      {/* Font preview strip */}
      <div className="rounded-xl border border-border bg-card p-4 mb-8">
        <div className="text-[0.65rem] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          The same word across 5 fonts
        </div>
        <div className="grid grid-cols-5 gap-2">
          {FONT_GAME_FONTS.map(f => (
            <div key={f.family} className="flex flex-col items-center gap-1">
              <span
                className="text-2xl text-foreground leading-none"
                style={{ fontFamily: `'${f.family}', serif` }}
              >
                น้ำ
              </span>
              <span className="text-[0.58rem] text-muted-foreground text-center leading-tight">{f.label}</span>
            </div>
          ))}
        </div>
      </div>

      {showPage && (
        <p className="text-xs text-muted-foreground mb-6">
          New to reading Thai script?{' '}
          <button
            className="underline underline-offset-2 hover:text-foreground transition-colors cursor-pointer bg-transparent border-none"
            onClick={() => showPage('pronunciation')}
          >
            Review the Pronunciation guide
          </button>.
        </p>
      )}

      <Button onClick={onStart}>Start — {ROUND_SIZE} questions →</Button>
    </div>
  );
}

// ── Results screen ────────────────────────────────────────────────
function ResultsScreen({ score, total, onPlayAgain }) {
  const pct = Math.round((score / total) * 100);
  const msg = pct === 100 ? 'Perfect! Your eye is sharp.' :
              pct >= 80  ? 'Great job — fonts barely slow you down.' :
              pct >= 60  ? 'Good start — a few fonts still trip you up.' :
                           'Keep practicing — it gets easier fast.';
  return (
    <div className="max-w-xl mx-auto px-4 py-8 text-center">
      <div className="text-5xl mb-4">{pct === 100 ? '🏆' : pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '📖'}</div>
      <h2 className="text-2xl font-serif font-normal mb-1">{score} / {total}</h2>
      <p className="text-muted-foreground text-sm mb-6">{msg}</p>
      <Button onClick={onPlayAgain}>Play again</Button>
    </div>
  );
}

// ── Game screen ───────────────────────────────────────────────────
function GameScreen({ questions, onFinish, onExit }) {
  const [current, setCurrent] = useState(0);
  const [picked, setPicked] = useState(null); // null | index
  const [score, setScore] = useState(0);

  const q = questions[current];
  const isCorrect = picked !== null && q.choices[picked].thai === q.word.thai;

  const handlePick = (i) => {
    if (picked !== null) return;
    setPicked(i);
    if (q.choices[i].thai === q.word.thai) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      onFinish(score + (isCorrect ? 0 : 0)); // score already updated
    } else {
      setCurrent(c => c + 1);
      setPicked(null);
    }
  };

  // Fix: score is updated in handlePick but we read it after state flush
  const finalScore = score + (picked !== null && isCorrect ? 0 : 0);

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-xs text-muted-foreground">{current + 1} / {questions.length}</div>
        <div className="flex-1 mx-4 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${((current + (picked !== null ? 1 : 0)) / questions.length) * 100}%` }}
          />
        </div>
        <ExitButton onClick={onExit} />
      </div>

      {/* Font label */}
      <div className="text-center mb-2">
        <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-muted-foreground">
          Font: {q.font.label} — {q.font.style}
        </span>
      </div>

      {/* The word */}
      <div className="flex justify-center mb-8">
        <div className="text-[5rem] leading-none text-foreground select-none py-4">
          <span style={{ fontFamily: `'${q.font.family}', serif` }}>
            {q.word.thai}
          </span>
        </div>
      </div>

      {/* After answer: show word in standard font for comparison */}
      {picked !== null && (
        <div className="flex items-center justify-center gap-3 mb-5 text-sm text-muted-foreground">
          <span>Standard (Sarabun):</span>
          <span className="text-xl text-foreground font-thai-display">{q.word.thai}</span>
          <span className="text-muted-foreground">— {q.word.rom}</span>
        </div>
      )}

      {/* Choices */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {q.choices.map((choice, i) => {
          const correct = choice.thai === q.word.thai;
          let state = 'idle';
          if (picked !== null) {
            if (correct) state = 'correct';
            else if (picked === i) state = 'wrong';
          }
          return (
            <button
              key={i}
              onClick={() => handlePick(i)}
              disabled={picked !== null}
              className={cn(
                'py-3 px-4 rounded-xl border text-sm font-medium transition-all cursor-pointer',
                state === 'idle'    && 'border-border bg-card hover:border-primary/40 hover:bg-muted/40',
                state === 'correct' && 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300',
                state === 'wrong'   && 'border-red-400 bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300',
                picked !== null && state === 'idle' && 'opacity-40',
              )}
            >
              {choice.en}
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <Button className="w-full" onClick={handleNext}>
          {current + 1 >= questions.length ? 'See results →' : 'Next →'}
        </Button>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────
export default function FontGamePage({ showPage }) {
  const [screen, setScreen] = useState('intro'); // intro | game | results
  const [score, setScore]   = useState(0);
  const questions = useMemo(buildRound, [screen === 'game']);

  const handleStart    = () => setScreen('game');
  const handleFinish   = (s) => { setScore(s); setScreen('results'); };
  const handlePlayAgain = () => setScreen('game');
  const handleExit     = () => setScreen('intro');

  if (screen === 'game')    return <GameScreen questions={questions} onFinish={handleFinish} onExit={handleExit} />;
  if (screen === 'results') return <ResultsScreen score={score} total={ROUND_SIZE} onPlayAgain={handlePlayAgain} />;
  return <IntroScreen onStart={handleStart} showPage={showPage} />;
}
