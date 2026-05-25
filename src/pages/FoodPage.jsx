import { useState } from 'react';
import { FOOD, FOOD_INTRO, REGIONS } from '../data/food.js';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// ── Text-to-speech ────────────────────────────────────────────────
function SpeakerBtn({ text, className = '' }) {
  const [playing, setPlaying] = useState(false);
  const handleClick = (e) => {
    e.stopPropagation();
    if (!window.speechSynthesis) return;
    setPlaying(true);
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'th-TH';
    utt.rate = 0.85;
    utt.onend = () => setPlaying(false);
    utt.onerror = () => setPlaying(false);
    window.speechSynthesis.speak(utt);
  };
  return (
    <button
      onClick={handleClick}
      aria-label="Listen"
      title="Listen"
      className={cn(
        'relative flex items-center justify-center w-8 h-8 rounded-full border transition-colors shrink-0',
        playing
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-border text-muted-foreground hover:border-primary/50 hover:text-primary',
        className
      )}
    >
      {playing && (
        <span className="absolute inset-0 rounded-full animate-speaker-ripple border border-primary/30" />
      )}
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2 5h2.5L8 2v10L4.5 9H2a1 1 0 01-1-1V6a1 1 0 011-1z" fill="currentColor"/>
        <path d="M10 4.5c1 .8 1.5 1.5 1.5 2.5s-.5 1.7-1.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    </button>
  );
}

// ── Vocab row ─────────────────────────────────────────────────────
function VocabRow({ v }) {
  return (
    <div className="flex items-baseline gap-3 py-1.5 border-b border-border/50 last:border-0">
      <span className="font-thai-display text-lg text-foreground w-32 shrink-0">{v.thai}</span>
      <span className="text-xs italic text-muted-foreground w-28 shrink-0">{v.rom}</span>
      <span className="text-sm text-muted-foreground">{v.en}</span>
    </div>
  );
}

// ── Food card ─────────────────────────────────────────────────────
function FoodCard({ dish, isActive, onToggle }) {
  const region = REGIONS[dish.region];

  return (
    <div
      id={`food-${dish.id}`}
      className={cn(
        'rounded-xl border bg-card overflow-hidden transition-shadow',
        isActive ? 'border-primary shadow-md ring-1 ring-primary/30' : 'border-border hover:shadow-sm'
      )}
    >
      {/* Header — always visible, click to expand */}
      <div
        className="flex items-center gap-4 p-5 cursor-pointer select-none"
        onClick={onToggle}
      >
        {/* Emoji */}
        <div className="text-4xl leading-none w-12 text-center shrink-0">{dish.emoji}</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-serif text-xl font-normal leading-snug">{dish.name}</h2>
            <span className={cn('text-[0.65rem] font-semibold px-2 py-0.5 rounded-full border', region.bg, region.text)}>
              {region.label}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-thai-display text-lg text-primary leading-snug">{dish.thai}</span>
            <SpeakerBtn text={dish.thai} />
          </div>
          <div className="text-xs italic text-muted-foreground mt-0.5">{dish.rom}</div>
        </div>

        {/* Chevron */}
        <svg
          className={cn('shrink-0 text-muted-foreground transition-transform', isActive && 'rotate-180')}
          width="16" height="16" viewBox="0 0 16 16" fill="none"
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Expandable body */}
      {isActive && (
        <div className="px-5 pb-6 border-t border-border/50">
          {/* Flavor strip */}
          <div
            className="text-[0.72rem] font-semibold tracking-wide uppercase mt-4 mb-4 px-3 py-1.5 rounded-full inline-block"
            style={{ backgroundColor: region.color + '20', color: region.color }}
          >
            {dish.flavor}
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-[72ch]">
            {dish.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Ingredients */}
            <div>
              <h3 className="text-[0.68rem] font-bold tracking-widest uppercase text-muted-foreground mb-2">
                Key Ingredients
              </h3>
              <ul className="flex flex-col gap-1.5">
                {dish.ingredients.map((ing) => (
                  <li key={ing.thai} className="flex items-baseline gap-2 text-sm">
                    <span
                      className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: region.color }}
                    />
                    <span className="font-thai-display text-base text-foreground leading-snug w-28 shrink-0">{ing.thai}</span>
                    <span className="text-xs italic text-muted-foreground w-24 shrink-0">{ing.rom}</span>
                    <span className="text-muted-foreground">{ing.en}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Vocab */}
            <div>
              <h3 className="text-[0.68rem] font-bold tracking-widest uppercase text-muted-foreground mb-2">
                Words to Know
              </h3>
              <div>
                {dish.vocab.map(v => <VocabRow key={v.thai} v={v} />)}
              </div>
            </div>
          </div>

          {/* How to order */}
          <div className="mb-5">
            <h3 className="text-[0.68rem] font-bold tracking-widest uppercase text-muted-foreground mb-3">
              How to Order
            </h3>
            <div className="flex flex-col gap-2">
              {dish.ordering.map(o => (
                <div
                  key={o.thai}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border border-border/60"
                >
                  <SpeakerBtn text={o.thai} />
                  <div className="flex-1 min-w-0">
                    <span className="font-thai-display text-base text-foreground block leading-snug">{o.thai}</span>
                    <span className="text-[0.75rem] italic text-muted-foreground">{o.rom}</span>
                  </div>
                  <span className="text-sm text-muted-foreground text-right">{o.en}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tip */}
          <div className="flex gap-3 p-4 rounded-xl border-l-4 bg-muted/30" style={{ borderLeftColor: region.color }}>
            <span className="text-xl shrink-0 mt-0.5">💡</span>
            <p className="text-sm text-muted-foreground leading-relaxed">{dish.tip}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────
export default function FoodPage() {
  const [activeId, setActiveId] = useState(null);
  const [regionFilter, setRegionFilter] = useState(null);

  const toggle = (id) => {
    setActiveId(prev => (prev === id ? null : id));
  };

  const visible = regionFilter
    ? FOOD.filter(d => d.region === regionFilter)
    : FOOD;

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-8">
      <h1 className="text-3xl font-serif font-normal mb-1">
        Thai <em className="text-primary not-italic font-medium">Food</em>
      </h1>
      <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-1">อาหารไทย</p>
      <Separator className="mb-5" />
      <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-[72ch]">
        {FOOD_INTRO}
      </p>

      {/* Region filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setRegionFilter(null)}
          className={cn(
            'px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors',
            !regionFilter
              ? 'bg-primary/10 border-primary/40 text-foreground'
              : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted/50'
          )}
        >
          All <span className="text-[0.65rem] font-mono ml-1 bg-muted px-1.5 rounded-full">{FOOD.length}</span>
        </button>
        {Object.entries(REGIONS).map(([key, meta]) => {
          const count = FOOD.filter(d => d.region === key).length;
          if (!count) return null;
          const active = regionFilter === key;
          return (
            <button
              key={key}
              onClick={() => setRegionFilter(active ? null : key)}
              className={cn(
                'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors',
                active
                  ? 'bg-primary/10 border-primary/40 text-foreground'
                  : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: meta.color }} />
              {meta.label}
              <span className={cn('text-[0.65rem] font-mono rounded-full px-1.5 leading-5 min-w-[1.25rem] text-center', active ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground')}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Food cards */}
      <div className="flex flex-col gap-3">
        {visible.map(dish => (
          <FoodCard
            key={dish.id}
            dish={dish}
            isActive={activeId === dish.id}
            onToggle={() => toggle(dish.id)}
          />
        ))}
      </div>
    </div>
  );
}
