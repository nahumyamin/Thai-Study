import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { allVocab, topics } from '../data/vocab.js';
import { cn } from '@/lib/utils';
import { useAuth } from '../context/AuthContext.jsx';
import { submitDailyChallenge, getDailyChallenge } from '../lib/progress.js';
import { supabase } from '../lib/supabase.js';
import { getLevel } from '../lib/gamification.js';
import Leaderboard from '../components/Leaderboard.jsx';

const DAILY_PROMPTS = [
  { topic: 'At a Thai temple',        prompt: 'You\'re visiting a famous temple with a friend. Describe what you see or do — using both words in one Thai sentence.' },
  { topic: 'Family gathering',        prompt: 'It\'s Songkran and your family is together. Use both words to describe the scene or a moment.' },
  { topic: 'At the market',           prompt: 'You\'re shopping at a weekend market in Bangkok. Write a sentence that uses both words naturally.' },
  { topic: 'A phone call home',       prompt: 'You\'re calling a Thai friend to catch up. Use both words in something you might actually say.' },
  { topic: 'Telling a short story',   prompt: 'Something unexpected happened today. Write one sentence that tells part of the story — using both words.' },
  { topic: 'Describing your day',     prompt: 'It\'s evening and you\'re reflecting on the day. Use both words in a single sentence about what happened.' },
  { topic: 'At a Thai restaurant',    prompt: 'You\'re ordering food or talking with the staff. Use both words somewhere in what you say.' },
  { topic: 'Making plans',            prompt: 'You\'re making plans with a Thai friend for the weekend. Use both words in one sentence.' },
  { topic: 'Giving advice',           prompt: 'A friend is going through something difficult. Write a piece of advice using both words.' },
  { topic: 'On public transport',     prompt: 'You\'re on the BTS skytrain or a bus. Write a sentence about your journey using both words.' },
  { topic: 'At work or school',       prompt: 'Something happened at work or school today. Use both words to describe it in one Thai sentence.' },
  { topic: 'Talking about the news',  prompt: 'You heard something interesting on the news. Use both words to react to or summarise it.' },
  { topic: 'Loy Krathong night',      prompt: 'You\'re by the river watching krathong float away. Write a sentence using both words.' },
  { topic: 'Visiting a friend',       prompt: 'You just arrived at a friend\'s house. Use both words in something you say or observe.' },
  { topic: 'A dream you had',         prompt: 'You had a strange dream last night. Use both words to describe part of it in Thai.' },
  { topic: 'Asking for help',         prompt: 'You need someone\'s help with something. Write a polite request using both words.' },
  { topic: 'Describing a place',      prompt: 'Think of a place you\'ve been — or want to go. Use both words to describe it in one sentence.' },
  { topic: 'An unexpected event',     prompt: 'Something surprised you today. Write a sentence that captures the moment using both words.' },
  { topic: 'Talking about the rain',  prompt: 'Thailand\'s monsoon season has arrived. Write a sentence about the weather using both words.' },
  { topic: 'Morning routine',         prompt: 'Describe something from your morning in Thai — fitting both words into a single sentence.' },
];

const DAY = Math.floor(Date.now() / 86_400_000);

function getDailyPair() {
  const n = allVocab.length;
  const w1 = allVocab[DAY % n];
  const w2 = allVocab[(DAY + Math.floor(n * 0.38)) % n];
  return [w1, w2];
}

function getDailyPrompt() {
  return DAILY_PROMPTS[DAY % DAILY_PROMPTS.length];
}

function loadSavedSentence() {
  try {
    const raw = localStorage.getItem('wotd-challenge');
    if (!raw) return '';
    const { day, text } = JSON.parse(raw);
    return day === DAY ? text : '';
  } catch { return ''; }
}

function saveSentence(text) {
  localStorage.setItem('wotd-challenge', JSON.stringify({ day: DAY, text }));
}

// ── Word chip ──────────────────────────────────────────────────────
function WordChip({ word }) {
  const topic = topics[word.topic];
  return (
    <div className="flex-1 min-w-0 rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[0.6rem] font-bold tracking-widest uppercase text-muted-foreground">Word</span>
        {topic && (
          <span className="text-[0.6rem] font-semibold px-1.5 py-0.5 rounded-full text-white" style={{ backgroundColor: topic.color }}>
            {topic.label}
          </span>
        )}
      </div>
      <div className="font-thai-display text-3xl text-foreground leading-none mb-1">{word.thai}</div>
      <div className="text-xs italic text-muted-foreground mb-1">{word.rom}</div>
      <div className="text-sm font-medium text-foreground">{word.en}</div>
    </div>
  );
}

// ── Daily challenge ────────────────────────────────────────────────
function WordOfTheDay({ showPage }) {
  const { user } = useAuth();
  const [word1, word2] = getDailyPair();
  const { topic, prompt } = getDailyPrompt();

  const [sentence, setSentence] = useState(loadSavedSentence);
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  // Submission state
  const [submission, setSubmission] = useState(null);    // existing DB submission for today
  const [submitting, setSubmitting] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);

  // Load today's submission if user is logged in
  useEffect(() => {
    if (!user) { setSubmission(null); return; }
    getDailyChallenge(user.id, DAY).then(data => {
      setSubmission(data);
      // Pre-fill textarea with previously submitted sentence
      if (data?.sentence && !loadSavedSentence()) {
        setSentence(data.sentence);
      }
    });
  }, [user]);

  const handleChange = (e) => {
    setSentence(e.target.value);
    saveSentence(e.target.value);
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    navigator.clipboard?.writeText(sentence).catch(() => {});
  };

  const handleSubmit = async () => {
    if (!sentence.trim() || !user || submitting) return;
    setSubmitting(true);
    const data = await submitDailyChallenge(user.id, {
      sentence: sentence.trim(),
      word1Thai: word1.thai,
      word2Thai: word2.thai,
      day: DAY,
    });
    setSubmission(data);
    setJustSubmitted(true);
    setSubmitting(false);
    setTimeout(() => setJustSubmitted(false), 3000);
  };

  const isCompleted = !!submission;

  return (
    <div className={cn(
      'rounded-xl border p-5 md:p-6 transition-colors',
      isCompleted ? 'border-emerald-400/30 bg-emerald-50/50 dark:bg-emerald-950/10' : 'border-primary/20 bg-primary/5'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[0.68rem] font-bold tracking-[0.18em] uppercase text-primary">
            Daily Challenge
          </span>
          {isCompleted && (
            <span className="text-[0.65rem] font-semibold px-2 py-0.5 rounded-full bg-emerald-500 text-white flex items-center gap-1">
              ✓ Done
            </span>
          )}
        </div>
        <span className="text-[0.65rem] text-muted-foreground">Changes at midnight</span>
      </div>

      {/* Two word chips */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <WordChip word={word1} />
        <div className="flex items-center justify-center text-muted-foreground/40 font-serif text-lg sm:flex-col">+</div>
        <WordChip word={word2} />
      </div>

      {/* Prompt */}
      <div className="rounded-lg bg-card border border-border px-4 py-3 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[0.65rem] font-bold tracking-widest uppercase text-primary">Today's topic</span>
          <span className="text-[0.65rem] font-semibold text-muted-foreground">— {topic}</span>
        </div>
        <p className="text-sm text-foreground leading-relaxed">{prompt}</p>
      </div>

      {/* Input */}
      <textarea
        value={sentence}
        onChange={handleChange}
        placeholder="เขียนประโยคของคุณที่นี่… (Write your Thai sentence here)"
        rows={3}
        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm font-thai-display text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40 resize-none mb-3"
      />

      {/* Actions row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button
          onClick={() => setRevealed(r => !r)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {revealed ? 'Hide examples ↑' : 'Reveal example sentences ↓'}
        </button>

        <div className="flex items-center gap-3">
          {sentence.trim() && (
            <button
              onClick={handleCopy}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              {copied ? '✓ Copied!' : '⎘ Copy'}
            </button>
          )}

          {/* Logged-in: submit button */}
          {user && sentence.trim() && (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={cn(
                'text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer border-none',
                isCompleted
                  ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
                  : 'bg-primary text-primary-foreground hover:opacity-90',
                submitting && 'opacity-50 cursor-not-allowed'
              )}
            >
              {submitting ? 'Saving…' : justSubmitted ? '✓ Saved!' : isCompleted ? '↻ Update answer' : 'Submit for today ✓'}
            </button>
          )}

          {/* Logged-out nudge */}
          {!user && sentence.trim() && (
            <button
              onClick={() => showPage('login')}
              className="text-xs text-amber-600 hover:text-amber-500 transition-colors bg-transparent border-none cursor-pointer p-0"
            >
              Sign in to save →
            </button>
          )}

          <button onClick={() => showPage('cards')} className="text-xs text-primary hover:underline">
            All flashcards →
          </button>
        </div>
      </div>

      {/* Example reveal */}
      {revealed && (
        <div className="mt-4 flex flex-col gap-3 border-t border-border/60 pt-4">
          {[word1, word2].map(w => w.ex && (
            <div key={w.thai} className="border-l-2 border-primary/30 pl-3">
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest">{w.thai} — example</span>
              <p className="font-thai-display text-sm text-foreground mt-0.5 leading-relaxed">{w.ex}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Dashboard summary card (shown in hero for logged-in users) ────
function DashboardSummaryCard({ showPage }) {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!user || !supabase) return;
    const todayStr = new Date().toISOString().slice(0, 10);
    Promise.all([
      supabase.from('profiles')
        .select('display_name, streak_count, streak_best, total_xp, daily_goal')
        .eq('id', user.id).single(),
      supabase.from('vocab_progress')
        .select('mastery_level')
        .eq('user_id', user.id),
      supabase.from('study_sessions')
        .select('words_studied')
        .eq('user_id', user.id)
        .gte('created_at', todayStr),
    ]).then(([p, v, s]) => {
      const vocabRows  = v.data ?? [];
      const todayWords = (s.data ?? []).reduce((n, r) => n + (r.words_studied || 0), 0);
      setData({
        name:       p.data?.display_name?.split(' ')[0] ?? null,
        streak:     p.data?.streak_count  ?? 0,
        streakBest: p.data?.streak_best   ?? 0,
        xp:         p.data?.total_xp      ?? 0,
        dailyGoal:  p.data?.daily_goal    ?? 10,
        totalWords: vocabRows.length,
        mastered:   vocabRows.filter(w => w.mastery_level === 5).length,
        todayWords,
      });
    });
  }, [user]);

  // Skeleton while loading
  if (!data) {
    return (
      <div className="w-full md:w-[320px] shrink-0 rounded-2xl border border-border bg-card p-5 space-y-4 animate-pulse">
        <div className="h-4 bg-muted rounded w-2/3" />
        <div className="h-2 bg-muted rounded w-full" />
        <div className="grid grid-cols-3 gap-3">
          {[0,1,2].map(i => <div key={i} className="h-10 bg-muted rounded" />)}
        </div>
        <div className="h-10 bg-muted rounded" />
      </div>
    );
  }

  const { name, streak, streakBest, xp, dailyGoal, totalWords, mastered, todayWords } = data;
  const { level, label, progress, nextLevel } = getLevel(xp);
  const goalPct  = dailyGoal > 0 ? Math.min(1, todayWords / dailyGoal) : 0;
  const goalDone = todayWords >= dailyGoal && dailyGoal > 0;

  return (
    <div className="w-full md:w-[320px] shrink-0 rounded-2xl border border-border bg-card shadow-sm p-5 space-y-4">
      {/* Name + level */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Welcome back</p>
          <h2 className="text-lg font-bold text-foreground leading-tight">
            {name ?? user?.email?.split('@')[0] ?? 'Learner'}
          </h2>
        </div>
        <div className="text-right">
          <span className="text-[0.6rem] font-bold tracking-[0.12em] uppercase text-amber-600 block">
            Level {level}
          </span>
          <span className="text-sm font-semibold text-foreground">{label}</span>
        </div>
      </div>

      {/* XP progress bar */}
      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>{xp.toLocaleString()} XP</span>
          {nextLevel && (
            <span>{(nextLevel.minXp - xp).toLocaleString()} to {nextLevel.label}</span>
          )}
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-400 rounded-full transition-all duration-500"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* Three quick stats */}
      <div className="grid grid-cols-3 divide-x divide-border rounded-lg border border-border overflow-hidden">
        <div className="px-3 py-2.5 text-center">
          <div className="text-xl font-bold text-foreground">{streak}</div>
          <div className="text-[0.6rem] text-muted-foreground leading-tight">
            🔥 streak
            {streakBest > 0 && <span className="block text-muted-foreground/60">best {streakBest}</span>}
          </div>
        </div>
        <div className="px-3 py-2.5 text-center">
          <div className="text-xl font-bold text-foreground">{totalWords}</div>
          <div className="text-[0.6rem] text-muted-foreground leading-tight">words<br/>studied</div>
        </div>
        <div className="px-3 py-2.5 text-center">
          <div className="text-xl font-bold text-foreground">{mastered}</div>
          <div className="text-[0.6rem] text-muted-foreground leading-tight">words<br/>mastered</div>
        </div>
      </div>

      {/* Today's goal */}
      <div className="rounded-lg bg-muted/60 px-3.5 py-3">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-medium text-foreground">Today's goal</span>
          <span className={cn('font-semibold tabular-nums', goalDone ? 'text-emerald-600' : 'text-muted-foreground')}>
            {todayWords} / {dailyGoal} words{goalDone ? ' 🎉' : ''}
          </span>
        </div>
        <div className="h-1.5 bg-background rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all duration-500', goalDone ? 'bg-emerald-500' : 'bg-amber-400')}
            style={{ width: `${goalPct * 100}%` }}
          />
        </div>
      </div>

      {/* Dashboard link */}
      <button
        onClick={() => showPage('dashboard')}
        className="w-full text-sm font-semibold text-amber-600 hover:text-amber-500 transition-colors cursor-pointer bg-transparent border-none p-0 text-center"
      >
        View full dashboard →
      </button>
    </div>
  );
}

// ── Hero illustration ──────────────────────────────────────────────
function HeroIllustration() {
  return (
    <div className="relative shrink-0 select-none flex flex-col items-center" aria-hidden="true">
      <img
        src={`${import.meta.env.BASE_URL}hero-illustration.png`}
        alt=""
        width="380"
        height="380"
        className="animate-hero-float w-[300px] md:w-[420px] drop-shadow-xl"
        draggable="false"
      />
      <div className="animate-hero-shadow -mt-4 w-48 h-4 rounded-full bg-foreground/20 blur-md" />
    </div>
  );
}

// ── Feature icons ──────────────────────────────────────────────────
function IcoCards() {
  return (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
      <rect x="9" y="13" width="26" height="19" rx="4" fill="#e2e8f0"/>
      <rect x="5" y="9"  width="26" height="19" rx="4" fill="white" stroke="#cbd5e1" strokeWidth="1.5"/>
      <line x1="10" y1="16" x2="26" y2="16" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="10" y1="21" x2="22" y2="21" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function IcoGrammar() {
  return (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
      <rect x="6"  y="5" width="24" height="30" rx="4" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5"/>
      <rect x="10" y="5" width="24" height="30" rx="4" fill="white"   stroke="#e2e8f0" strokeWidth="1.5"/>
      <line x1="14" y1="14" x2="29" y2="14" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="14" y1="19" x2="27" y2="19" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="14" y1="24" x2="25" y2="24" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}
function IcoPassages() {
  return (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
      <rect x="5" y="5" width="32" height="32" rx="5" fill="white" stroke="#e2e8f0" strokeWidth="1.5"/>
      <line x1="10" y1="14" x2="32" y2="14" stroke="#cbd5e1" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="10" y1="19" x2="32" y2="19" stroke="#cbd5e1" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="10" y1="24" x2="30" y2="24" stroke="#cbd5e1" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="10" y1="29" x2="25" y2="29" stroke="#cbd5e1" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}
function IcoRush() {
  return (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
      <rect x="4" y="8" width="28" height="28" rx="6" fill="#dcfce7" stroke="#86efac" strokeWidth="1.5"/>
      <text x="18" y="28" textAnchor="middle" fontSize="16" fontFamily="'Sarabun',sans-serif" fill="#15803d">ก</text>
      <circle cx="32" cy="10" r="6" fill="#fbbf24"/>
      <path d="M30 10 L32 8 L34 10 L32 13 Z" fill="white"/>
    </svg>
  );
}
function IcoQuiz() {
  return (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
      <circle cx="21" cy="21" r="15" fill="#fef9c3" stroke="#fde047" strokeWidth="1.5"/>
      <text x="21" y="28" textAnchor="middle" fontSize="20" fontFamily="serif" fill="#a16207" fontWeight="500">?</text>
    </svg>
  );
}
function IcoMonths() {
  return (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
      <rect x="4" y="8"  width="34" height="28" rx="4" fill="white" stroke="#e2e8f0" strokeWidth="1.5"/>
      <rect x="4" y="8"  width="34" height="10" rx="4" fill="#fbbf24"/>
      <rect x="4" y="16" width="34" height="2"  fill="#fbbf24"/>
      {[13,21,29].map(cx => <circle key={cx} cx={cx} cy="24" r="2" fill="#cbd5e1"/>)}
      {[13,21,29].map(cx => <circle key={cx} cx={cx} cy="30" r="2" fill="#cbd5e1"/>)}
    </svg>
  );
}
function IcoPronunciation() {
  return (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
      <circle cx="21" cy="21" r="15" fill="#ede9fe" stroke="#c4b5fd" strokeWidth="1.5"/>
      <path d="M13 21 Q16 14 21 21 Q26 28 29 21" stroke="#7c3aed" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
    </svg>
  );
}
function IcoScramble() {
  return (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
      <rect x="4" y="8" width="10" height="12" rx="3" fill="#fde68a" stroke="#fbbf24" strokeWidth="1.2"/>
      <rect x="16" y="14" width="10" height="12" rx="3" fill="#bfdbfe" stroke="#60a5fa" strokeWidth="1.2"/>
      <rect x="28" y="8" width="10" height="12" rx="3" fill="#bbf7d0" stroke="#4ade80" strokeWidth="1.2"/>
      <text x="9" y="18" textAnchor="middle" fontSize="9" fontFamily="'Sarabun',sans-serif" fill="#92400e">ก</text>
      <text x="21" y="24" textAnchor="middle" fontSize="9" fontFamily="'Sarabun',sans-serif" fill="#1e40af">ไป</text>
      <text x="33" y="18" textAnchor="middle" fontSize="9" fontFamily="'Sarabun',sans-serif" fill="#14532d">วัด</text>
      <path d="M8 28 L34 28" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 2"/>
    </svg>
  );
}
function IcoClassifiers() {
  return (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
      <rect x="4"  y="22" width="10" height="14" rx="2" fill="#bfdbfe" stroke="#93c5fd" strokeWidth="1.2"/>
      <rect x="16" y="15" width="10" height="21" rx="2" fill="#93c5fd" stroke="#60a5fa" strokeWidth="1.2"/>
      <rect x="28" y="8"  width="10" height="28" rx="2" fill="#60a5fa" stroke="#3b82f6" strokeWidth="1.2"/>
    </svg>
  );
}
function IcoClusters() {
  return (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
      <rect x="4"  y="10" width="15" height="20" rx="3" fill="#fef9c3" stroke="#fde047" strokeWidth="1.3"/>
      <rect x="21" y="10" width="15" height="20" rx="3" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1.3"/>
      <text x="11.5" y="25" textAnchor="middle" fontSize="11" fontFamily="'Sarabun',sans-serif" fill="#854d0e">ก</text>
      <text x="28.5" y="25" textAnchor="middle" fontSize="11" fontFamily="'Sarabun',sans-serif" fill="#1e40af">ล</text>
      <text x="21" y="36" textAnchor="middle" fontSize="8" fontFamily="sans-serif" fill="#94a3b8">→ kl</text>
    </svg>
  );
}
function IcoClassifierDrop() {
  return (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
      <rect x="6" y="7" width="30" height="18" rx="4" fill="#fef3c7" stroke="#fbbf24" strokeWidth="1.4"/>
      <text x="21" y="21" textAnchor="middle" fontSize="13" fontFamily="'Sarabun',sans-serif" fill="#92400e">หนังสือ</text>
      <path d="M21 28 L21 35" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"/>
      <path d="M15 32 L21 38 L27 32" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="13" y="35" width="7" height="5" rx="1.5" fill="#bbf7d0" stroke="#4ade80" strokeWidth="1"/>
      <rect x="22" y="35" width="7" height="5" rx="1.5" fill="#fecaca" stroke="#f87171" strokeWidth="1"/>
    </svg>
  );
}
function IcoMistakeHunter() {
  return (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
      <circle cx="21" cy="21" r="15" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1.4"/>
      <path d="M13 14 L29 28M29 14 L13 28" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round"/>
      <circle cx="21" cy="21" r="4" fill="white" stroke="#ef4444" strokeWidth="1.4"/>
      <circle cx="21" cy="21" r="1.5" fill="#ef4444"/>
    </svg>
  );
}

const FEATURES = [
  { id: 'cards',         label: 'Flashcards',        desc: '313 vocabulary words across 18 topics',               Ico: IcoCards },
  { id: 'grammar',       label: 'Grammar',            desc: '20 core patterns explained with examples',            Ico: IcoGrammar },
  { id: 'passages',      label: 'Reading',            desc: 'Real Thai texts with comprehension questions',        Ico: IcoPassages },
  { id: 'rush',          label: 'Class Rush',         desc: 'Sort consonants by class against the clock',          Ico: IcoRush },
  { id: 'scramble',          label: 'Scramble',           desc: 'Reorder scrambled sentences — grammar tips revealed on correct answers', Ico: IcoScramble },
  { id: 'classifier-drop',  label: 'Classifier Drop',    desc: 'Pick the right noun classifier in a fast 30-question game',             Ico: IcoClassifierDrop },
  { id: 'mistake-hunter',   label: 'Mistake Hunter',     desc: 'Find the grammar error hiding in each Thai sentence',                   Ico: IcoMistakeHunter },
  { id: 'quiz',          label: 'Vocabulary Quiz',    desc: 'Test recall with multiple choice questions',          Ico: IcoQuiz },
  { id: 'months',        label: 'Months',             desc: 'All 12 Thai months with a built-in quiz',             Ico: IcoMonths },
  { id: 'pronunciation', label: 'Pronunciation',      desc: 'Tones, vowels, and consonant classes',                Ico: IcoPronunciation },
  { id: 'classifiers',   label: 'Classifiers',        desc: 'Noun classifiers and Thai numerals reference',        Ico: IcoClassifiers },
  { id: 'clusters',      label: 'Clusters',           desc: 'All consonant cluster combinations with examples',    Ico: IcoClusters },
];

export default function HomePage({ showPage }) {
  const { user } = useAuth();

  // user === undefined = auth loading; user === null = logged out; user = object = logged in
  const loggedOut = user === null;

  return (
    <div className="relative max-w-[1200px] mx-auto px-5 pt-14 pb-20">
      {/* radial glow behind hero */}
      <div className="pointer-events-none absolute inset-x-0 -top-8 h-[520px] -z-10 hero-glow" />

      {/* ── Hero ── */}
      <div className={cn(
        'flex gap-10 mb-16',
        user ? 'flex-col md:flex-row items-start' : 'flex-col md:flex-row items-center gap-14'
      )}>
        <div className="flex-1 text-center md:text-left">
          <p className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-5">
            Thai language reference
          </p>
          <h1 className="text-5xl md:text-6xl font-serif font-normal mb-5 leading-tight">
            Learn Thai,<br/>
            <em className="text-primary not-italic font-medium">word by word.</em>
          </h1>

          {loggedOut ? (
            /* ── Logged-out: sign-up / login as primary CTAs ── */
            <>
              <p className="text-base text-muted-foreground mb-8 max-w-[420px] mx-auto md:mx-0 leading-relaxed">
                Track your progress across 329 vocabulary words, build daily streaks, and see exactly which words need review.
              </p>

              {/* Primary CTAs */}
              <div className="flex gap-3 flex-wrap justify-center md:justify-start mb-5">
                <button
                  onClick={() => showPage('signup')}
                  className="flex items-center justify-center px-6 py-3.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer border-none"
                >
                  Create free account
                </button>
                <button
                  onClick={() => showPage('login')}
                  className="flex items-center justify-center px-6 py-3.5 rounded-xl border border-border bg-transparent text-foreground text-sm font-medium hover:bg-muted transition-colors cursor-pointer"
                >
                  Log in
                </button>
              </div>

              {/* Secondary study links */}
              <div className="flex items-center gap-1 flex-wrap justify-center md:justify-start">
                <span className="text-xs text-muted-foreground">or explore without an account:</span>
                <button onClick={() => showPage('cards')} className="px-2 py-0.5 text-sm text-foreground hover:text-primary transition-colors bg-transparent border-none cursor-pointer">Flashcards</button>
                <span className="text-muted-foreground/40 text-xs">·</span>
                <button onClick={() => showPage('grammar')} className="px-2 py-0.5 text-sm text-foreground hover:text-primary transition-colors bg-transparent border-none cursor-pointer">Grammar</button>
                <span className="text-muted-foreground/40 text-xs">·</span>
                <button onClick={() => showPage('quiz')} className="px-2 py-0.5 text-sm text-foreground hover:text-primary transition-colors bg-transparent border-none cursor-pointer">Quiz</button>
              </div>
            </>
          ) : user ? (
            /* ── Logged-in ── */
            <>
              <p className="text-base text-muted-foreground mb-7 max-w-[380px] mx-auto md:mx-0 leading-relaxed">
                Pick up where you left off. Your stats are waiting.
              </p>
              <div className="flex gap-3 flex-wrap justify-center md:justify-start">
                <button
                  onClick={() => showPage('cards')}
                  className="flex items-center justify-center px-6 py-3.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer border-none"
                >
                  Continue Studying →
                </button>
                <button
                  onClick={() => showPage('quiz')}
                  className="flex items-center justify-center px-6 py-3.5 rounded-xl border border-border bg-transparent text-foreground text-sm font-medium hover:bg-muted transition-colors cursor-pointer"
                >
                  Quick Quiz
                </button>
              </div>
            </>
          ) : null /* auth still loading — avoid flash */}
        </div>

        {/* Right column: illustration (logged-out/loading) or stats card (logged-in) */}
        {user ? (
          <DashboardSummaryCard showPage={showPage} />
        ) : (
          <div className="hidden md:flex justify-center">
            <HeroIllustration />
          </div>
        )}
      </div>

      {/* ── Ornament divider ── */}
      <div className="flex items-center gap-5 mb-10 select-none" aria-hidden="true">
        <div className="flex-1 h-px bg-border" />
        <span className="text-[0.9rem] tracking-[0.55em] text-muted-foreground/40 font-light pr-[0.55em]">ก ข ค ง</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* ── Word of the Day ── */}
      <div className="mb-10">
        <WordOfTheDay showPage={showPage} />
      </div>

      {/* ── Leaderboard ── */}
      <div className="mb-10">
        <Leaderboard currentUserId={user?.id} />
      </div>

      {/* ── Features ── */}
      <div className="mb-6">
        <p className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-5">
          What's inside
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {FEATURES.map(({ id, label, desc, Ico }) => (
            <button
              key={id}
              onClick={() => showPage(id)}
              className="group text-left p-4 md:p-5 rounded-xl border border-border bg-card hover:border-primary/20 hover:bg-accent/20 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-3 transition-transform duration-200 group-hover:scale-110 origin-left">
                <Ico />
              </div>
              <div className="font-semibold text-sm md:text-base mb-1">{label}</div>
              <div className="text-xs text-muted-foreground leading-relaxed">{desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Credit ── */}
      <div className="mt-20 text-center border-t border-border pt-8 flex flex-col items-center gap-4">
        <p className="text-sm text-muted-foreground">
          Created by <span className="font-medium text-foreground">Random Noise</span>
        </p>
        <a
          href="https://buymeacoffee.com/randomnoise"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-amber-950 font-semibold text-sm transition-colors shadow-sm hover:shadow-md"
        >
          <span>☕</span> Buy me a coffee
        </a>
      </div>
    </div>
  );
}
