import { useState } from 'react';
import { ANTHEMS } from '../data/culture.js';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

function FactRow({ label, value }) {
  return (
    <div className="flex gap-3 text-sm py-2 border-b border-border last:border-b-0">
      <span className="text-[0.72rem] font-semibold tracking-widest uppercase text-muted-foreground w-16 shrink-0 pt-px">
        {label}
      </span>
      <span className="text-foreground leading-snug">{value}</span>
    </div>
  );
}

function AnthemPanel({ anthem }) {
  return (
    <div className="animate-page-in">
      {/* Context */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-[72ch]">
        {anthem.intro}
      </p>

      {/* Facts + video side by side */}
      <div className="flex flex-col md:flex-row gap-5 mb-8">
        <div className="rounded-lg border border-border bg-muted/20 px-4 py-1 md:w-[380px] shrink-0">
          {anthem.facts.map(f => (
            <FactRow key={f.label} label={f.label} value={f.value} />
          ))}
        </div>
        <div className="flex-1 rounded-lg overflow-hidden border border-border aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${anthem.youtubeId}`}
            title={anthem.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Lyrics */}
      <div className="mb-2">
        <h2 className="font-serif text-xl font-normal mb-4">Lyrics</h2>
        <div className="rounded-lg border border-border overflow-hidden">
          {anthem.lines.map((line, i) => (
            <div
              key={i}
              className={cn(
                'grid grid-cols-1 md:grid-cols-2 gap-x-6',
                i % 2 === 0 ? 'bg-card' : 'bg-muted/20'
              )}
            >
              {/* Thai side */}
              <div className="px-4 pt-3 pb-1 md:pb-3 border-b md:border-b-0 md:border-r border-border/50">
                <div className="font-thai-display text-xl text-foreground leading-relaxed">
                  {line.thai}
                </div>
                <div className="text-[0.72rem] italic text-muted-foreground mt-0.5">
                  {line.rom}
                </div>
              </div>
              {/* English side */}
              <div className="px-4 pb-3 pt-1 md:pt-3 flex items-center">
                <span className="text-sm text-muted-foreground leading-relaxed">
                  {line.en}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footnote */}
      {anthem.note && (
        <p className="mt-4 text-xs text-muted-foreground italic leading-relaxed max-w-[60ch]">
          Note: {anthem.note}
        </p>
      )}
    </div>
  );
}

export default function CulturePage() {
  const [activeTab, setActiveTab] = useState(ANTHEMS[0].id);
  const anthem = ANTHEMS.find(a => a.id === activeTab);

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-8">
      <h1 className="text-3xl font-serif font-normal mb-1">
        Thai <em className="text-primary not-italic font-medium">Culture</em>
      </h1>
      <Separator className="mb-6" />

      {/* Tab pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {ANTHEMS.map(a => {
          const active = activeTab === a.id;
          return (
            <button
              key={a.id}
              onClick={() => setActiveTab(a.id)}
              className={cn(
                'flex flex-col items-start px-4 py-2.5 rounded-lg text-sm font-medium transition-colors border',
                active
                  ? 'bg-primary/10 border-primary/40 text-foreground'
                  : 'bg-transparent border-border text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <span>{a.title}</span>
              <span className={cn(
                'text-[0.68rem] font-normal mt-0.5',
                active ? 'text-primary' : 'text-muted-foreground/70'
              )}>
                {a.thaiTitle}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active panel */}
      <AnthemPanel key={anthem.id} anthem={anthem} />
    </div>
  );
}
