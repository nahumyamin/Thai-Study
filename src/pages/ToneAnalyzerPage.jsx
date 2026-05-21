import { useState, useMemo } from 'react';
import { parseSyllables, analyzeSyllable, TONE_INFO, CLASS_LABEL } from '../data/toneRules.js';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// ── Pitch-contour SVG ─────────────────────────────────────────────
function ToneContour({ contour, color, size = 48 }) {
  return (
    <svg width={size} height={Math.round(size * 0.58)} viewBox="0 0 48 28">
      {/* faint staff lines */}
      {[7, 14, 21].map(y => (
        <line key={y} x1="4" y1={y} x2="44" y2={y}
          stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.12" />
      ))}
      <path d={contour} stroke={color} strokeWidth="2.8" fill="none"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Tone badge pill ───────────────────────────────────────────────
function ToneBadge({ toneKey }) {
  const info = TONE_INFO[toneKey];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.7rem] font-semibold text-white"
      style={{ background: info.color }}
    >
      {info.nameEn} · {info.name}
    </span>
  );
}

// ── Single syllable card ──────────────────────────────────────────
function SyllableCard({ syl, analysis, index }) {
  const { tone, steps } = analysis;

  return (
    <div className="border border-border rounded-2xl bg-card overflow-hidden flex flex-col min-w-[200px] max-w-[260px] animate-card-enter" style={{ animationDelay: `${index * 60}ms` }}>
      {/* top strip — colour accent */}
      <div className="h-1" style={{ background: tone.color }} />

      {/* syllable + tone name */}
      <div className="px-5 pt-5 pb-3 flex items-end justify-between gap-3">
        <div className="text-[3rem] font-light font-thai-display text-foreground leading-none">{syl.raw}</div>
        <div className="flex flex-col items-end gap-1 pb-1">
          <ToneContour contour={tone.contour} color={tone.color} size={52} />
          <ToneBadge toneKey={analysis.toneKey} />
        </div>
      </div>

      <Separator />

      {/* step-by-step breakdown */}
      <div className="px-5 py-4 flex flex-col gap-2">
        {steps.map((step, i) => (
          <div key={i} className="text-xs leading-snug">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-0.5">
              {step.label}
            </span>
            <span className="text-foreground">{step.detail}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tone reference table ──────────────────────────────────────────
const REFERENCE_ROWS = [
  { cls: 'mid',  live: 'mid',     deadS: 'low',  deadL: 'low',     ek: 'low',     tho: 'falling' },
  { cls: 'high', live: 'rising',  deadS: 'low',  deadL: 'low',     ek: 'low',     tho: 'falling' },
  { cls: 'low',  live: 'mid',     deadS: 'high', deadL: 'falling', ek: 'falling', tho: 'high'    },
];

function ToneDot({ toneKey }) {
  const info = TONE_INFO[toneKey];
  return (
    <span className="inline-flex items-center gap-1 text-[0.7rem] font-medium whitespace-nowrap"
      style={{ color: info.color }}>
      {info.nameEn}
    </span>
  );
}

function ToneReferenceTable() {
  const cols = [
    { key: 'live',  label: 'Live,\nno mark' },
    { key: 'deadL', label: 'Dead long,\nno mark' },
    { key: 'deadS', label: 'Dead short,\nno mark' },
    { key: 'ek',    label: '่ ไม้เอก' },
    { key: 'tho',   label: '้ ไม้โท' },
  ];

  return (
    <div className="overflow-x-auto mt-10">
      <div className="text-[0.68rem] font-bold uppercase tracking-widest text-muted-foreground mb-3">
        Tone rule summary
      </div>
      <table className="w-full text-sm border-collapse min-w-[500px]">
        <thead>
          <tr>
            <th className="text-left text-xs text-muted-foreground font-medium py-2 pr-4 border-b border-border">
              Class
            </th>
            {cols.map(c => (
              <th key={c.key} className="text-center text-[0.7rem] text-muted-foreground font-medium py-2 px-3 border-b border-border whitespace-pre-line">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {REFERENCE_ROWS.map(row => (
            <tr key={row.cls} className="border-b border-border/50">
              <td className="py-2.5 pr-4 text-sm font-medium text-foreground capitalize whitespace-nowrap">
                {CLASS_LABEL[row.cls]}
              </td>
              {cols.map(c => (
                <td key={c.key} className="py-2.5 px-3 text-center">
                  <ToneDot toneKey={row[c.key]} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-[0.68rem] text-muted-foreground mt-2">
        ไม้ตรี (๊) and ไม้จัตวา (๋) always give high and rising tones respectively across all classes.
        Low-class consonants preceded by ห (ห นำ) behave as high class.
      </p>
    </div>
  );
}

// ── Large speaker icon ────────────────────────────────────────────
function SpeakerIconLg({ active }) {
  return (
    <svg width="32" height="32" viewBox="0 0 14 14" fill="none">
      <path d="M2 5H4.5L8 2V12L4.5 9H2V5Z" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M10 4.5C10.8 5.3 11.3 6.1 11.3 7C11.3 7.9 10.8 8.7 10 9.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

// ── Embeddable panel (no outer wrapper or heading) ────────────────
export function ToneAnalyzerPanel() {
  const [input, setInput] = useState('');
  const [speaking, setSpeaking] = useState(false);

  const handleSpeak = () => {
    if (!input.trim() || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(input.trim());
    utt.lang = 'th-TH';
    utt.rate = 0.85;
    utt.onstart = () => setSpeaking(true);
    utt.onend   = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utt);
  };

  const syllables = useMemo(() => {
    if (!input.trim()) return [];
    return parseSyllables(input);
  }, [input]);

  const analyzed = useMemo(() =>
    syllables.map(s => ({ syl: s, analysis: analyzeSyllable(s) })),
    [syllables]
  );

  const EXAMPLES = ['กา', 'ขา', 'น้ำ', 'หมา', 'สวัสดี', 'ภาษาไทย'];

  return (
    <>
      <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-[560px]">
        Type a Thai word to see a live tone breakdown — consonant class, syllable type,
        tone mark, and the rule that determines each tone.
      </p>

      {/* Input */}
      <div className="relative mb-6">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="พิมพ์คำภาษาไทย…"
          className="w-full text-2xl px-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 font-light text-foreground placeholder:text-muted-foreground/40"
        />
        {input && (
          <button
            onClick={() => setInput('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-lg leading-none transition-colors"
            aria-label="Clear"
          >×</button>
        )}
      </div>

      {/* Example chips */}
      {!input && (
        <div className="flex flex-wrap gap-2 mb-8">
          <span className="text-xs text-muted-foreground self-center mr-1">Try:</span>
          {EXAMPLES.map(ex => (
            <button
              key={ex}
              onClick={() => setInput(ex)}
              className="px-3 py-1 rounded-lg border border-border bg-card hover:border-primary/40 text-sm transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>
      )}

      {/* Live word display */}
      {input.trim() && (
        <div className="text-center mb-8">
          <div className="text-[5rem] font-light font-thai-display text-foreground leading-none tracking-wide mb-3">
            {input}
          </div>
          <div className="relative inline-flex items-center justify-center">
            {speaking && (
              <span className="absolute inset-0 rounded-full border-2 border-current text-primary pointer-events-none animate-speaker-ripple" />
            )}
            <button
              onClick={handleSpeak}
              className={cn(
                'relative p-2 bg-transparent border-none cursor-pointer transition-colors rounded-lg',
                speaking ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
              aria-label="Pronounce"
            >
              <SpeakerIconLg active={speaking} />
            </button>
          </div>
        </div>
      )}

      {/* Syllable cards */}
      {analyzed.length > 0 && (
        <div className="flex flex-wrap gap-4 mb-4">
          {analyzed.map(({ syl, analysis }, i) => (
            <SyllableCard key={i} index={i} syl={syl} analysis={analysis} />
          ))}
        </div>
      )}

      {/* Could not parse */}
      {input.trim() && analyzed.length === 0 && (
        <div className="text-center text-muted-foreground text-sm py-8 border border-border rounded-xl bg-card">
          Could not identify Thai syllables in this input.
        </div>
      )}

      {/* Empty state */}
      {!input.trim() && (
        <div className="text-center py-12 text-muted-foreground/40">
          <div className="text-[4rem] leading-none mb-3 inline-block animate-breathe">ก</div>
          <div className="text-sm text-muted-foreground">
            Type any Thai word above to analyze its tones
          </div>
        </div>
      )}

      {/* Reference table */}
      <ToneReferenceTable />
    </>
  );
}

// ── Standalone page (kept for compatibility) ──────────────────────
export default function ToneAnalyzerPage() {
  return (
    <div className="max-w-[900px] mx-auto px-5 py-8">
      <h1 className="text-3xl font-serif font-normal mb-1">
        Tone <em className="text-primary not-italic font-medium">Analyzer</em>
      </h1>
      <Separator className="mb-4" />
      <ToneAnalyzerPanel />
    </div>
  );
}
