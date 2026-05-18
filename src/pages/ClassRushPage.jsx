import { useState, useEffect, useRef, useCallback } from 'react';
import { CONSONANTS, DIFF } from '../data/consonants.js';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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

export default function ClassRushPage() {
  const [screen, setScreen] = useState('intro');
  const [difficulty, setDifficulty] = useState('normal');

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
  const timeoutMs = DIFF[difficulty]?.time || 2500;

  const endGame = useCallback(() => {
    clearInterval(timerRef.current);
    setScreen('results');
  }, []);

  const nextLetter = useCallback((newDeck, newIdx, newLives, newScore, newStreak, newCorrect, newMissed) => {
    clearInterval(timerRef.current);
    if (newIdx >= newDeck.length || newLives <= 0) {
      endGame();
      return;
    }
    setTimerPct(100);
    setLetterState(null);
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.max(0, 100 - (elapsed / timeoutMs) * 100);
      setTimerPct(pct);
      if (pct <= 0) {
        clearInterval(timerRef.current);
        const newL = newLives - 1;
        const nm = [...newMissed, newDeck[newIdx]];
        setLives(newL);
        setStreak(0);
        setMissedList(nm);
        setLetterState('wrong');
        setTimeout(() => {
          if (newL <= 0) {
            endGame();
          } else {
            nextLetter(newDeck, newIdx + 1, newL, newScore, 0, newCorrect, nm);
          }
        }, 600);
      }
    }, 50);
  }, [timeoutMs, endGame]);

  const startGame = () => {
    const d = shuffle([...CONSONANTS]);
    setDeck(d);
    setScore(0);
    setLives(3);
    setStreak(0);
    setCorrectCount(0);
    setMissedList([]);
    setCurrentIdx(0);
    setLetterState(null);
    setScreen('game');
    setTimeout(() => {
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        const pct = Math.max(0, 100 - (elapsed / timeoutMs) * 100);
        setTimerPct(pct);
        if (pct <= 0) {
          clearInterval(timerRef.current);
          setLives(prev => {
            const newL = prev - 1;
            setStreak(0);
            setLetterState('wrong');
            setMissedList(prev2 => {
              const nm = [...prev2, d[0]];
              setTimeout(() => {
                if (newL <= 0) {
                  endGame();
                } else {
                  setCurrentIdx(1);
                }
              }, 600);
              return nm;
            });
            return newL;
          });
        }
      }, 50);
    }, 100);
  };

  const handleAnswer = (cls) => {
    clearInterval(timerRef.current);
    const current = deck[currentIdx];
    if (!current) return;
    const isCorrect = current.cls === cls;

    if (isCorrect) {
      setLetterState('correct');
      setScore(prev => {
        const newStreak = streak + 1;
        setStreak(newStreak);
        const pts = 10 + newStreak * 2;
        const ns = prev + pts;
        setCorrectCount(c => c + 1);
        setTimeout(() => {
          const nextIdx = currentIdx + 1;
          setCurrentIdx(nextIdx);
          setLetterState(null);
          if (nextIdx >= deck.length) {
            endGame();
          } else {
            setTimerPct(100);
            startTimeRef.current = Date.now();
            timerRef.current = setInterval(() => {
              const elapsed = Date.now() - startTimeRef.current;
              const pct = Math.max(0, 100 - (elapsed / timeoutMs) * 100);
              setTimerPct(pct);
              if (pct <= 0) {
                clearInterval(timerRef.current);
                setLives(l => {
                  const newL = l - 1;
                  setStreak(0);
                  setLetterState('wrong');
                  setMissedList(m => {
                    const nm = [...m, deck[nextIdx]];
                    setTimeout(() => {
                      if (newL <= 0) {
                        endGame();
                      } else {
                        const ni2 = nextIdx + 1;
                        setCurrentIdx(ni2);
                        setLetterState(null);
                        if (ni2 < deck.length) {
                          setTimerPct(100);
                          startTimeRef.current = Date.now();
                        }
                      }
                    }, 600);
                    return nm;
                  });
                  return newL;
                });
              }
            }, 50);
          }
        }, 400);
        return ns;
      });
    } else {
      setLetterState('wrong');
      setStreak(0);
      setLives(prev => {
        const newL = prev - 1;
        setMissedList(m => {
          const nm = [...m, current];
          setTimeout(() => {
            if (newL <= 0) {
              endGame();
            } else {
              const nextIdx = currentIdx + 1;
              setCurrentIdx(nextIdx);
              setLetterState(null);
              if (nextIdx < deck.length) {
                setTimerPct(100);
                startTimeRef.current = Date.now();
                timerRef.current = setInterval(() => {
                  const elapsed = Date.now() - startTimeRef.current;
                  const pct = Math.max(0, 100 - (elapsed / timeoutMs) * 100);
                  setTimerPct(pct);
                  if (pct <= 0) {
                    clearInterval(timerRef.current);
                  }
                }, 50);
              } else {
                endGame();
              }
            }
          }, 600);
          return nm;
        });
        return newL;
      });
    }
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const current = deck[currentIdx];
  const livesStr = '❤️'.repeat(Math.max(0, lives));

  const timerColor = timerPct > 50 ? 'bg-primary' : timerPct > 25 ? 'bg-amber-500' : 'bg-red-600';

  if (screen === 'intro') {
    return (
      <div className="max-w-3xl mx-auto px-5 py-8">
        <h1 className="text-3xl font-serif font-normal mb-1">
          Class <em className="text-primary not-italic font-medium">Rush</em>
        </h1>
        <Separator className="mb-6" />
        <div className="max-w-[480px]">
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            A consonant flashes on screen. Tap its class — Low, Mid, or High — as fast as you can. Miss three and it's game over.
          </p>

          <div className="grid grid-cols-3 gap-2 mb-6">
            <Card className="text-center p-3 rounded-none shadow-none">
              <div className="text-[0.7rem] font-bold tracking-widest uppercase text-green-700 mb-2">Low (24)</div>
              <div className="text-lg leading-relaxed tracking-wide">{LOW_LETTERS}</div>
            </Card>
            <Card className="text-center p-3 rounded-none shadow-none">
              <div className="text-[0.7rem] font-bold tracking-widest uppercase text-blue-800 mb-2">Mid (9)</div>
              <div className="text-lg leading-relaxed tracking-wide">{MID_LETTERS}</div>
            </Card>
            <Card className="text-center p-3 rounded-none shadow-none">
              <div className="text-[0.7rem] font-bold tracking-widest uppercase text-red-900 mb-2">High (11)</div>
              <div className="text-lg leading-relaxed tracking-wide">{HIGH_LETTERS}</div>
            </Card>
          </div>

          <p className="text-xs text-muted-foreground italic mb-4">
            Tip: keep this legend in view until the classes feel natural.
          </p>

          <div className="mb-6">
            <span className="block text-[0.75rem] font-semibold tracking-widest uppercase text-muted-foreground mb-3">
              Difficulty
            </span>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(DIFF).map(([key, val]) => (
                <Button
                  key={key}
                  size="sm"
                  variant={difficulty === key ? 'default' : 'outline'}
                  onClick={() => setDifficulty(key)}
                >
                  {val.label} — {val.time / 1000} sec
                </Button>
              ))}
            </div>
          </div>

          <Button className="w-full" onClick={startGame}>Start →</Button>
        </div>
      </div>
    );
  }

  if (screen === 'results') {
    return (
      <div className="max-w-3xl mx-auto px-5 py-8">
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
    <div className="max-w-3xl mx-auto px-5 py-8">
      <h1 className="text-3xl font-serif font-normal mb-1">
        Class <em className="text-primary not-italic font-medium">Rush</em>
      </h1>
      <Separator className="mb-4" />
      <div className="max-w-[480px]">
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

        {/* Timer bar */}
        <div className="h-[5px] bg-border rounded-full overflow-hidden mb-5">
          <div
            className={cn('h-full rounded-full transition-[width,background-color] duration-100', timerColor)}
            style={{ width: `${timerPct}%` }}
          />
        </div>

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
