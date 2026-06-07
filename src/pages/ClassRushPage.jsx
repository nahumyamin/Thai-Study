import { useState, useEffect, useRef } from 'react';
import { CONSONANTS, DIFF } from '../data/consonants.js';
import { track } from '@/lib/analytics.js';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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

const LOW_LETTERS = CONSONANTS.filter(c => c.cls === 'low').map(c => c.l).join(' ');
const MID_LETTERS = CONSONANTS.filter(c => c.cls === 'mid').map(c => c.l).join(' ');
const HIGH_LETTERS = CONSONANTS.filter(c => c.cls === 'high').map(c => c.l).join(' ');

const CLASS_OPTIONS = [
  { key: 'low', label: 'Low' },
  { key: 'mid', label: 'Mid' },
  { key: 'high', label: 'High' },
];

export default function ClassRushPage({ showPage }) {
  const [screen, setScreen] = useState('intro');
  const [difficulty, setDifficulty] = useState('normal');
  const [noTimeLimit, setNoTimeLimit] = useState(false);
  const [classes, setClasses] = useState(['low', 'mid', 'high']);

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [timerPct, setTimerPct] = useState(100);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [deck, setDeck] = useState([]);
  const [letterState, setLetterState] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [missedList, setMissedList] = useState([]);

  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  // Authoritative game state lives here so timer/answer callbacks never read stale closures.
  const gameRef = useRef(null);
  const timeoutMs = DIFF[difficulty]?.time || 2500;

  const clearTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const endGame = () => {
    clearTimer();
    setScreen('results');
  };

  const exitToIntro = () => {
    clearTimer();
    setScreen('intro');
  };

  function startTimer() {
    clearTimer();
    setTimerPct(100);
    const g = gameRef.current;
    if (!g || g.noTimeLimit) return;
    startTimeRef.current = null;
    timerRef.current = setInterval(() => {
      if (startTimeRef.current === null) startTimeRef.current = Date.now();
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.max(0, 100 - (elapsed / g.timeoutMs) * 100);
      setTimerPct(pct);
      if (pct <= 0) {
        clearTimer();
        handleTimeout();
      }
    }, 50);
  }

  function goNext() {
    const g = gameRef.current;
    g.idx += 1;
    if (g.idx >= g.deck.length) {
      endGame();
      return;
    }
    setCurrentIdx(g.idx);
    setLetterState(null);
    startTimer();
  }

  function handleTimeout() {
    const g = gameRef.current;
    if (!g || g.locked) return;
    g.locked = true;
    const cur = g.deck[g.idx];
    g.lives -= 1;
    g.streak = 0;
    g.missed = [...g.missed, cur];
    setLives(g.lives);
    setStreak(0);
    setMissedList(g.missed);
    setLetterState('wrong');
    setTimeout(() => {
      g.locked = false;
      if (g.lives <= 0) endGame();
      else goNext();
    }, 600);
  }

  function handleAnswer(cls) {
    const g = gameRef.current;
    if (!g || g.locked) return;
    const cur = g.deck[g.idx];
    if (!cur) return;
    clearTimer();
    g.locked = true;

    if (cur.cls === cls) {
      g.streak += 1;
      g.score += 10 + g.streak * 2;
      g.correct += 1;
      setLetterState('correct');
      setScore(g.score);
      setStreak(g.streak);
      setCorrectCount(g.correct);
      setTimeout(() => {
        g.locked = false;
        goNext();
      }, 400);
    } else {
      g.lives -= 1;
      g.streak = 0;
      g.missed = [...g.missed, cur];
      setLetterState('wrong');
      setLives(g.lives);
      setStreak(0);
      setMissedList(g.missed);
      setTimeout(() => {
        g.locked = false;
        if (g.lives <= 0) endGame();
        else goNext();
      }, 600);
    }
  }

  const startGame = () => {
    const pool = CONSONANTS.filter(c => classes.includes(c.cls));
    if (pool.length === 0) return;
    const d = shuffle(pool);
    gameRef.current = { idx: 0, lives: 3, score: 0, streak: 0, correct: 0, missed: [], deck: d, locked: false, noTimeLimit, timeoutMs };
    setDeck(d);
    setScore(0);
    setLives(3);
    setStreak(0);
    setCorrectCount(0);
    setMissedList([]);
    setCurrentIdx(0);
    setLetterState(null);
    setTimerPct(100);
    setScreen('game');
    track('game_start', { game: 'class_rush', difficulty, no_time_limit: noTimeLimit, classes: classes.join(',') });
    setTimeout(() => startTimer(), 100);
  };

  const toggleClass = (key) => {
    setClasses(prev =>
      prev.includes(key)
        ? (prev.length > 1 ? prev.filter(k => k !== key) : prev)  // keep at least one
        : [...prev, key]
    );
  };

  useEffect(() => {
    if (screen === 'results') {
      track('game_complete', { game: 'class_rush', score, correct: correctCount, missed: missedList.length, difficulty, no_time_limit: noTimeLimit });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  useEffect(() => {
    return () => clearTimer();
  }, []);

  const current = deck[currentIdx];
  const livesStr = '❤️'.repeat(Math.max(0, lives));

  const timerColor = timerPct > 50 ? 'bg-primary' : timerPct > 25 ? 'bg-amber-500' : 'bg-red-600';

  if (screen === 'intro') {
    return (
      <div className="max-w-[1200px] mx-auto px-5 py-8">
        <h1 className="text-3xl font-serif font-normal mb-1">
          Class <em className="text-primary not-italic font-medium">Rush</em>
        </h1>
        <Separator className="mb-6" />

        {/* Quiz controls — always at top */}
        <div className="max-w-[480px] mb-8">
          <p className="text-sm text-muted-foreground leading-relaxed mb-2">
            A consonant flashes on screen. Tap its class — Low, Mid, or High — as fast as you can. Miss three and it's game over.
          </p>
          <p className="text-xs text-muted-foreground mb-6">
            Not sure about consonant classes?{' '}
            <button
              className="underline underline-offset-2 hover:text-foreground transition-colors"
              onClick={() => showPage('pronunciation')}
            >
              Read the Pronunciation guide
            </button>
            {' '}first.
          </p>

          {/* Difficulty */}
          <div className="mb-6">
            <span className="block text-[0.75rem] font-semibold tracking-widest uppercase text-muted-foreground mb-3">
              Difficulty
            </span>
            <div className={cn('flex flex-wrap gap-1.5 transition-opacity', noTimeLimit && 'opacity-40 pointer-events-none')}>
              {Object.entries(DIFF).map(([key, val]) => (
                <Button
                  key={key}
                  size="sm"
                  variant={difficulty === key ? 'default' : 'outline'}
                  onClick={() => setDifficulty(key)}
                  disabled={noTimeLimit}
                >
                  {val.label} — {val.time / 1000} sec
                </Button>
              ))}
            </div>
          </div>

          {/* Timer mode */}
          <div className="mb-6">
            <span className="block text-[0.75rem] font-semibold tracking-widest uppercase text-muted-foreground mb-3">
              Timer
            </span>
            <div className="flex flex-wrap gap-1.5">
              <Button
                size="sm"
                variant={!noTimeLimit ? 'default' : 'outline'}
                onClick={() => setNoTimeLimit(false)}
              >
                Timed
              </Button>
              <Button
                size="sm"
                variant={noTimeLimit ? 'default' : 'outline'}
                onClick={() => setNoTimeLimit(true)}
              >
                No time limit
              </Button>
            </div>
          </div>

          {/* Classes to include */}
          <div className="mb-6">
            <span className="block text-[0.75rem] font-semibold tracking-widest uppercase text-muted-foreground mb-3">
              Classes
            </span>
            <div className="flex flex-wrap gap-1.5">
              {CLASS_OPTIONS.map(({ key, label }) => (
                <Button
                  key={key}
                  size="sm"
                  variant={classes.includes(key) ? 'default' : 'outline'}
                  onClick={() => toggleClass(key)}
                >
                  {label}
                </Button>
              ))}
            </div>
            <p className="text-[0.7rem] text-muted-foreground mt-2">
              Only letters from the selected classes will appear.
            </p>
          </div>

          <Button className="w-full" onClick={startGame}>Start →</Button>
        </div>

        {/* Reference cards — full width on desktop, compact on mobile */}
        <div className="grid grid-cols-3 gap-2 md:gap-4 mb-3">
          <Card className="text-center p-3 md:p-6 rounded-none shadow-none">
            <div className="text-[0.7rem] md:text-sm font-bold tracking-widest uppercase text-green-700 mb-2 md:mb-3">Low (24)</div>
            <div className="text-lg md:text-2xl leading-relaxed tracking-wide">{LOW_LETTERS}</div>
          </Card>
          <Card className="text-center p-3 md:p-6 rounded-none shadow-none">
            <div className="text-[0.7rem] md:text-sm font-bold tracking-widest uppercase text-blue-800 mb-2 md:mb-3">Mid (9)</div>
            <div className="text-lg md:text-2xl leading-relaxed tracking-wide">{MID_LETTERS}</div>
          </Card>
          <Card className="text-center p-3 md:p-6 rounded-none shadow-none">
            <div className="text-[0.7rem] md:text-sm font-bold tracking-widest uppercase text-red-900 mb-2 md:mb-3">High (11)</div>
            <div className="text-lg md:text-2xl leading-relaxed tracking-wide">{HIGH_LETTERS}</div>
          </Card>
        </div>
        <p className="text-xs text-muted-foreground italic">
          Tip: keep this legend in view until the classes feel natural.
        </p>
      </div>
    );
  }

  if (screen === 'results') {
    return (
      <div className="max-w-[1200px] mx-auto px-5 py-8">
        <h1 className="text-3xl font-serif font-normal mb-1">
          Class <em className="text-primary not-italic font-medium">Rush</em>
        </h1>
        <Separator className="mb-6" />
        <div className="max-w-[480px]">
          <div className="font-serif text-7xl italic text-primary text-center leading-none mt-3 mb-1">{score}</div>
          <div className="text-center text-sm text-muted-foreground mb-6">points</div>

          <div className="grid grid-cols-3 gap-2 mb-6">
            {[
              { val: correctCount, lbl: 'Correct' },
              { val: missedList.length, lbl: 'Missed' },
              { val: correctCount + missedList.length, lbl: 'Total' },
            ].map(s => (
              <Card key={s.lbl} className="text-center py-3 rounded-none shadow-none">
                <div className="text-2xl font-bold text-foreground leading-none">{s.val}</div>
                <div className="text-[0.68rem] text-muted-foreground tracking-widest uppercase mt-1">{s.lbl}</div>
              </Card>
            ))}
          </div>

          {missedList.length > 0 && (
            <div className="mb-6">
              <div className="text-[0.75rem] font-bold tracking-widest uppercase text-muted-foreground mb-3 pb-2 border-b border-border">
                Letters to review
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(72px,1fr))] gap-1.5">
                {missedList.map((c, i) => (
                  <Card key={i} className="text-center py-2 rounded-none shadow-none">
                    <div className="text-2xl text-primary leading-snug">{c.l}</div>
                    <div className="text-[0.62rem] text-muted-foreground leading-relaxed">{c.name}<br />{c.cls}</div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button className="flex-1" onClick={startGame}>Play again</Button>
            <Button variant="outline" className="flex-1" onClick={() => setScreen('intro')}>Menu</Button>
          </div>
        </div>
      </div>
    );
  }

  // Game screen
  return (
    <div className="max-w-[1200px] mx-auto px-5 py-8">
      <h1 className="text-3xl font-serif font-normal mb-1">
        Class <em className="text-primary not-italic font-medium">Rush</em>
      </h1>
      <Separator className="mb-4" />
      <div className="max-w-[480px]">
        <div className="flex justify-end mb-2">
          <ExitButton onClick={exitToIntro} />
        </div>
        {/* HUD */}
        <div className="flex justify-between items-center mb-3 px-4 py-3 bg-foreground text-background rounded">
          <div>
            <div className="text-[0.65rem] tracking-widest uppercase opacity-60">Score</div>
            <div className="text-xl font-bold">{score}</div>
          </div>
          <div className="text-center">
            <div className="text-[0.65rem] tracking-widest uppercase opacity-60">Lives</div>
            <div className="text-2xl tracking-wider">{livesStr || '💀'}</div>
          </div>
          <div className="text-right">
            <div className="text-[0.65rem] tracking-widest uppercase opacity-60">Streak</div>
            <div className="text-xl font-bold">{streak}</div>
          </div>
        </div>

        {/* Timer bar (hidden in no-time-limit mode) */}
        {noTimeLimit ? (
          <div className="mb-5 text-center text-[0.65rem] tracking-widest uppercase text-muted-foreground">
            No time limit
          </div>
        ) : (
          <div className="h-[5px] bg-border rounded-full overflow-hidden mb-5">
            <div
              className={cn('h-full rounded-full transition-[width,background-color] duration-100', timerColor)}
              style={{ width: `${timerPct}%` }}
            />
          </div>
        )}

        {/* Consonant display */}
        <div className="text-center mb-6 min-h-[180px] flex flex-col items-center justify-center gap-1">
          {current && (
            <>
              <div className={cn(
                'text-[7rem] leading-none font-light transition-all duration-100',
                letterState === 'correct' && 'text-green-600 scale-110',
                letterState === 'wrong' && 'text-red-600 scale-90',
                !letterState && 'text-foreground'
              )}>
                {current.l}
              </div>
              <div className="text-sm italic text-muted-foreground">{current.name}</div>
              <div className="text-xs font-semibold text-muted-foreground">{current.sound}</div>
            </>
          )}
        </div>

        {/* Class buttons */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <button
            className="py-4 rounded font-bold tracking-wide uppercase text-sm cursor-pointer transition-all hover:brightness-95 active:translate-y-px bg-[#EAF3DE] text-[#2a5a12] border-2 border-[#b0d890]"
            onClick={() => handleAnswer('low')}
          >
            Low
            <span className="block text-[0.62rem] font-normal opacity-70 mt-0.5 normal-case tracking-normal">ต่ำ · default mid</span>
          </button>
          <button
            className="py-4 rounded font-bold tracking-wide uppercase text-sm cursor-pointer transition-all hover:brightness-95 active:translate-y-px bg-[#E6F1FB] text-[#0c3a6e] border-2 border-[#90b8e8]"
            onClick={() => handleAnswer('mid')}
          >
            Mid
            <span className="block text-[0.62rem] font-normal opacity-70 mt-0.5 normal-case tracking-normal">กลาง · default mid</span>
          </button>
          <button
            className="py-4 rounded font-bold tracking-wide uppercase text-sm cursor-pointer transition-all hover:brightness-95 active:translate-y-px bg-[#FAECE7] text-[#6e200a] border-2 border-[#e8a090]"
            onClick={() => handleAnswer('high')}
          >
            High
            <span className="block text-[0.62rem] font-normal opacity-70 mt-0.5 normal-case tracking-normal">สูง · default rising</span>
          </button>
        </div>

        <div className={cn(
          'text-center text-sm min-h-[1.2rem]',
          streak >= 3 ? 'text-amber-500 font-bold' : 'text-muted-foreground'
        )}>
          {streak >= 3 ? `🔥 ${streak}x streak!` : streak > 0 ? `${streak}x streak` : ''}
        </div>
      </div>
    </div>
  );
}
