import { useState, useRef, useEffect } from 'react';
import { allVocab, topics } from '../data/vocab.js';
import { track } from '@/lib/analytics.js';
import { useAuth } from '../context/AuthContext.jsx';
import { recordAnswer, recordSession } from '../lib/progress.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ExitButton from '@/components/ExitButton';
import { useScrollTopOnChange } from '@/lib/useScrollTopOnChange.js';
import { cn } from '@/lib/utils';

// Only words whose example sentence contains the word verbatim can be "blanked".
const CLOZE_POOL = allVocab.filter(w => w.ex && w.thai && w.ex.includes(w.thai));

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Split an example sentence into [before, after] around the first occurrence of the target.
function blankParts(word) {
  const i = word.ex.indexOf(word.thai);
  return [word.ex.slice(0, i), word.ex.slice(i + word.thai.length)];
}

export default function ClozePage({ starred, showRomaji = true, showPage }) {
  const { user } = useAuth();
  const startTime = useRef(null);
  const inputRef = useRef();

  const [screen, setScreen] = useState('setup');
  useScrollTopOnChange(screen);
  const [cTopic, setCTopic] = useState('all');
  const [cCount, setCCount] = useState(10);

  const [questions, setQuestions] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [typeVal, setTypeVal] = useState('');
  const [typeState, setTypeState] = useState(null);
  const [streak, setStreak] = useState(0);
  const [streakToast, setStreakToast] = useState(null);

  const pool = CLOZE_POOL.filter(w => {
    if (cTopic === 'all') return true;
    if (cTopic === 'starred') return starred?.has(w.thai);
    return w.topic === cTopic;
  });

  const startGame = () => {
    if (pool.length < 1) return;
    const picked = shuffle(pool).slice(0, cCount > 0 ? cCount : pool.length);
    setQuestions(picked);
    setQIdx(0);
    setScore(0);
    setMissed([]);
    setAnswered(false);
    setTypeVal('');
    setTypeState(null);
    setStreak(0);
    setStreakToast(null);
    setScreen('play');
    startTime.current = Date.now();
    track('cloze_start', { topic: cTopic, count: picked.length });
  };

  const submit = () => {
    if (answered) return;
    const word = questions[qIdx];
    const val = typeVal.trim();
    const isCorrect =
      val === word.thai ||
      val.toLowerCase() === word.rom.toLowerCase() ||
      val.toLowerCase() === word.en.toLowerCase().split(',')[0].trim();
    recordAnswer(user?.id, word, isCorrect);
    setTypeState(isCorrect ? 'correct' : 'wrong');
    setAnswered(true);
    if (isCorrect) {
      setScore(s => s + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      const STREAK_MSGS = { 5: '5 in a row 🔥', 10: '10 in a row! 🔥🔥', 20: '20 in a row!! 🏆' };
      if (STREAK_MSGS[newStreak]) {
        setStreakToast(STREAK_MSGS[newStreak]);
        setTimeout(() => setStreakToast(null), 2000);
      }
    } else {
      setMissed(m => [...m, word]);
      setStreak(0);
    }
  };

  const next = () => {
    if (qIdx + 1 >= questions.length) {
      setScreen('results');
    } else {
      setQIdx(i => i + 1);
      setAnswered(false);
      setTypeVal('');
      setTypeState(null);
    }
  };

  const reveal = () => {
    if (answered) return;
    setMissed(m => [...m, questions[qIdx]]);
    setAnswered(true);
    setTypeState('wrong');
    setStreak(0);
  };

  const exitToSetup = () => setScreen('setup');

  const retryMissed = () => {
    if (missed.length === 0) return;
    setQuestions(shuffle(missed));
    setQIdx(0);
    setScore(0);
    setMissed([]);
    setAnswered(false);
    setTypeVal('');
    setTypeState(null);
    setStreak(0);
    setStreakToast(null);
    setScreen('play');
    startTime.current = Date.now();
  };

  useEffect(() => {
    if (screen === 'results' && questions.length > 0) {
      const secs = startTime.current ? Math.round((Date.now() - startTime.current) / 1000) : 0;
      recordSession(user?.id, 'cloze', questions.length, score, secs);
      track('cloze_complete', {
        score,
        total: questions.length,
        pct: Math.round((score / questions.length) * 100),
        topic: cTopic,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  useEffect(() => {
    if (screen === 'play' && !answered) inputRef.current?.focus();
  }, [screen, qIdx, answered]);

  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const msg = pct >= 90 ? 'Excellent! You know these words in context.' :
    pct >= 70 ? 'Good work! Review the ones you missed.' :
    pct >= 50 ? 'Getting there. Focus on the missed words.' :
    'Keep practicing — context makes words stick.';

  // ── Setup ────────────────────────────────────────────────────────
  if (screen === 'setup') {
    return (
      <Shell>
        <div className="max-w-[520px]">
          <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
            A word is removed from an example sentence — fill in the blank from context.
            Producing the word inside a real sentence builds stronger recall than isolated word lists.
          </p>
          <p className="text-xs text-muted-foreground mb-6">
            Want to browse the words first?{' '}
            <button className="underline underline-offset-2 hover:text-foreground transition-colors" onClick={() => showPage('cards')}>
              Open Flashcards
            </button>.
          </p>

          <Card className="mb-4">
            <CardContent className="pt-4">
              <span className="block text-[0.75rem] font-semibold tracking-widest uppercase text-muted-foreground mb-3">Topic</span>
              <div className="flex flex-wrap gap-1.5">
                <Button size="sm" variant={cTopic === 'all' ? 'default' : 'outline'} onClick={() => setCTopic('all')}>All</Button>
                <Button size="sm" variant={cTopic === 'starred' ? 'default' : 'outline'} onClick={() => setCTopic('starred')}>
                  ★ My List ({starred?.size ?? 0})
                </Button>
                {Object.entries(topics).map(([key, val]) => (
                  <Button key={key} size="sm" variant={cTopic === key ? 'default' : 'outline'} onClick={() => setCTopic(key)}>
                    {val.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardContent className="pt-4">
              <span className="block text-[0.75rem] font-semibold tracking-widest uppercase text-muted-foreground mb-3">Number of sentences</span>
              <div className="flex flex-wrap gap-1.5">
                {[10, 20, 30, 0].map(n => (
                  <Button key={n} size="sm" variant={cCount === n ? 'default' : 'outline'} onClick={() => setCCount(n)}>
                    {n === 0 ? 'All' : n}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button className="w-full" onClick={startGame} disabled={pool.length < 1}>
            {pool.length < 1 ? 'No sentences for this topic' : `Start — ${pool.length} available →`}
          </Button>
        </div>
      </Shell>
    );
  }

  // ── Results ──────────────────────────────────────────────────────
  if (screen === 'results') {
    return (
      <Shell>
        <div className="text-center max-w-[520px] mx-auto">
          <div className="font-serif text-6xl italic text-primary my-4 leading-none">{score}/{questions.length}</div>
          <div className="text-sm text-muted-foreground mb-4">{pct}% correct</div>
          <div className="text-base text-foreground mb-6 leading-relaxed">{msg}</div>

          {missed.length > 0 && (
            <div className="text-left mb-6">
              <div className="text-[0.75rem] font-semibold tracking-widest uppercase text-muted-foreground mb-3">
                Words to review ({missed.length})
              </div>
              {missed.map((w, i) => (
                <div key={i} className="flex items-baseline gap-3 py-2 border-b border-border text-sm">
                  <span className="font-thai-display text-base text-foreground min-w-[6rem]">{w.thai}</span>
                  <span className="text-muted-foreground">{showRomaji ? `${w.rom} — ${w.en}` : w.en}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2 justify-center flex-wrap">
            {missed.length > 0 && <Button className="flex-1" onClick={retryMissed}>Retry missed</Button>}
            <Button variant="outline" className="flex-1" onClick={() => setScreen('setup')}>New round</Button>
          </div>
        </div>
      </Shell>
    );
  }

  // ── Play ─────────────────────────────────────────────────────────
  const q = questions[qIdx];
  if (!q) return null;
  const [before, after] = blankParts(q);
  const progress = (qIdx / questions.length) * 100;

  return (
    <Shell>
      {streakToast && (
        <div className="fixed top-20 left-0 right-0 flex justify-center z-[300] pointer-events-none">
          <div className="animate-streak-toast px-5 py-2.5 rounded-2xl bg-foreground text-background font-semibold text-sm shadow-xl">
            {streakToast}
          </div>
        </div>
      )}

      <div className="max-w-[520px]">
        <div className="flex justify-end mb-2">
          <ExitButton onClick={exitToSetup} />
        </div>
        <Progress value={progress} className="h-1 mb-6 rounded-sm" />
        <div className="flex justify-between items-baseline mb-4 text-sm text-muted-foreground">
          <span>Sentence {qIdx + 1} of {questions.length}</span>
          <span className="font-semibold text-foreground">{score} correct</span>
        </div>

        <Card className="mb-4">
          <CardContent className="pt-6 pb-6">
            <div className="text-[0.72rem] tracking-widest uppercase text-muted-foreground mb-3 text-center">
              Fill in the missing word
            </div>
            <div className="font-thai-display text-xl text-foreground leading-relaxed text-center">
              {before}
              <span className={cn(
                'inline-block align-baseline mx-1 px-2 min-w-[3.5rem] border-b-2 text-center',
                answered
                  ? (typeState === 'correct' ? 'border-green-600 text-green-700' : 'border-red-600 text-red-700')
                  : 'border-primary text-primary'
              )}>
                {answered ? q.thai : '⋯'}
              </span>
              {after}
            </div>
            <div className="text-sm text-muted-foreground text-center mt-3">
              Hint: {q.en}{showRomaji && answered ? ` — ${q.rom}` : ''}
            </div>
          </CardContent>
        </Card>

        <Input
          ref={inputRef}
          className={cn(
            'rounded-none text-center text-2xl h-auto py-3 border-[1.5px] focus-visible:ring-0',
            typeState === 'correct' && 'border-green-600 bg-green-50 text-green-900',
            typeState === 'wrong' && 'border-red-600 bg-red-50 text-red-900'
          )}
          type="text"
          value={typeVal}
          onChange={e => setTypeVal(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { answered ? next() : submit(); } }}
          placeholder="พิมพ์คำที่หายไป…"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          disabled={answered}
        />
        <div className="text-xs text-muted-foreground text-center mt-1">
          Use your Thai keyboard, or romanized spelling is accepted
        </div>

        <div className="text-center text-sm min-h-[1.5rem] my-3">
          {answered && (typeState === 'correct'
            ? <span className="text-green-700 font-semibold">Correct!</span>
            : <span className="text-muted-foreground">Answer: <span className="font-thai-display text-foreground">{q.thai}</span>{showRomaji && ` (${q.rom})`}</span>
          )}
        </div>

        {!answered ? (
          <div>
            <Button className="w-full" onClick={submit}>Check →</Button>
            <button
              className="w-full text-sm text-muted-foreground bg-transparent border-none cursor-pointer py-2 underline mt-1"
              onClick={reveal}
            >
              Reveal answer
            </button>
          </div>
        ) : (
          <Button className="w-full" onClick={next}>
            {qIdx + 1 >= questions.length ? 'See results →' : 'Next →'}
          </Button>
        )}
      </div>
    </Shell>
  );
}

function Shell({ children }) {
  return (
    <div className="max-w-[1200px] mx-auto px-5 py-8">
      <h1 className="text-3xl font-serif font-normal mb-1">
        Fill the <em className="text-primary not-italic font-medium">Blank</em>
      </h1>
      <Separator className="mb-6" />
      {children}
    </div>
  );
}
