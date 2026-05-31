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
import { cn } from '@/lib/utils';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getWrongChoices(correct, pool, count = 3) {
  const others = pool.filter(w => w.thai !== correct.thai);
  return shuffle(others).slice(0, count);
}

export default function QuizPage({ starred, showRomaji = true, showPage }) {
  const { user } = useAuth();
  const quizStartTime = useRef(null);
  const [screen, setScreen] = useState('setup');
  const [qTopic, setQTopic] = useState('all');
  const [qCount, setQCount] = useState(10);
  const [qMode, setQMode] = useState('mc');

  const [questions, setQuestions] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [typeVal, setTypeVal] = useState('');
  const [typeState, setTypeState] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [streak, setStreak] = useState(0);
  const [streakToast, setStreakToast] = useState(null);

  const inputRef = useRef();

  const pool = allVocab.filter(w => {
    if (qTopic === 'all') return true;
    if (qTopic === 'starred') return starred.has(w.thai);
    return w.topic === qTopic;
  });

  const buildQuestions = (p) => {
    const picked = shuffle(p).slice(0, qCount > 0 ? qCount : p.length);
    return picked.map(word => {
      const wrongs = getWrongChoices(word, p, 3);
      const choices = shuffle([word, ...wrongs]);
      return { word, choices };
    });
  };

  const startQuiz = () => {
    if (pool.length < 4) return;
    const qs = buildQuestions(pool);
    setQuestions(qs);
    setQIdx(0);
    setScore(0);
    setMissed([]);
    setAnswered(false);
    setSelectedChoice(null);
    setTypeVal('');
    setTypeState(null);
    setFeedback('');
    setStreak(0);
    setStreakToast(null);
    setScreen('quiz');
    quizStartTime.current = Date.now();
    track('quiz_start', { topic: qTopic, count: qs.length, mode: qMode });
  };

  const handleMcAnswer = (choice) => {
    if (answered) return;
    const correct = questions[qIdx].word;
    const isCorrect = choice.thai === correct.thai;
    recordAnswer(user?.id, correct, isCorrect);
    setSelectedChoice(choice.thai);
    setAnswered(true);
    if (isCorrect) {
      setScore(s => s + 1);
      setFeedback('Correct!');
      const newStreak = streak + 1;
      setStreak(newStreak);
      const STREAK_MSGS = { 5: '5 in a row 🔥', 10: '10 in a row! 🔥🔥', 20: '20 in a row!! 🏆' };
      if (STREAK_MSGS[newStreak]) {
        setStreakToast(STREAK_MSGS[newStreak]);
        setTimeout(() => setStreakToast(null), 2000);
      }
    } else {
      setMissed(m => [...m, correct]);
      setFeedback('');
      setStreak(0);
    }
  };

  const submitType = () => {
    if (answered) return;
    const correct = questions[qIdx].word;
    const val = typeVal.trim();
    const isCorrect = val === correct.thai ||
      val.toLowerCase() === correct.rom.toLowerCase() ||
      val.toLowerCase() === correct.en.toLowerCase().split(',')[0].trim();
    recordAnswer(user?.id, correct, isCorrect);
    setTypeState(isCorrect ? 'correct' : 'wrong');
    setAnswered(true);
    if (isCorrect) {
      setScore(s => s + 1);
      setFeedback('Correct!');
      const newStreak = streak + 1;
      setStreak(newStreak);
      const STREAK_MSGS = { 5: '5 in a row 🔥', 10: '10 in a row! 🔥🔥', 20: '20 in a row!! 🏆' };
      if (STREAK_MSGS[newStreak]) {
        setStreakToast(STREAK_MSGS[newStreak]);
        setTimeout(() => setStreakToast(null), 2000);
      }
    } else {
      setMissed(m => [...m, correct]);
      setFeedback(`Answer: ${correct.thai}${showRomaji ? ` (${correct.rom})` : ''} — ${correct.en}`);
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    if (qIdx + 1 >= questions.length) {
      setScreen('results');
    } else {
      setQIdx(i => i + 1);
      setAnswered(false);
      setSelectedChoice(null);
      setTypeVal('');
      setTypeState(null);
      setFeedback('');
    }
  };

  const skipQuestion = () => {
    if (answered) return;
    setMissed(m => [...m, questions[qIdx].word]);
    setAnswered(true);
    const w = questions[qIdx].word;
    setFeedback(`Answer: ${w.thai}${showRomaji ? ` (${w.rom})` : ''} — ${w.en}`);
    setStreak(0);
  };

  const exitToSetup = () => {
    window.speechSynthesis?.cancel();
    setScreen('setup');
  };

  const retryMissed = () => {
    if (missed.length === 0) return;
    const qs = missed.map(word => {
      const wrongs = getWrongChoices(word, pool.length >= 4 ? pool : allVocab, 3);
      return { word, choices: shuffle([word, ...wrongs]) };
    });
    setQuestions(qs);
    setQIdx(0);
    setScore(0);
    setMissed([]);
    setAnswered(false);
    setSelectedChoice(null);
    setTypeVal('');
    setTypeState(null);
    setFeedback('');
    setStreak(0);
    setStreakToast(null);
    setScreen('quiz');
  };

  // Fire quiz_complete once when results screen appears
  useEffect(() => {
    if (screen === 'results' && questions.length > 0) {
      track('quiz_complete', {
        score,
        total: questions.length,
        pct: Math.round((score / questions.length) * 100),
        topic: qTopic,
        mode: qMode,
      });
      const secs = quizStartTime.current ? Math.round((Date.now() - quizStartTime.current) / 1000) : 0;
      recordSession(user?.id, 'quiz', questions.length, score, secs);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  // ── Listen mode helpers ───────────────────────────────────────────
  const speakWord = () => {
    if (!('speechSynthesis' in window) || !questions[qIdx]) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(questions[qIdx].word.thai);
    utt.lang = 'th-TH';
    utt.rate = 0.85;
    window.speechSynthesis.speak(utt);
  };

  // Auto-play when question loads in listen mode
  useEffect(() => {
    if (qMode !== 'listen' || screen !== 'quiz' || !questions[qIdx]) return;
    const t = setTimeout(() => speakWord(), 120);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qIdx, qMode, screen]);

  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const msg = pct >= 90 ? 'Excellent! You really know this material.' :
    pct >= 70 ? 'Good work! Review the missed words to improve further.' :
    pct >= 50 ? 'Getting there. Focus on the words you missed.' :
    'Keep practicing — repetition is key.';

  if (screen === 'setup') {
    return (
      <div className="max-w-[1200px] mx-auto px-5 py-8">
        <h1 className="text-3xl font-serif font-normal mb-1">
          Thai <em className="text-primary not-italic font-medium">Quiz</em>
        </h1>
        <Separator className="mb-4" />
        <div className="max-w-[520px]">
          <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
            Test yourself on vocabulary. Choose a topic, how many questions, and your preferred mode — then hit Start.
          </p>
          <p className="text-xs text-muted-foreground mb-6">
            Want to browse the words first?{' '}
            <button
              className="underline underline-offset-2 hover:text-foreground transition-colors"
              onClick={() => showPage('cards')}
            >
              Open Flashcards
            </button>
            .
          </p>

          <Card className="mb-4">
            <CardContent className="pt-4">
              <span className="block text-[0.75rem] font-semibold tracking-widest uppercase text-muted-foreground mb-3">Topic</span>
              <div className="flex flex-wrap gap-1.5">
                <Button size="sm" variant={qTopic === 'all' ? 'default' : 'outline'} onClick={() => setQTopic('all')}>All</Button>
                <Button size="sm" variant={qTopic === 'starred' ? 'default' : 'outline'} onClick={() => setQTopic('starred')}>
                  ★ My List ({starred.size})
                </Button>
                {Object.entries(topics).map(([key, val]) => (
                  <Button key={key} size="sm" variant={qTopic === key ? 'default' : 'outline'} onClick={() => setQTopic(key)}>
                    {val.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardContent className="pt-4">
              <span className="block text-[0.75rem] font-semibold tracking-widest uppercase text-muted-foreground mb-3">Number of questions</span>
              <div className="flex flex-wrap gap-1.5">
                {[10, 20, 30, 0].map(n => (
                  <Button key={n} size="sm" variant={qCount === n ? 'default' : 'outline'} onClick={() => setQCount(n)}>
                    {n === 0 ? 'All' : n}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardContent className="pt-4">
              <span className="block text-[0.75rem] font-semibold tracking-widest uppercase text-muted-foreground mb-3">Mode</span>
              <div className="flex flex-wrap gap-1.5">
                <Button size="sm" variant={qMode === 'mc'     ? 'default' : 'outline'} onClick={() => setQMode('mc')}>Multiple choice</Button>
                <Button size="sm" variant={qMode === 'type'   ? 'default' : 'outline'} onClick={() => setQMode('type')}>Type the Thai</Button>
                <Button size="sm" variant={qMode === 'listen' ? 'default' : 'outline'} onClick={() => setQMode('listen')}>Listen &amp; choose</Button>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full" onClick={startQuiz} disabled={pool.length < 4}>
            {pool.length < 4 ? 'Not enough words' : 'Start Quiz →'}
          </Button>
        </div>
      </div>
    );
  }

  if (screen === 'results') {
    return (
      <div className="max-w-[1200px] mx-auto px-5 py-8">
        <h1 className="text-3xl font-serif font-normal mb-1">
          Thai <em className="text-primary not-italic font-medium">Quiz</em>
        </h1>
        <Separator className="mb-4" />
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
                  <span className="text-base text-foreground min-w-[6rem]">{w.thai}</span>
                  <span className="text-muted-foreground">{w.rom} — {w.en}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2 justify-center flex-wrap">
            {missed.length > 0 && (
              <Button className="flex-1" onClick={retryMissed}>Retry missed</Button>
            )}
            <Button variant="outline" className="flex-1" onClick={() => setScreen('setup')}>New quiz</Button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz screen
  const q = questions[qIdx];
  if (!q) return null;
  const progress = (qIdx / questions.length) * 100;

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-8">
      {/* Streak milestone toast */}
      {streakToast && (
        <div className="fixed top-20 left-0 right-0 flex justify-center z-[300] pointer-events-none">
          <div className="animate-streak-toast px-5 py-2.5 rounded-2xl bg-foreground text-background font-semibold text-sm shadow-xl">
            {streakToast}
          </div>
        </div>
      )}
      <h1 className="text-3xl font-serif font-normal mb-1">
        Thai <em className="text-primary not-italic font-medium">Quiz</em>
      </h1>
      <Separator className="mb-6" />

      <div className="max-w-[520px]">
        <div className="flex justify-end mb-2">
          <ExitButton onClick={exitToSetup} />
        </div>
        <Progress value={progress} className="h-1 mb-6 rounded-sm" />
        <div className="flex justify-between items-baseline mb-4 text-sm text-muted-foreground">
          <span>Question {qIdx + 1} of {questions.length}</span>
          <span className="font-semibold text-foreground">{score} correct</span>
        </div>

        <Card className="mb-4">
          <CardContent className="pt-6 pb-6 text-center">
            {qMode === 'listen' ? (
              <>
                <div className="text-[0.72rem] tracking-widest uppercase text-muted-foreground mb-4">
                  Listen and choose the meaning
                </div>
                <button
                  onClick={speakWord}
                  className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                  aria-label="Replay word"
                >
                  <svg width="28" height="28" viewBox="0 0 14 14" fill="none">
                    <path d="M2 5H4.5L8 2V12L4.5 9H2V5Z" fill="currentColor" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                    <path d="M10 4.5C10.8 5.3 11.3 6.1 11.3 7C11.3 7.9 10.8 8.7 10 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                </button>
                {/* Thai word hidden until answered */}
                <div className={cn(
                  'font-thai-display text-3xl mt-4 transition-all duration-300',
                  answered ? 'opacity-100' : 'opacity-0 select-none pointer-events-none'
                )}>
                  {q.word.thai}
                </div>
              </>
            ) : (
              <>
                <div className="text-[0.72rem] tracking-widest uppercase text-muted-foreground mb-2">What is the Thai word for…</div>
                <div className="font-serif text-2xl font-normal text-foreground leading-snug">{q.word.en}</div>
                {showRomaji && q.word.rom && <div className="text-sm italic text-muted-foreground mt-1">{q.word.rom}</div>}
              </>
            )}
          </CardContent>
        </Card>

        {(qMode === 'mc' || qMode === 'listen') ? (
          <div>
            <div className={cn('grid gap-2 mb-3', qMode === 'listen' ? 'grid-cols-1' : 'grid-cols-2')}>
              {q.choices.map((choice, i) => {
                let variantClass = '';
                const isCorrectChoice = choice.thai === q.word.thai;
                const isWrongSelected = answered && choice.thai === selectedChoice && !isCorrectChoice;
                if (answered) {
                  if (isCorrectChoice) variantClass = 'bg-green-100 border-green-600 text-green-900 hover:bg-green-100';
                  else if (isWrongSelected) variantClass = 'bg-red-100 border-red-600 text-red-900 hover:bg-red-100';
                  else variantClass = 'bg-green-100/40 border-green-400 text-green-800 opacity-70 hover:bg-green-100/40';
                }
                return (
                  <div
                    key={i}
                    className={cn(
                      'quiz-choice',
                      answered && isCorrectChoice && 'quiz-choice--correct',
                      isWrongSelected && 'quiz-choice--wrong',
                    )}
                  >
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full rounded-none h-auto py-3 text-base text-foreground',
                        qMode !== 'listen' && 'font-thai-display',
                        variantClass
                      )}
                      onClick={() => handleMcAnswer(choice)}
                      disabled={answered}
                    >
                      {qMode === 'listen' ? choice.en : choice.thai}
                    </Button>
                  </div>
                );
              })}
            </div>
            <div className="text-center text-sm text-muted-foreground min-h-[1.5rem] mb-3">{feedback}</div>
            {answered && (
              <Button className="w-full" onClick={nextQuestion}>
                {qIdx + 1 >= questions.length ? 'See results →' : 'Next →'}
              </Button>
            )}
            {!answered && (
              <button
                className="w-full text-sm text-muted-foreground bg-transparent border-none cursor-pointer py-2 underline mt-1"
                onClick={skipQuestion}
              >
                Skip this one
              </button>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-3">
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
                onKeyDown={e => { if (e.key === 'Enter' && !answered) submitType(); }}
                placeholder="พิมพ์ภาษาไทยที่นี่…"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                disabled={answered}
              />
              <div className="text-xs text-muted-foreground text-center mt-1">Tip: use your Thai keyboard, or romanized spelling is accepted</div>
            </div>
            {!answered && (
              <Button className="w-full mt-2" onClick={submitType}>Check →</Button>
            )}
            <div className="text-center text-sm text-muted-foreground min-h-[1.5rem] my-3">
              {feedback && (
                typeState === 'correct'
                  ? <span>Correct!</span>
                  : <span className="text-green-700 font-semibold">{feedback}</span>
              )}
            </div>
            {answered && (
              <Button className="w-full" onClick={nextQuestion}>
                {qIdx + 1 >= questions.length ? 'See results →' : 'Next →'}
              </Button>
            )}
            {!answered && (
              <button
                className="w-full text-sm text-muted-foreground bg-transparent border-none cursor-pointer py-2 underline mt-1"
                onClick={skipQuestion}
              >
                Skip this one
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
