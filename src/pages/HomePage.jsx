import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { allVocab, topics } from '../data/vocab.js';
import { cn } from '@/lib/utils';

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
  // Offset by ~38% of the vocab to land on a different word reliably
  const w2 = allVocab[(DAY + Math.floor(n * 0.38)) % n];
  return [w1, w2];
}

function getDailyPrompt() {
  return DAILY_PROMPTS[DAY % DAILY_PROMPTS.length];
}

// Persist today's sentence in localStorage
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

// ── Word chip ─────────────────────────────────────────────────────
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

// ── Daily challenge ───────────────────────────────────────────────
function WordOfTheDay({ showPage }) {
  const [word1, word2] = getDailyPair();
  const { topic, prompt } = getDailyPrompt();

  const [sentence, setSentence] = useState(loadSavedSentence);
  const [revealed, setRevealed] = useState(false);

  const handleChange = (e) => {
    setSentence(e.target.value);
    saveSentence(e.target.value);
  };

  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[0.68rem] font-bold tracking-[0.18em] uppercase text-primary">
          Daily Challenge
        </span>
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

      {/* Actions */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button
          onClick={() => setRevealed(r => !r)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {revealed ? 'Hide examples ↑' : 'Reveal example sentences ↓'}
        </button>
        <button onClick={() => showPage('cards')} className="text-xs text-primary hover:underline">
          See all flashcards →
        </button>
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

// ── Hero illustration ─────────────────────────────────────────────
function HeroIllustration() {
  return (
    <div className="relative shrink-0 select-none flex flex-col items-center" aria-hidden="true">
      {/* Floating image */}
      <img
        src={`${import.meta.env.BASE_URL}hero-illustration.png`}
        alt=""
        width="380"
        height="380"
        className="animate-hero-float w-[320px] md:w-[460px] drop-shadow-xl"
        draggable="false"
      />
      {/* Ground shadow that shrinks as the image rises */}
      <div
        className="animate-hero-shadow -mt-4 w-48 h-4 rounded-full bg-foreground/20 blur-md"
      />
    </div>
  );
}

// ── Feature card icons ────────────────────────────────────────────
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
function IcoTones() {
  return (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
      {/* staff lines */}
      <line x1="4" y1="12" x2="38" y2="12" stroke="#e2e8f0" strokeWidth="1.2"/>
      <line x1="4" y1="21" x2="38" y2="21" stroke="#e2e8f0" strokeWidth="1.2"/>
      <line x1="4" y1="30" x2="38" y2="30" stroke="#e2e8f0" strokeWidth="1.2"/>
      {/* mid tone — flat blue */}
      <path d="M5,21 L15,21" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
      {/* falling tone — red */}
      <path d="M17,13 C20,14 23,22 26,28" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" fill="none"/>
      {/* rising tone — green */}
      <path d="M28,27 C30,22 33,16 37,13" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" fill="none"/>
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
      {/* Two consonant blocks side-by-side suggesting a cluster */}
      <rect x="4"  y="10" width="15" height="20" rx="3" fill="#fef9c3" stroke="#fde047" strokeWidth="1.3"/>
      <rect x="21" y="10" width="15" height="20" rx="3" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1.3"/>
      {/* Thai chars ก + ล */}
      <text x="11.5" y="25" textAnchor="middle" fontSize="11" fontFamily="'Sarabun',sans-serif" fill="#854d0e">ก</text>
      <text x="28.5" y="25" textAnchor="middle" fontSize="11" fontFamily="'Sarabun',sans-serif" fill="#1e40af">ล</text>
      {/* small + between them, bottom */}
      <text x="21" y="36" textAnchor="middle" fontSize="8" fontFamily="sans-serif" fill="#94a3b8">→ kl</text>
    </svg>
  );
}

const FEATURES = [
  { id: 'cards',         label: 'Flashcards',        desc: '313 vocabulary words across 18 topics',               Ico: IcoCards },
  { id: 'grammar',       label: 'Grammar',            desc: '20 core patterns explained with examples',            Ico: IcoGrammar },
  { id: 'passages',      label: 'Reading',            desc: 'Real Thai texts with comprehension questions',        Ico: IcoPassages },
  { id: 'rush',          label: 'Class Rush',         desc: 'Sort consonants by class against the clock',          Ico: IcoRush },
  { id: 'scramble',      label: 'Scramble',           desc: 'Reorder scrambled Thai words into the right sentence', Ico: IcoScramble },
  { id: 'quiz',          label: 'Vocabulary Quiz',    desc: 'Test recall with multiple choice questions',          Ico: IcoQuiz },
  { id: 'months',        label: 'Months',             desc: 'All 12 Thai months with a built-in quiz',             Ico: IcoMonths },
  { id: 'pronunciation', label: 'Pronunciation',      desc: 'Tones, vowels, and consonant classes',                Ico: IcoPronunciation },
  { id: 'classifiers',   label: 'Classifiers',        desc: 'Noun classifiers and Thai numerals reference',        Ico: IcoClassifiers },
  { id: 'clusters',      label: 'Clusters',           desc: 'All consonant cluster combinations with examples',    Ico: IcoClusters },
];

export default function HomePage({ showPage }) {
  return (
    <div className="relative max-w-[1200px] mx-auto px-5 pt-14 pb-20">
      {/* radial glow behind hero */}
      <div className="pointer-events-none absolute inset-x-0 -top-8 h-[520px] -z-10 hero-glow" />

      {/* ── Hero ── */}
      <div className="flex flex-col md:flex-row items-center gap-14 mb-16">
        <div className="flex-1 text-center md:text-left">
          <p className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-5">
            Thai language reference
          </p>
          <h1 className="text-5xl md:text-6xl font-serif font-normal mb-5 leading-tight">
            Learn Thai,<br/>
            <em className="text-primary not-italic font-medium">word by word.</em>
          </h1>
          <p className="text-base text-muted-foreground mb-8 max-w-[420px] mx-auto md:mx-0 leading-relaxed">
            Vocabulary cards, grammar patterns, reading passages, and games —
            everything in one place for curious learners.
          </p>
          <div className="flex gap-3 flex-wrap justify-center md:justify-start">
            <Button size="lg" onClick={() => showPage('cards')}>Start Studying →</Button>
            <Button size="lg" variant="outline" onClick={() => showPage('grammar')}>Browse Grammar</Button>
          </div>
        </div>

        <div className="hidden md:flex justify-center">
          <HeroIllustration />
        </div>
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
