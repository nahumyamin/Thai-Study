import { useState } from 'react';
import { GRAMMAR_INTRO, GRAMMAR_RULES } from '../data/grammar.js';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// ── Example block ─────────────────────────────────────────────────
function GrEx({ ex }) {
  return (
    <div className="border-l-2 border-primary/25 pl-3 py-1">
      <div className="text-base text-foreground leading-relaxed mb-0.5 font-thai-display" dangerouslySetInnerHTML={{ __html: ex.thai }} />
      <div className="text-xs italic text-muted-foreground leading-relaxed mb-0.5" dangerouslySetInnerHTML={{ __html: ex.rom }} />
      <div className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: ex.en }} />
    </div>
  );
}

// ── Rule detail panel content ──────────────────────────────────────
function RuleDetail({ rule }) {
  return (
    <>
      {/* Header */}
      <div className="flex items-start gap-4 mb-5">
        <span className="font-serif italic text-primary text-4xl leading-none shrink-0 mt-0.5">
          {rule.num}
        </span>
        <div className="min-w-0">
          <h2 className="font-serif text-xl font-normal leading-snug mb-2">{rule.title}</h2>
          <code className="text-xs font-mono text-muted-foreground bg-muted/40 border border-border px-2 py-0.5 rounded-sm">
            {rule.pattern}
          </code>
        </div>
      </div>

      {/* Body */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-5"
         dangerouslySetInnerHTML={{ __html: rule.desc }} />

      {rule.subSections ? (
        <div className="flex flex-col gap-6">
          {rule.subSections.map((sub, i) => (
            <div key={i}>
              <div className="text-[0.72rem] font-semibold tracking-widest uppercase text-muted-foreground mb-2">
                {sub.label}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3"
                 dangerouslySetInnerHTML={{ __html: sub.desc }} />
              {sub.key && (
                <span className="inline-block text-[0.72rem] bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 mb-3 rounded-sm">
                  {sub.key}
                </span>
              )}
              <div className="flex flex-col gap-2.5">
                {sub.examples.map((ex, j) => <GrEx key={j} ex={ex} />)}
              </div>
            </div>
          ))}
          {rule.quickRef && (
            <div className="p-3 bg-muted/50 border border-border text-sm leading-loose text-muted-foreground rounded-sm">
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
            <span className="inline-block text-[0.72rem] bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 mb-4 rounded-sm">
              {rule.key}
            </span>
          )}
          <div className="flex flex-col gap-2.5">
            {rule.examples.map((ex, i) => <GrEx key={i} ex={ex} />)}
          </div>
        </>
      )}
    </>
  );
}

// ── Main page ─────────────────────────────────────────────────────
export default function GrammarPage() {
  const [selected, setSelected] = useState(0);
  const [mobileDetail, setMobileDetail] = useState(false);

  const rule = GRAMMAR_RULES[selected];

  const pickRule = (idx) => {
    setSelected(idx);
    setMobileDetail(true);
    // Scroll detail panel to top
    document.getElementById('grammar-detail')?.scrollTo(0, 0);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-8">
      <h1 className="text-3xl font-serif font-normal mb-1">
        Thai <em className="text-primary not-italic font-medium">Grammar</em>
      </h1>
      <Separator className="mb-4" />
      <p className="text-sm text-muted-foreground leading-relaxed mb-6">{GRAMMAR_INTRO}</p>

      {/* ── Two-panel layout ──────────────────────────────────────── */}
      <div className="flex items-start gap-5">

        {/* Left: sticky rule list */}
        <aside className={cn(
          'shrink-0 w-64 rounded-lg border border-border overflow-hidden',
          'sticky top-[5.5rem] max-h-[calc(100vh-8rem)] overflow-y-auto',
          // Mobile: hide when viewing detail
          mobileDetail ? 'hidden md:flex md:flex-col' : 'flex flex-col w-full md:w-64'
        )}>
          {GRAMMAR_RULES.map((r, idx) => (
            <button
              key={r.num}
              onClick={() => pickRule(idx)}
              className={cn(
                'w-full text-left px-3 py-2.5 border-b border-border/50 last:border-b-0',
                'flex gap-2.5 items-start transition-colors group',
                selected === idx
                  ? 'bg-primary/8 border-l-[3px] border-l-primary'
                  : 'border-l-[3px] border-l-transparent hover:bg-muted/40'
              )}
            >
              <span className={cn(
                'font-serif italic text-base leading-none shrink-0 w-5 text-right mt-0.5',
                selected === idx ? 'text-primary' : 'text-muted-foreground group-hover:text-primary/70'
              )}>
                {r.num}
              </span>
              <div className="min-w-0 flex-1">
                <div className={cn(
                  'text-[0.75rem] font-medium leading-snug line-clamp-2',
                  selected === idx ? 'text-foreground' : 'text-muted-foreground'
                )}>
                  {r.title}
                </div>
                <div className="font-mono text-[0.6rem] text-muted-foreground/60 mt-0.5 truncate">
                  {r.pattern}
                </div>
              </div>
              {/* Mobile chevron */}
              <svg className="md:hidden shrink-0 mt-1 text-muted-foreground/40" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          ))}
        </aside>

        {/* Right: detail panel */}
        <main
          id="grammar-detail"
          className={cn(
            'flex-1 min-w-0',
            // Mobile: hide list when showing detail
            !mobileDetail ? 'hidden md:block' : 'block'
          )}
        >
          {/* Mobile back */}
          <button
            onClick={() => setMobileDetail(false)}
            className="md:hidden flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-5"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            All rules
          </button>

          {/* Rule content */}
          <RuleDetail rule={rule} />

          {/* Prev / Next */}
          <div className="flex justify-between gap-4 mt-10 pt-5 border-t border-border">
            {selected > 0 ? (
              <button
                onClick={() => pickRule(selected - 1)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group text-left"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                  <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>
                  <span className="block text-[0.6rem] uppercase tracking-widest opacity-50">Previous</span>
                  <span className="block line-clamp-1">{GRAMMAR_RULES[selected - 1].title}</span>
                </span>
              </button>
            ) : <div />}

            {selected < GRAMMAR_RULES.length - 1 ? (
              <button
                onClick={() => pickRule(selected + 1)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group text-right ml-auto"
              >
                <span>
                  <span className="block text-[0.6rem] uppercase tracking-widest opacity-50">Next</span>
                  <span className="block line-clamp-1">{GRAMMAR_RULES[selected + 1].title}</span>
                </span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                  <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            ) : <div />}
          </div>
        </main>
      </div>
    </div>
  );
}
