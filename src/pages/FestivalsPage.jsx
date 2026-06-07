import { useState } from 'react';
import { FESTIVALS, FESTIVALS_INTRO, TYPE_META, MONTHS } from '../data/festivals.js';
import { Separator } from '@/components/ui/separator';
import { useRomaji } from '../context/RomajiContext.jsx';
import { cn } from '@/lib/utils';

// ── Year-at-a-glance timeline ─────────────────────────────────────
function YearTimeline({ activeFilter, onSelect }) {
  return (
    <div className="relative mb-10">
      {/* Month ruler */}
      <div className="grid grid-cols-12 border border-border rounded-lg overflow-hidden">
        {MONTHS.map((m, i) => {
          const monthFestivals = FESTIVALS.filter(f => f.month === i + 1);
          const hasEvent = monthFestivals.length > 0;
          return (
            <div
              key={m}
              className={cn(
                'flex flex-col items-center py-2 border-r border-border last:border-r-0 relative',
                hasEvent ? 'bg-muted/30' : 'bg-card'
              )}
            >
              <span className="text-[0.6rem] font-semibold text-muted-foreground mb-1">{m}</span>
              {/* Dot(s) for each festival */}
              <div className="flex flex-col items-center gap-0.5">
                {monthFestivals.map(f => (
                  <button
                    key={f.id}
                    onClick={() => onSelect(f.id)}
                    title={f.name}
                    className="w-2.5 h-2.5 rounded-full transition-transform hover:scale-125"
                    style={{ backgroundColor: TYPE_META[f.type].color }}
                  />
                ))}
                {monthFestivals.length === 0 && (
                  <div className="w-2.5 h-2.5" />
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
        {Object.entries(TYPE_META).map(([key, meta]) => (
          <button
            key={key}
            onClick={() => onSelect(key === activeFilter ? null : key, true)}
            className={cn(
              'flex items-center gap-1.5 text-xs transition-opacity',
              activeFilter && activeFilter !== key ? 'opacity-40' : 'opacity-100'
            )}
          >
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: meta.color }} />
            <span className="text-muted-foreground">{meta.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Vocabulary row ────────────────────────────────────────────────
function VocabRow({ v }) {
  const { showRomaji } = useRomaji();
  return (
    <div className="py-2 border-b border-border/50 last:border-0">
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="font-thai-display text-lg text-foreground leading-snug">{v.thai}</span>
        {showRomaji && <span className="text-xs italic text-muted-foreground">{v.rom}</span>}
      </div>
      <span className="text-sm text-muted-foreground">{v.en}</span>
    </div>
  );
}

// ── Festival card ─────────────────────────────────────────────────
function FestivalCard({ festival, isHighlighted }) {
  const [open, setOpen] = useState(false);
  const meta = TYPE_META[festival.type];

  return (
    <div
      id={`festival-${festival.id}`}
      className={cn(
        'rounded-xl border bg-card overflow-hidden transition-shadow',
        isHighlighted ? 'border-primary shadow-md ring-1 ring-primary/30' : 'border-border hover:shadow-sm'
      )}
    >
      {/* Header */}
      <div
        className="flex items-center gap-4 p-5 cursor-pointer"
        onClick={() => setOpen(o => !o)}
      >
        {/* Emoji + month dot */}
        <div className="flex flex-col items-center gap-1 shrink-0 w-10">
          <span className="text-3xl leading-none">{festival.emoji}</span>
          <span
            className="text-[0.55rem] font-bold tracking-wide uppercase px-1.5 py-0.5 rounded-full text-white"
            style={{ backgroundColor: meta.color }}
          >
            {MONTHS[festival.month - 1]}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-serif text-lg font-normal leading-snug">{festival.name}</h2>
            <span className={cn('text-[0.65rem] font-semibold px-2 py-0.5 rounded-full border', meta.bg, meta.text)}>
              {meta.label}
            </span>
          </div>
          <div className="font-thai-display text-base text-primary mt-0.5">{festival.thaiName}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{festival.dates}</div>
        </div>

        {/* Chevron */}
        <svg
          className={cn('shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')}
          width="16" height="16" viewBox="0 0 16 16" fill="none"
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Expandable body */}
      {open && (
        <div className="px-5 pb-6 border-t border-border/50">
          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed mt-4 mb-5 max-w-[72ch]">
            {festival.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Traditions */}
            <div>
              <h3 className="text-[0.68rem] font-bold tracking-widest uppercase text-muted-foreground mb-2">
                Traditions
              </h3>
              <ul className="flex flex-col gap-1.5">
                {festival.traditions.map((t, i) => (
                  <li key={i} className="flex gap-2 text-sm text-foreground leading-snug">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: meta.color }} />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Vocabulary */}
            <div>
              <h3 className="text-[0.68rem] font-bold tracking-widest uppercase text-muted-foreground mb-2">
                Key Vocabulary
              </h3>
              <div>
                {festival.vocab.map(v => <VocabRow key={v.thai} v={v} />)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────
export default function FestivalsPage() {
  const [highlighted, setHighlighted] = useState(null);
  const [typeFilter, setTypeFilter] = useState(null);

  const handleSelect = (idOrType, isType = false) => {
    if (isType) {
      setTypeFilter(idOrType);
      return;
    }
    setHighlighted(idOrType);
    // scroll to card
    setTimeout(() => {
      document.getElementById(`festival-${idOrType}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  };

  const visible = typeFilter
    ? FESTIVALS.filter(f => f.type === typeFilter)
    : FESTIVALS;

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-8">
      <h1 className="text-3xl font-serif font-normal mb-1">
        Festivals <em className="text-primary not-italic font-medium">&amp; Calendar</em>
      </h1>
      <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-1">เทศกาลและวันสำคัญ</p>
      <Separator className="mb-5" />
      <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-[72ch]">
        {FESTIVALS_INTRO}
      </p>

      <YearTimeline activeFilter={typeFilter} onSelect={handleSelect} />

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setTypeFilter(null)}
          className={cn(
            'px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors',
            !typeFilter
              ? 'bg-primary/10 border-primary/40 text-foreground'
              : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted/50'
          )}
        >
          All <span className="text-[0.65rem] font-mono ml-1 bg-muted px-1.5 rounded-full">{FESTIVALS.length}</span>
        </button>
        {Object.entries(TYPE_META).map(([key, meta]) => {
          const count = FESTIVALS.filter(f => f.type === key).length;
          const active = typeFilter === key;
          return (
            <button
              key={key}
              onClick={() => setTypeFilter(active ? null : key)}
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

      {/* Festival cards */}
      <div className="flex flex-col gap-3">
        {visible.map(f => (
          <FestivalCard
            key={f.id}
            festival={f}
            isHighlighted={highlighted === f.id}
          />
        ))}
      </div>
    </div>
  );
}
