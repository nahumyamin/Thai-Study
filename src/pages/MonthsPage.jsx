import { useState, useCallback } from 'react';
import { MONTHS, MONTH_TIPS } from '../data/months.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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

function buildQuestions() {
  return shuffle(MONTHS).map(month => {
    const distractors = shuffle(MONTHS.filter(m => m.thai !== month.thai)).slice(0, 3);
    const choices = shuffle([month, ...distractors]);
    return { month, choices };
  });
}

// ── Mobile month card ─────────────────────────────────────────────
function MonthCard({ month }) {
  return (
    <Card className="rounded-lg">
      <CardContent className="p-3">
        <div className="text-muted-foreground text-xs mb-1">{month.number}</div>
        <div className="text-2xl font-medium leading-tight">{month.thai}</div>
        <div className="text-xs italic text-muted-foreground mt-0.5">{month.rom}</div>
        <div className="font-medium mt-2">{month.en}</div>
        <div className="text-xs text-muted-foreground">{month.abbr}</div>
      </CardContent>
    </Card>
  );
}

// ── Desktop reference table ───────────────────────────────────────
function MonthTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-base border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2 px-3 text-muted-foreground font-medium text-sm w-8">#</th>
            <th className="text-left py-2 px-3 text-muted-foreground font-medium text-sm">Thai</th>
            <th className="text-left py-2 px-3 text-muted-foreground font-medium text-sm">Abbr.</th>
            <th className="text-left py-2 px-3 text-muted-foreground font-medium text-sm">Romanization</th>
            <th className="text-left py-2 px-3 text-muted-foreground font-medium text-sm">English</th>
          </tr>
        </thead>
        <tbody>
          {MONTHS.map((m, i) => (
            <tr key={m.thai} className={cn('border-b border-border', i % 2 === 0 ? 'bg-muted/30' : '')}>
              <td className="py-3 px-3 text-muted-foreground text-sm">{m.number}</td>
              <td className="py-3 px-3 text-xl font-medium">{m.thai}</td>
              <td className="py-3 px-3 text-muted-foreground">{m.abbr}</td>
              <td className="py-3 px-3 text-muted-foreground italic">{m.rom}</td>
              <td className="py-3 px-3 font-medium">{m.en}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Quiz ─────────────────────────────────────────────────────────
function MonthQuiz() {
  const [mode, setMode] = useState('en-to-thai');
  const [questions, setQuestions] = useState(null);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const start = useCallback((m) => {
    setMode(m);
    setQuestions(buildQuestions());
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  }, []);

  const handleChoice = (choice) => {
    if (selected) return;
    setSelected(choice);
    if (choice.thai === questions[current].month.thai) {
      setScore(s => s + 1);
    }
  };

  const next = () => {
    if (current + 1 >= questions.length) {
      setDone(true);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
    }
  };

  if (!questions) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Month Quiz</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">Choose a quiz mode to test your knowledge of Thai months.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="flex-1 h-auto py-4 flex flex-col gap-1" onClick={() => start('en-to-thai')}>
              <span className="font-semibold">English → Thai</span>
              <span className="text-xs opacity-70 font-normal">See the English month, pick the Thai</span>
            </Button>
            <Button variant="outline" className="flex-1 h-auto py-4 flex flex-col gap-1" onClick={() => start('thai-to-en')}>
              <span className="font-semibold">Thai → English</span>
              <span className="text-xs opacity-70 font-normal">See the Thai month, pick the English</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <Card>
        <CardContent className="py-10 text-center space-y-4">
          <div className="text-6xl font-bold">{pct}%</div>
          <p className="text-muted-foreground">{score} / {questions.length} correct</p>
          <p className="text-lg font-medium">
            {pct === 100 ? '🎉 Perfect score!' : pct >= 75 ? 'Great work!' : pct >= 50 ? 'Keep practicing!' : "Keep going, you'll get there!"}
          </p>
          <div className="flex gap-3 justify-center pt-2">
            <Button onClick={() => start(mode)}>Try Again</Button>
            <Button variant="outline" onClick={() => setQuestions(null)}>Change Mode</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const q = questions[current];
  const progress = (current / questions.length) * 100;

  return (
    <Card>
      <CardContent className="pt-6 space-y-5">
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{current + 1} / {questions.length}</span>
            <span>{score} correct</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>

        <div className="text-center py-6">
          <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wider">
            {mode === 'en-to-thai' ? 'Which Thai month is…' : 'Which English month is…'}
          </p>
          <div className="text-4xl font-medium">
            {mode === 'en-to-thai' ? q.month.en : q.month.thai}
          </div>
          {mode === 'thai-to-en' && (
            <div className="text-muted-foreground italic mt-1">{q.month.rom}</div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {q.choices.map((choice) => {
            const isCorrect = choice.thai === q.month.thai;
            const isSelected = selected?.thai === choice.thai;
            let extra = '';
            if (selected) {
              if (isCorrect) extra = 'border-green-500 bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200';
              else if (isSelected) extra = 'border-red-400 bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200';
              else extra = 'opacity-40';
            }
            return (
              <button
                key={choice.thai}
                onClick={() => handleChoice(choice)}
                disabled={!!selected}
                className={cn(
                  'border rounded-md py-3 px-3 text-center transition-all cursor-pointer disabled:cursor-default',
                  'flex flex-col items-center gap-0.5',
                  extra || 'hover:bg-muted border-border'
                )}
              >
                <span className="text-xl font-medium leading-tight">
                  {mode === 'en-to-thai' ? choice.thai : choice.en}
                </span>
                <span className="text-xs text-muted-foreground italic">
                  {mode === 'en-to-thai' ? choice.rom : choice.abbr}
                </span>
              </button>
            );
          })}
        </div>

        {selected && (
          <Button className="w-full" onClick={next}>
            {current + 1 >= questions.length ? 'See Results' : 'Next →'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// ── Page ─────────────────────────────────────────────────────────
export default function MonthsPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-5 py-8">
      <h1 className="text-4xl font-serif font-normal mb-1">Thai <em className="not-italic font-medium text-primary">Months</em></h1>
      <p className="text-muted-foreground mb-8">เดือน (duean) — the twelve months of the year</p>

      {/* Quiz — always at top */}
      <div className="mb-8">
        <MonthQuiz />
      </div>

      {/* Reference — table on desktop, cards on mobile */}
      <div className="space-y-6">
        {/* Desktop table */}
        <Card className="hidden md:block">
          <CardHeader>
            <CardTitle className="text-xl">All 12 Months</CardTitle>
          </CardHeader>
          <CardContent className="p-0 pb-2">
            <MonthTable />
          </CardContent>
        </Card>

        {/* Mobile cards — 2 columns */}
        <div className="md:hidden">
          <h2 className="text-lg font-semibold mb-3">All 12 Months</h2>
          <div className="grid grid-cols-2 gap-3">
            {MONTHS.map(m => <MonthCard key={m.thai} month={m} />)}
          </div>
        </div>

        {/* Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Patterns & Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {MONTH_TIPS.map((tip, i) => (
              <div key={i}>
                {i > 0 && <Separator className="mb-4" />}
                <p className="font-semibold text-base mb-1">{tip.title}</p>
                <p className="text-muted-foreground">{tip.body}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
