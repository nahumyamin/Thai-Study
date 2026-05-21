import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ── 3D tile block ─────────────────────────────────────────────────
function Tile({ char, bg, fg, size = 60 }) {
  const r = Math.round(size * 0.16);
  return (
    <svg
      width={size + 8}
      height={size + 10}
      viewBox={`0 0 ${size + 8} ${size + 10}`}
      style={{ filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.13))' }}
    >
      {/* depth layer */}
      <rect x={5} y={7} width={size} height={size} rx={r} fill="rgba(0,0,0,0.18)" />
      {/* face */}
      <rect x={1} y={1} width={size} height={size} rx={r} fill={bg} />
      {/* character */}
      <text
        x={size / 2 + 1}
        y={size * 0.67 + 1}
        textAnchor="middle"
        fontSize={size * 0.44}
        fontFamily="'Sarabun', sans-serif"
        fill={fg}
      >
        {char}
      </text>
    </svg>
  );
}

const HERO_TILES = [
  { char: 'ก', bg: '#FEF08A', fg: '#92400E', size: 76, left: 95,  top: 0,   cls: 'animate-tile-1' },
  { char: 'ส', bg: '#BAE6FD', fg: '#0C4A6E', size: 60, left: 0,   top: 56,  cls: 'animate-tile-2' },
  { char: 'น', bg: '#BBF7D0', fg: '#14532D', size: 68, left: 188, top: 18,  cls: 'animate-tile-3' },
  { char: 'เ', bg: '#DDD6FE', fg: '#4C1D95', size: 52, left: 52,  top: 132, cls: 'animate-tile-2' },
  { char: 'ไ', bg: '#FECACA', fg: '#7F1D1D', size: 64, left: 150, top: 120, cls: 'animate-tile-1' },
  { char: 'ม', bg: '#FED7AA', fg: '#7C2D12', size: 50, left: 234, top: 92,  cls: 'animate-tile-3' },
];

function HeroIllustration() {
  return (
    <div className="relative w-[295px] h-[215px] shrink-0 select-none" aria-hidden="true">
      {HERO_TILES.map((t, i) => (
        <div key={i} className={cn('absolute', t.cls)} style={{ left: t.left, top: t.top }}>
          <Tile {...t} />
        </div>
      ))}
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

        <div className="hidden md:block animate-tile-3">
          <HeroIllustration />
        </div>
      </div>

      {/* ── Ornament divider ── */}
      <div className="flex items-center gap-5 mb-10 select-none" aria-hidden="true">
        <div className="flex-1 h-px bg-border" />
        <span className="text-[0.9rem] tracking-[0.55em] text-muted-foreground/40 font-light pr-[0.55em]">ก ข ค ง</span>
        <div className="flex-1 h-px bg-border" />
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
      <div className="mt-20 text-center text-sm text-muted-foreground border-t border-border pt-8">
        Created by <span className="font-medium text-foreground">Random Noise</span>
      </div>
    </div>
  );
}
