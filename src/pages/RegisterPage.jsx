import { useState } from 'react';
import { REGISTER_CATEGORIES, REGISTER_INTRO, REGISTER_LABELS } from '../data/registers.js';
import { Separator } from '@/components/ui/separator';
import { useRomaji } from '../context/RomajiContext.jsx';
import { cn } from '@/lib/utils';

function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = 'th-TH';
  utt.rate = 0.85;
  window.speechSynthesis.speak(utt);
}

function SpeakerBtn({ text }) {
  return (
    <button
      onClick={() => speak(text)}
      title="Listen"
      className="shrink-0 text-muted-foreground hover:text-foreground transition-colors p-0.5 cursor-pointer bg-transparent border-none"
      aria-label={`Listen to: ${text}`}
    >
      <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 3.5a.75.75 0 00-1.264-.546L4.703 7H2.75A1.75 1.75 0 001 8.75v2.5C1 12.216 1.784 13 2.75 13h1.953l4.033 4.046A.75.75 0 0010 16.5v-13zm3.025 1.67a.75.75 0 011.06.01 8.5 8.5 0 010 11.64.75.75 0 01-1.07-1.05 7 7 0 000-9.54.75.75 0 01.01-1.06zm2.132-1.5a.75.75 0 011.061 0 11.5 11.5 0 010 16.66.75.75 0 01-1.06-1.06 10 10 0 000-14.54.75.75 0 010-1.06z" />
      </svg>
    </button>
  );
}

// One register cell
function RegisterCell({ data, regKey }) {
  const cfg = REGISTER_LABELS[regKey];
  const { showRomaji } = useRomaji();
  return (
    <div className={cn('rounded-lg border p-3 flex flex-col gap-1.5', cfg.bg, cfg.border)}>
      <div className="flex items-start justify-between gap-1">
        <span className="text-base font-thai-display leading-snug text-foreground">{data.thai}</span>
        <SpeakerBtn text={data.thai} />
      </div>
      {showRomaji && <div className="text-[0.68rem] italic text-muted-foreground">{data.rom}</div>}
      {data.note && (
        <div className="text-[0.67rem] text-muted-foreground leading-snug border-t border-current/10 pt-1 mt-0.5">
          {data.note}
        </div>
      )}
    </div>
  );
}

// One situation card
function SituationCard({ item }) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/60 bg-muted/20 flex items-baseline justify-between gap-2">
        <span className="font-semibold text-sm text-foreground">{item.concept}</span>
        <span className="text-[0.67rem] text-muted-foreground italic shrink-0">{item.context}</span>
      </div>

      {/* 4 register cells — 2-col grid on mobile, 4-col on desktop */}
      <div className="p-3 grid grid-cols-2 lg:grid-cols-4 gap-2">
        {Object.keys(REGISTER_LABELS).map(key => (
          <div key={key} className="flex flex-col gap-1">
            <div className={cn('text-[0.6rem] font-bold uppercase tracking-widest', REGISTER_LABELS[key].color)}>
              {REGISTER_LABELS[key].en}
              <span className="ml-1 opacity-60 font-normal normal-case tracking-normal">
                {REGISTER_LABELS[key].th}
              </span>
            </div>
            <RegisterCell data={item[key]} regKey={key} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const visibleCategories = activeCategory === 'all'
    ? REGISTER_CATEGORIES
    : REGISTER_CATEGORIES.filter(c => c.id === activeCategory);

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-8">
      <h1 className="text-3xl font-serif font-normal mb-1">
        Thai <em className="text-primary not-italic font-medium">Registers</em>
      </h1>
      <Separator className="mb-4" />
      <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-2xl">{REGISTER_INTRO}</p>

      {/* Register legend */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(REGISTER_LABELS).map(([key, cfg]) => (
          <div key={key} className={cn('flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border', cfg.bg, cfg.border, cfg.color)}>
            <span className="font-semibold">{cfg.en}</span>
            <span className="opacity-60">{cfg.th}</span>
          </div>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory('all')}
          className={cn(
            'px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors',
            activeCategory === 'all'
              ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-primary dark:text-primary-foreground dark:border-primary'
              : 'bg-transparent border-border text-muted-foreground hover:text-foreground hover:bg-muted/50'
          )}
        >
          All
        </button>
        {REGISTER_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              'px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors',
              activeCategory === cat.id
                ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-primary dark:text-primary-foreground dark:border-primary'
                : 'bg-transparent border-border text-muted-foreground hover:text-foreground hover:bg-muted/50'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Situation cards */}
      <div className="flex flex-col gap-8">
        {visibleCategories.map(cat => (
          <section key={cat.id}>
            {activeCategory === 'all' && (
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                {cat.label}
              </h2>
            )}
            <div className="flex flex-col gap-4">
              {cat.items.map(item => (
                <SituationCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Footer note */}
      <div className="mt-10 pt-6 border-t border-border text-xs text-muted-foreground leading-relaxed max-w-2xl">
        <strong className="text-foreground">Note on ครับ / ค่ะ:</strong> Male speakers use <strong>ครับ</strong>; female speakers use <strong>ค่ะ</strong> (statements) or <strong>คะ</strong> (questions). These politeness particles are shown as <em>ครับ / ค่ะ</em> throughout this page — always pick the one that matches your gender.
      </div>
    </div>
  );
}
