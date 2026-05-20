import { useState, useRef } from 'react';
import { allVocab, topics } from '../data/vocab.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

function getWrongChoices(correct, pool, count = 3) {
  const others = pool.filter(w => w.thai !== correct.thai);
  return shuffle(others).slice(0, count);
}

export default function QuizPage({ starred }) {
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
    setScreen('quiz');
  };

  const handleMcAnswer = (choice) => {
    if (answered) return;
    const correct = questions[qIdx].word;
    const isCorrect = choice.thai === correct.thai;
    setSelectedChoice(choice.thai);
    setAnswered(true);
    if (isCorrect) {
      setScore(s => s + 1);
      setFeedback('Correct!');
    } else {
      setMissed(m => [...m, correct]);
      setFeedback('');
    }
  };

  const submitType = () => {
    if (answered) return;
    const correct = questions[qIdx].word;
    const val = typeVal.trim();
    const isCorrect = val === correct.thai ||
      val.toLowerCase() === correct.rom.toLowerCase() ||
      val.toLowerCase() === correct.en.toLowerCase().split(',')[0].trim();
    setTypeState(isCorrect ? 'correct' : 'wrong');
    setAnswered(true);
    if (isCorrect) {
      setScore(s => s + 1);
      setFeedback('Correct!');
    } else {
      setMissed(m => [...m, correct]);
      setFeedback(`Answer: ${correct.thai} (${correct.rom}) — ${correct.en}`);
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
    setFeedback(`Answer: ${questions[qIdx].word.thai} (${questions[qIdx].word.rom}) — ${questions[qIdx].word.en}`);
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
    setScreen('quiz');
  };

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
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Test yourself on vocabulary. Choose a topic, how many questions, and your preferred mode — then hit Start.
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
                <Button size="sm" variant={qMode === 'mc' ? 'default' : 'outline'} onClick={() => setQMode('mc')}>Multiple choice</Button>
                <Button size="sm" variant={qMode === 'type' ? 'default' : 'outline'} onClick={() => setQMode('type')}>Type the Thai</Button>
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
      <h1 className="text-3xl font-serif font-normal mb-1">
        Thai <em className="text-primary not-italic font-medium">Quiz</em>
      </h1>
      <Separator className="mb-6" />

      <div className="max-w-[520px]">
        <Progress value={progress} className="h-1 mb-6 rounded-sm" />
        <div className="flex justify-between items-baseline mb-4 text-sm text-muted-foreground">
          <span>Question {qIdx + 1} of {questions.length}</span>
          <span className="font-semibold text-foreground">{score} correct</span>
        </div>

        <Card className="mb-4">
          <CardContent className="pt-6 pb-6 text-center">
            <div className="text-[0.72rem] tracking-widest uppercase text-muted-foreground mb-2">What is the Thai word for…</div>
            <div className="font-serif text-2xl font-normal text-foreground leading-snug">{q.word.en}</div>
            {q.word.rom && <div className="text-sm italic text-muted-foreground mt-1">{q.word.rom}</div>}
          </CardContent>
        </Card>

        {qMode === 'mc' ? (
          <div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {q.choices.map((choice, i) => {
                let variantClass = '';
                if (answered) {
                  if (choice.thai === q.word.thai) variantClass = 'bg-green-100 border-green-600 text-green-900 hover:bg-green-100';
                  else if (choice.thai === selectedChoice) variantClass = 'bg-red-100 border-red-600 text-red-900 hover:bg-red-100';
                  else variantClass = 'bg-green-100/40 border-green-400 text-green-800 opacity-70 hover:bg-green-100/40';
                }
                return (
                  <Button
                    key={i}
                    variant="outline"
                    className={cn('rounded-none h-auto py-3 text-base text-foreground', variantClass)}
                    onClick={() => handleMcAnswer(choice)}
                    disabled={answered}
                  >
                    {choice.thai}
                  </Button>
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
