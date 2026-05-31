import { useState, useRef } from 'react';
import { allVocab, topics } from '../data/vocab.js';
import { track } from '@/lib/analytics.js';
import { useAuth } from '../context/AuthContext.jsx';
import { supabase } from '../lib/supabase.js';
import { recordAnswer, recordSession } from '../lib/progress.js';
import { REVIEW_INTERVALS } from '../lib/gamification.js';
import ExitButton from '@/components/ExitButton';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const vocabById = new Map(allVocab.map(w => [w.id, w]));
const vocabByThai = new Map(allVocab.map(w => [w.thai, w]));

function speakThai(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = 'th-TH';
  utt.rate = 0.85;
  window.speechSynthesis.speak(utt);
}

function SpeakerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 14 14" fill="none">
      <path d="M2 5H4.5L8 2V12L4.5 9H2V5Z" fill="currentColor" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M10 4.5C10.8 5.3 11.3 6.1 11.3 7C11.3 7.9 10.8 8.7 10 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export default function ReviewPage({ showRomaji = true, showPage }) {
  const { user } = useAuth();
  const startTime = useRef(null);

  // 'intro' | 'loading' | 'empty' | 'review' | 'done'
  const [screen, setScreen] = useState('intro');
  const [queue, setQueue] = useState([]);     // full vocab entries, most-overdue first
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [recalled, setRecalled] = useState(0);

  // Load due words from saved progress (triggered from the intro screen)
  const loadDue = () => {
    if (!user || !supabase) { setScreen('empty'); return; }
    setScreen('loading');
    supabase
      .from('vocab_progress')
      .select('word_id, thai_word, mastery_level, last_seen_at')
      .eq('user_id', user.id)
      .then(({ data }) => {
        const now = Date.now();
        const due = (data ?? [])
          .map(row => {
            const word = vocabById.get(row.word_id) ?? vocabByThai.get(row.thai_word);
            if (!word) return null;
            const intervalMs = (REVIEW_INTERVALS[row.mastery_level] ?? 0) * 3_600_000;
            const overdueBy = now - new Date(row.last_seen_at).getTime() - intervalMs;
            return overdueBy >= 0 ? { word, overdueBy } : null;
          })
          .filter(Boolean)
          .sort((a, b) => b.overdueBy - a.overdueBy)
          .map(d => d.word);

        if (due.length === 0) { setScreen('empty'); return; }
        setQueue(due);
        setIdx(0);
        setRevealed(false);
        setRecalled(0);
        setScreen('review');
        startTime.current = Date.now();
        track('review_start', { due: due.length });
      });
  };

  const exitToIntro = () => {
    window.speechSynthesis?.cancel();
    setScreen('intro');
  };

  const current = queue[idx];

  const reveal = () => {
    setRevealed(true);
    if (current) speakThai(current.word.thai ?? current.thai);
  };

  const grade = (gotIt) => {
    const word = queue[idx];
    recordAnswer(user?.id, word, gotIt);
    if (gotIt) setRecalled(r => r + 1);
    if (idx + 1 >= queue.length) {
      const correct = recalled + (gotIt ? 1 : 0);
      const secs = startTime.current ? Math.round((Date.now() - startTime.current) / 1000) : 0;
      recordSession(user?.id, 'review', queue.length, correct, secs);
      track('review_complete', { total: queue.length, recalled: correct });
      setScreen('done');
    } else {
      setIdx(i => i + 1);
      setRevealed(false);
    }
  };

  // ── Instructions ─────────────────────────────────────────────────
  if (screen === 'intro') {
    return (
      <Shell>
        <div className="max-w-[520px]">
          <p className="text-sm text-muted-foreground leading-relaxed mb-2">
            Spaced review brings back words you've already studied right as you're about to forget them.
            You'll see the English, try to recall the Thai from memory, then reveal the answer and rate
            yourself — words you recall are pushed further out, words you forget come back sooner.
          </p>
          <p className="text-xs text-muted-foreground mb-6">
            Only words that are <em>due</em> today appear here. Keep studying with{' '}
            <button className="underline underline-offset-2 hover:text-foreground transition-colors" onClick={() => showPage('quiz')}>Quiz</button>
            {' '}or{' '}
            <button className="underline underline-offset-2 hover:text-foreground transition-colors" onClick={() => showPage('cards')}>Flashcards</button>
            {' '}to add more to the rotation.
          </p>
          {user ? (
            <Button onClick={loadDue}>Start review →</Button>
          ) : (
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Spaced review needs an account so your schedule can be saved between sessions.
              </p>
              <Button onClick={() => showPage('login')}>Sign in to start reviewing →</Button>
            </div>
          )}
        </div>
      </Shell>
    );
  }

  // ── Not signed in ────────────────────────────────────────────────
  if (screen === 'empty' && !user) {
    return (
      <Shell>
        <div className="max-w-[520px] text-center mx-auto py-10">
          <p className="text-sm text-muted-foreground mb-4">
            Spaced review needs an account so your schedule can be saved between sessions.
          </p>
          <Button onClick={() => showPage('login')}>Sign in to start reviewing →</Button>
        </div>
      </Shell>
    );
  }

  if (screen === 'loading') {
    return (
      <Shell>
        <div className="max-w-[520px] text-center mx-auto py-16 text-sm text-muted-foreground">
          Finding words due for review…
        </div>
      </Shell>
    );
  }

  if (screen === 'empty') {
    return (
      <Shell>
        <div className="max-w-[520px] text-center mx-auto py-10">
          <div className="font-serif text-5xl italic text-emerald-500 mb-3">✓</div>
          <h2 className="text-lg font-medium text-foreground mb-2">All caught up!</h2>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            No words are due for review right now. Words come back on a spaced schedule —
            keep studying with Quiz or Flashcards to add more to your rotation.
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            <Button onClick={() => showPage('quiz')}>Take a quiz</Button>
            <Button variant="outline" onClick={() => showPage('cards')}>Flashcards</Button>
          </div>
        </div>
      </Shell>
    );
  }

  if (screen === 'done') {
    const pct = queue.length > 0 ? Math.round((recalled / queue.length) * 100) : 0;
    return (
      <Shell>
        <div className="max-w-[520px] text-center mx-auto">
          <div className="font-serif text-6xl italic text-primary my-4 leading-none">{recalled}/{queue.length}</div>
          <div className="text-sm text-muted-foreground mb-4">{pct}% recalled from memory</div>
          <p className="text-base text-foreground mb-6 leading-relaxed">
            Reviewed words have been rescheduled — the ones you recalled won't come back for a while,
            and the ones you forgot will return sooner.
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            <Button onClick={() => showPage('dashboard')}>Back to dashboard</Button>
            <Button variant="outline" onClick={() => showPage('quiz')}>Take a quiz</Button>
          </div>
        </div>
      </Shell>
    );
  }

  // ── Review screen ────────────────────────────────────────────────
  if (!current) return null;
  const w = current;
  const topicLabel = topics[w.topic]?.label;
  const progress = (idx / queue.length) * 100;

  return (
    <Shell>
      <div className="max-w-[520px]">
        <div className="flex justify-end mb-2">
          <ExitButton onClick={exitToIntro} />
        </div>
        <Progress value={progress} className="h-1 mb-6 rounded-sm" />
        <div className="flex justify-between items-baseline mb-4 text-sm text-muted-foreground">
          <span>Card {idx + 1} of {queue.length}</span>
          <span className="font-semibold text-foreground">{recalled} recalled</span>
        </div>

        <Card className="mb-4">
          <CardContent className="pt-6 pb-7 text-center">
            <div className="text-[0.72rem] tracking-widest uppercase text-muted-foreground mb-3">
              Recall the Thai for…
            </div>
            <div className="font-serif text-2xl font-normal text-foreground leading-snug">{w.en}</div>
            {topicLabel && (
              <div className="mt-2 inline-block text-[0.65rem] tracking-wide uppercase text-muted-foreground border border-border rounded-full px-2 py-0.5 font-thai-display">
                {topicLabel}
              </div>
            )}

            {/* Answer — hidden until revealed */}
            <div className={cn('transition-all duration-300 mt-5', revealed ? 'opacity-100' : 'opacity-0 select-none pointer-events-none h-0 mt-0 overflow-hidden')}>
              <Separator className="mb-4" />
              <div className="flex items-center justify-center gap-2">
                <span className="font-thai-display text-3xl text-foreground">{w.thai}</span>
                <button
                  onClick={() => speakThai(w.thai)}
                  className="text-primary/70 hover:text-primary transition-colors"
                  aria-label="Play pronunciation"
                >
                  <SpeakerIcon />
                </button>
              </div>
              {showRomaji && w.rom && <div className="text-sm italic text-muted-foreground mt-1">{w.rom}</div>}
              {w.ex && <div className="font-thai-display text-base text-muted-foreground mt-3 leading-relaxed">{w.ex}</div>}
            </div>
          </CardContent>
        </Card>

        {!revealed ? (
          <Button className="w-full" onClick={reveal}>Show answer</Button>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="border-red-500/40 text-red-700 hover:bg-red-50 hover:text-red-800 dark:text-red-400"
              onClick={() => grade(false)}
            >
              Forgot
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-500 text-white"
              onClick={() => grade(true)}
            >
              Got it
            </Button>
          </div>
        )}
      </div>
    </Shell>
  );
}

function Shell({ children }) {
  return (
    <div className="max-w-[1200px] mx-auto px-5 py-8">
      <h1 className="text-3xl font-serif font-normal mb-1">
        Spaced <em className="text-primary not-italic font-medium">Review</em>
      </h1>
      <Separator className="mb-6" />
      {children}
    </div>
  );
}
