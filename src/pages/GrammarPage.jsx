import { useState } from 'react';
import { GRAMMAR_INTRO, GRAMMAR_RULES, GRAMMAR_CATEGORIES } from '../data/grammar.js';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// ── Example block ─────────────────────────────────────────────────
function GrEx({ ex }) {
  return (
    <div className="border-l-2 border-primary/30 pl-3 py-1">
      <div
        className="text-base text-foreground leading-relaxed mb-0.5 font-thai-display"
        dangerouslySetInnerHTML={{ __html: ex.thai }}
      />
      <div
        className="text-xs italic text-muted-foreground leading-relaxed mb-0.5"
        dangerouslySetInnerHTML={{ __html: ex.rom }}
      />
      <div
        className="text-sm text-muted-foreground"
        dangerouslySetInnerHTML={{ __html: ex.en }}
      />
    </div>
  );
}

// ── Key hint pill ─────────────────────────────────────────────────
function KeyHint({ text }) {
  if (!text) return null;
  return (
    <span className="inline-block text-[0.72rem] bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 px-1.5 py-0.5 mb-3 rounded-sm">
      {text}
    </span>
  );
}

// ── Single rule card (fully expanded) ────────────────────────────
function RuleCard({ rule }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <span className="font-serif italic text-primary text-3xl leading-none shrink-0 mt-0.5 w-8 text-center">
          {rule.num}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-lg font-normal leading-snug mb-1.5">{rule.title}</h3>
          <code className="text-xs font-mono text-muted-foreground bg-muted/50 border border-border px-2 py-0.5 rounded-sm">
            {rule.pattern}
          </code>
        </div>
      </div>

      {/* Description */}
      <p
        className="text-sm text-muted-foreground leading-relaxed"
        dangerouslySetInnerHTML={{ __html: rule.desc }}
      />

      {/* Sub-sections (rules 11 & 12) */}
      {rule.subSections ? (
        <div className="flex flex-col gap-5">
          {rule.subSections.map((sub, i) => (
            <div key={i} className="pl-3 border-l border-border/60">
              <div className="text-[0.72rem] font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">
                {sub.label}
              </div>
              <p
                className="text-sm text-muted-foreground leading-relaxed mb-2"
                dangerouslySetInnerHTML={{ __html: sub.desc }}
              />
              <KeyHint text={sub.key} />
              <div className="flex flex-col gap-2">
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
          <KeyHint text={rule.key} />
          <div className="flex flex-col gap-2">
            {rule.examples.map((ex, i) => <GrEx key={i} ex={ex} />)}
          </div>
        </>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────
export default function GrammarPage() {
  const [activeTab, setActiveTab] = useState(GRAMMAR_CATEGORIES[0].id);

  const tabRules = GRAMMAR_RULES.filter(r => r.category === activeTab);

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-8">
      <h1 className="text-3xl font-serif font-normal mb-1">
        Thai <em className="text-primary not-italic font-medium">Grammar</em>
      </h1>
      <Separator className="mb-4" />
      <p className="text-sm text-muted-foreground leading-relaxed mb-6">{GRAMMAR_INTRO}</p>

      {/* ── Category tab bar ──────────────────────────────────────── */}
      <div className="flex gap-0 mb-8 border-b border-border overflow-x-auto">
        {GRAMMAR_CATEGORIES.map(cat => {
          const count = GRAMMAR_RULES.filter(r => r.category === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={cn(
                'px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap flex items-center gap-1.5 shrink-0',
                activeTab === cat.id
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              )}
            >
              <span className="hidden sm:inline">{cat.label}</span>
              <span className="sm:hidden">{cat.short}</span>
              <span className={cn(
                'text-[0.65rem] font-mono rounded-full px-1.5 py-0 leading-5 min-w-[1.25rem] text-center tabular-nums',
                activeTab === cat.id
                  ? 'bg-primary/15 text-primary'
                  : 'bg-muted text-muted-foreground'
              )}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Rule cards for active tab ─────────────────────────────── */}
      <div className="flex flex-col gap-5">
        {tabRules.map(rule => (
          <RuleCard key={rule.num} rule={rule} />
        ))}
      </div>

      {/* ── Tab navigation footer ─────────────────────────────────── */}
      <div className="flex justify-between mt-10 pt-5 border-t border-border">
        {(() => {
          const idx = GRAMMAR_CATEGORIES.findIndex(c => c.id === activeTab);
          const prev = GRAMMAR_CATEGORIES[idx - 1];
          const next = GRAMMAR_CATEGORIES[idx + 1];
          return (
            <>
              {prev ? (
                <button
                  onClick={() => setActiveTab(prev.id)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>
                    <span className="block text-[0.6rem] uppercase tracking-widest opacity-50">Previous</span>
                    <span className="block">{prev.label}</span>
                  </span>
                </button>
              ) : <div />}
              {next ? (
                <button
                  onClick={() => setActiveTab(next.id)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors ml-auto"
                >
                  <span className="text-right">
                    <span className="block text-[0.6rem] uppercase tracking-widest opacity-50">Next</span>
                    <span className="block">{next.label}</span>
                  </span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              ) : <div />}
            </>
          );
        })()}
      </div>
    </div>
  );
}
