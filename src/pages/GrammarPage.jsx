import { GRAMMAR_INTRO, GRAMMAR_RULES } from '../data/grammar.js';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

function GrEx({ ex }) {
  return (
    <div className="border-l-2 border-border pl-3 py-1">
      <div className="text-base text-foreground leading-relaxed mb-0.5" dangerouslySetInnerHTML={{ __html: ex.thai }} />
      <div className="text-xs italic text-muted-foreground leading-relaxed mb-0.5" dangerouslySetInnerHTML={{ __html: ex.rom }} />
      <div className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: ex.en }} />
    </div>
  );
}

function GrRuleContent({ rule }) {
  return (
    <div className="pt-2 pb-1">
      <p className="text-sm text-muted-foreground leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: rule.desc }} />

      {rule.subSections ? (
        <div className="flex flex-col gap-6">
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
            <div className="p-3 bg-muted/50 border border-border text-sm leading-loose text-muted-foreground">
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
    </div>
  );
}

export default function GrammarPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-5 py-8">
      <h1 className="text-3xl font-serif font-normal mb-1">
        Thai <em className="text-primary not-italic font-medium">Grammar</em>
      </h1>
      <Separator className="mb-4" />
      <p className="text-sm text-muted-foreground leading-relaxed mb-8">{GRAMMAR_INTRO}</p>

      <Accordion type="multiple" className="border border-border rounded-lg overflow-hidden">
        {GRAMMAR_RULES.map((rule, idx) => (
          <AccordionItem key={rule.num} value={`rule-${rule.num}`} className={idx === 0 ? 'border-t-0' : ''}>
            <AccordionTrigger className="px-4 hover:bg-muted/40 hover:no-underline">
              <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
                <span className="font-serif text-2xl italic text-primary shrink-0 leading-none">{rule.num}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-serif text-base font-normal text-foreground leading-snug">{rule.title}</div>
                  <div className="font-mono text-[0.72rem] text-muted-foreground mt-1 px-1.5 py-0.5 border border-border bg-background inline-block whitespace-nowrap">
                    {rule.pattern}
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 border-t border-border bg-muted/10">
              <GrRuleContent rule={rule} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
