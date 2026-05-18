import { GRAMMAR_INTRO, GRAMMAR_RULES } from '../data/grammar.js';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

function GrEx({ ex }) {
  return (
    <div className="border-l-2 border-border pl-3 py-1">
      <div className="text-base text-foreground leading-relaxed mb-0.5" dangerouslySetInnerHTML={{ __html: ex.thai }} />
      <div className="text-xs italic text-muted-foreground leading-relaxed mb-0.5" dangerouslySetInnerHTML={{ __html: ex.rom }} />
      <div className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: ex.en }} />
    </div>
  );
}

function GrRule({ rule }) {
  return (
    <Card className="mb-4 rounded-none shadow-none">
      <CardHeader className="p-0">
        <div className="flex items-baseline gap-3 px-4 py-3 border-b border-border bg-muted/30 flex-wrap">
          <span className="font-serif text-2xl italic text-primary shrink-0">{rule.num}</span>
          <span className="font-serif text-base font-normal text-foreground flex-1 min-w-0 leading-snug">{rule.title}</span>
          <span className="font-mono text-[0.72rem] text-muted-foreground px-1.5 py-0.5 border border-border bg-background whitespace-nowrap shrink-0">
            {rule.pattern}
          </span>
        </div>
      </CardHeader>
      <CardContent className="px-4 py-4">
        <p className="text-sm text-muted-foreground leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: rule.desc }} />

        {rule.subSections ? (
          <div className="flex flex-col gap-6 mt-2">
            {rule.subSections.map((sub, i) => (
              <div key={i}>
                <div className="text-[0.72rem] font-semibold tracking-widest uppercase text-muted-foreground mb-2">
                  {sub.label}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3" dangerouslySetInnerHTML={{ __html: sub.desc }} />
                {sub.key && (
                  <span className="inline-block text-[0.72rem] bg-amber-100 text-amber-800 px-1.5 py-0.5 mb-3">
                    {sub.key}
                  </span>
                )}
                <div className="flex flex-col gap-2">
                  {sub.examples.map((ex, j) => <GrEx key={j} ex={ex} />)}
                </div>
              </div>
            ))}
            {rule.quickRef && (
              <div className="mt-2 p-3 bg-muted/50 border border-border text-sm leading-loose text-muted-foreground">
                <strong className="text-foreground block mb-1 text-sm">Quick reference</strong>
                {rule.quickRef.map((line, i) => (
                  <span key={i} className="block" dangerouslySetInnerHTML={{ __html: line }} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {rule.key && (
              <span className="inline-block text-[0.72rem] bg-amber-100 text-amber-800 px-1.5 py-0.5 mb-3">
                {rule.key}
              </span>
            )}
            <div className="flex flex-col gap-2">
              {rule.examples.map((ex, i) => <GrEx key={i} ex={ex} />)}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function GrammarPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 py-8">
      <h1 className="text-3xl font-serif font-normal mb-1">
        Thai <em className="text-primary not-italic font-medium">Grammar</em>
      </h1>
      <Separator className="mb-4" />
      <p className="text-sm text-muted-foreground leading-relaxed mb-8">{GRAMMAR_INTRO}</p>
      {GRAMMAR_RULES.map(rule => (
        <GrRule key={rule.num} rule={rule} />
      ))}
    </div>
  );
}
