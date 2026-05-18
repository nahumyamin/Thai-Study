import { NUMBERS_INTRO, DIGITS, BUILDING_RULES, CONTEXT_CARDS } from '../data/numbers.js';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function NumbersPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 py-8">
      <h1 className="text-3xl font-serif font-normal mb-1">
        Thai <em className="text-primary not-italic font-medium">Numbers</em>
      </h1>
      <Separator className="mb-4" />
      <p className="text-sm text-muted-foreground leading-relaxed mb-8">{NUMBERS_INTRO}</p>

      <section className="mb-9">
        <h2 className="font-serif text-xl font-normal mb-3 pb-2 border-b border-border">0 – 10: digits &amp; words</h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-2">
          {DIGITS.map(d => (
            <Card key={d.arabic} className="rounded-none shadow-none">
              <CardContent className="flex flex-col items-center text-center gap-0.5 p-2">
                <span
                  className="text-primary leading-snug"
                  style={{ fontSize: d.small ? '1.2rem' : '1.75rem' }}
                >
                  {d.thai}
                </span>
                <span className="text-xs font-semibold text-muted-foreground">{d.arabic}</span>
                <span className="text-base text-foreground">{d.word}</span>
                <span className="text-[0.68rem] italic text-muted-foreground">{d.rom}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-9">
        <h2 className="font-serif text-xl font-normal mb-3 pb-2 border-b border-border">Building larger numbers</h2>
        {BUILDING_RULES.map((rule, i) => (
          <Card key={i} className="mb-2 rounded-none shadow-none">
            <CardContent className="p-4">
              <div className="font-semibold text-sm text-foreground mb-1">{rule.title}</div>
              <div className="text-sm text-muted-foreground leading-relaxed mb-3">{rule.body}</div>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {rule.examples.map((ex, j) => (
                  <div key={j} className="flex flex-col">
                    <span className="text-base text-foreground">{ex.thai}</span>
                    <span className="text-[0.7rem] italic text-muted-foreground">{ex.rom}</span>
                    <span className="text-[0.78rem] text-muted-foreground">{ex.en}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mb-9">
        <h2 className="font-serif text-xl font-normal mb-3 pb-2 border-b border-border">Numbers in context</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {CONTEXT_CARDS.map((card, i) => (
            <Card key={i} className="rounded-none shadow-none">
              <CardContent className="p-4">
                <div className="font-semibold text-sm text-foreground mb-1">{card.title}</div>
                <div className="text-sm text-muted-foreground leading-relaxed mb-1">{card.body}</div>
                <div className="text-base text-foreground mt-1">{card.ex}</div>
                <div className="text-[0.7rem] italic text-muted-foreground">{card.rom}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
