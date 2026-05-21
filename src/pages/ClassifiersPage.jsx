import { useState } from 'react';
import { CLASSIFIERS_INTRO, CLASSIFIER_GROUPS } from '../data/classifiers.js';
import { NUMBERS_INTRO, DIGITS, BUILDING_RULES, CONTEXT_CARDS } from '../data/numbers.js';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'classifiers', label: 'Classifiers' },
  { id: 'numbers',     label: 'Numbers'     },
];

export default function ClassifiersPage() {
  const [tab, setTab] = useState('classifiers');

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-8">
      <h1 className="text-3xl font-serif font-normal mb-1">
        Thai <em className="text-primary not-italic font-medium">Numbers &amp; Classifiers</em>
      </h1>
      <Separator className="mb-4" />

      {/* Tab bar */}
      <div className="flex gap-1 mb-8 border-b border-border">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
              tab === t.id
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Classifiers tab ─────────────────────────────────────── */}
      {tab === 'classifiers' && (
        <>
          <p className="text-sm text-muted-foreground leading-relaxed mb-8"
             dangerouslySetInnerHTML={{ __html: CLASSIFIERS_INTRO }} />

          {CLASSIFIER_GROUPS.map((group, gi) => (
            <div key={gi} className="mb-8">
              <div className="text-xs font-semibold tracking-widest uppercase text-muted-foreground py-1 border-b-2 border-foreground mb-3">
                {group.label}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr>
                      {['Thai', 'Meaning', 'Used for', 'Example'].map(h => (
                        <th key={h} className="text-left px-3 py-2 text-[0.72rem] font-semibold tracking-widest uppercase text-muted-foreground bg-muted/30 border-b border-border">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {group.items.map((item, i) => (
                      <tr key={i} className="border-b border-border last:border-b-0">
                        <td className="px-3 py-2 align-top">
                          <span className="text-lg text-foreground block">{item.thai}</span>
                          <span className="text-xs italic text-muted-foreground">{item.rom}</span>
                        </td>
                        <td className="px-3 py-2 align-top font-medium text-foreground">{item.en}</td>
                        <td className="px-3 py-2 align-top text-muted-foreground text-[0.83rem] leading-relaxed">{item.nouns}</td>
                        <td className="px-3 py-2 align-top text-[0.82rem] italic text-muted-foreground">{item.example}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          <Card className="rounded-none shadow-none">
            <CardContent className="p-4 text-sm leading-loose text-muted-foreground">
              <strong className="text-foreground block mb-1">Sentence pattern</strong>
              <span className="block">noun + number + classifier → <strong>หมา</strong> (dog) + <strong>สาม</strong> (3) + <strong>ตัว</strong> = หมาสามตัว</span>
              <span className="block mt-1">When no number is present, the classifier still appears in constructions like "which one?" → <strong>ตัวไหน</strong></span>
            </CardContent>
          </Card>
        </>
      )}

      {/* ── Numbers tab ─────────────────────────────────────────── */}
      {tab === 'numbers' && (
        <>
          <p className="text-sm text-muted-foreground leading-relaxed mb-8">{NUMBERS_INTRO}</p>

          <section className="mb-9">
            <h2 className="font-serif text-xl font-normal mb-3 pb-2 border-b border-border">0 – 10: digits &amp; words</h2>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-2">
              {DIGITS.map(d => (
                <Card key={d.arabic} className="rounded-none shadow-none">
                  <CardContent className="flex flex-col items-center text-center gap-0.5 p-2">
                    <span className="text-primary leading-snug"
                          style={{ fontSize: d.small ? '1.2rem' : '1.75rem' }}>
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
        </>
      )}
    </div>
  );
}
