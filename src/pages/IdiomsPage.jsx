import { IDIOMS, IDIOMS_INTRO } from '../data/culture.js';
import { Separator } from '@/components/ui/separator';

function IdiomCard({ idiom }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3">
      {/* Thai + romanisation */}
      <div>
        <div className="font-thai-display text-2xl text-foreground leading-snug mb-1">
          {idiom.thai}
        </div>
        <div className="text-xs italic text-muted-foreground">{idiom.rom}</div>
      </div>

      {/* Literal */}
      <div className="flex gap-2 text-sm">
        <span className="text-[0.68rem] font-semibold tracking-widest uppercase text-muted-foreground shrink-0 pt-px w-12">
          Literal
        </span>
        <span className="text-muted-foreground italic leading-snug">"{idiom.literal}"</span>
      </div>

      <Separator />

      {/* Meaning */}
      <p className="text-sm text-foreground leading-relaxed">{idiom.meaning}</p>

      {/* English equivalent */}
      <div className="flex items-center gap-2 mt-auto pt-1">
        <span className="text-[0.65rem] font-semibold tracking-widest uppercase text-muted-foreground shrink-0">
          cf.
        </span>
        <span className="text-xs text-primary font-medium">"{idiom.equivalent}"</span>
      </div>
    </div>
  );
}

export default function IdiomsPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-5 py-8">
      <h1 className="text-3xl font-serif font-normal mb-1">
        Thai <em className="text-primary not-italic font-medium">Idioms</em>
      </h1>
      <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-1">สำนวนไทย</p>
      <Separator className="mb-5" />
      <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-[68ch]">
        {IDIOMS_INTRO}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {IDIOMS.map(idiom => (
          <IdiomCard key={idiom.thai} idiom={idiom} />
        ))}
      </div>
    </div>
  );
}
