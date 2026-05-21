import { useState } from 'react';
import { TRUE_CLUSTER_GROUPS, FALSE_CLUSTERS, CLUSTER_RULES, CLUSTERS_INTRO } from '../data/clusters.js';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import ClassBadge from '../components/ClassBadge.jsx';

// ── Single cluster card ───────────────────────────────────────────
function ClusterCard({ item }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card transition-shadow hover:shadow-sm',
        item.special && 'border-amber-300/60 dark:border-amber-700/50'
      )}
    >
      {/* Header row */}
      <div className="flex items-start gap-3 p-4">
        {/* Big cluster characters */}
        <div className="font-thai-display text-4xl font-light leading-none text-foreground w-14 shrink-0 text-center pt-0.5">
          {item.cluster}
        </div>

        {/* Middle: rom + class + example */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-mono text-sm font-semibold text-foreground">{item.rom}</span>
            <ClassBadge cls={item.cls} />
            {item.special && (
              <span className="text-[0.58rem] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 px-1.5 py-px rounded">
                special
              </span>
            )}
          </div>
          {/* Primary example */}
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-thai-display text-lg text-foreground">{item.ex}</span>
            <span className="text-xs italic text-muted-foreground">{item.exRom}</span>
            <span className="text-xs text-muted-foreground">— {item.exEn}</span>
          </div>
        </div>
      </div>

      {/* More examples toggle */}
      {item.more && item.more.length > 0 && (
        <>
          <button
            onClick={() => setOpen(o => !o)}
            className="w-full text-left px-4 pb-3 text-[0.68rem] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            <span className={cn('transition-transform inline-block text-[0.6rem]', open ? 'rotate-90' : '')}>▶</span>
            {open ? 'fewer examples' : `${item.more.length} more example${item.more.length > 1 ? 's' : ''}`}
          </button>
          {open && (
            <div className="px-4 pb-4 space-y-1.5 border-t border-border pt-3">
              {item.more.map((m, i) => (
                <div key={i} className="flex items-baseline gap-2 flex-wrap text-sm">
                  <span className="font-thai-display text-base text-foreground">{m.th}</span>
                  <span className="text-xs italic text-muted-foreground">{m.rom}</span>
                  <span className="text-xs text-muted-foreground">— {m.en}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────
export default function ConsonantClustersPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-5 py-8">
      <h1 className="text-3xl font-serif font-normal mb-1">
        Consonant <em className="text-primary not-italic font-medium">Clusters</em>
      </h1>
      <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-1">พยัญชนะควบกล้ำ</p>
      <Separator className="mb-5" />
      <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-[68ch]">{CLUSTERS_INTRO}</p>

      {/* ── True clusters ──────────────────────────────────────────── */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-1">
          <h2 className="font-serif text-xl font-normal">อักษรควบแท้</h2>
          <span className="text-sm text-muted-foreground">— true clusters</span>
        </div>
        <p className="text-xs text-muted-foreground mb-6">Both consonants are pronounced.</p>

        {TRUE_CLUSTER_GROUPS.map((group) => (
          <div key={group.second} className="mb-8">
            {/* Group heading */}
            <div className="flex items-baseline gap-3 mb-2">
              <div className="text-xs font-bold tracking-widest uppercase text-muted-foreground pb-1 border-b-2 border-foreground">
                {group.label}
              </div>
            </div>
            {group.note && (
              <p className="text-xs text-muted-foreground italic mb-3 max-w-[60ch]">{group.note}</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {group.items.map((item) => (
                <ClusterCard key={item.cluster} item={item} />
              ))}
            </div>
          </div>
        ))}
      </section>

      <Separator className="mb-8" />

      {/* ── False / silent clusters ────────────────────────────────── */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-1">
          <h2 className="font-serif text-xl font-normal">อักษรควบไม่แท้</h2>
          <span className="text-sm text-muted-foreground">— silent-ร clusters</span>
        </div>
        <p className="text-xs text-muted-foreground mb-6">The ร is written but not pronounced. The leading consonant determines tone.</p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                {['Cluster', 'Written', 'Spoken as', 'Class', 'Words'].map(h => (
                  <th key={h} className="text-left px-3 py-2 text-[0.72rem] font-semibold tracking-widest uppercase text-muted-foreground bg-muted/30 border-b border-border whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FALSE_CLUSTERS.map((fc) => (
                <>
                  <tr key={fc.cluster} className="border-b border-border/50 bg-muted/10">
                    <td className="px-3 py-2.5 align-top">
                      <span className="font-thai-display text-2xl font-light">{fc.cluster}</span>
                    </td>
                    <td className="px-3 py-2.5 align-top font-mono text-xs text-muted-foreground">{fc.cluster[0]} + ร</td>
                    <td className="px-3 py-2.5 align-top font-mono text-xs font-semibold text-foreground">/{fc.rom}/</td>
                    <td className="px-3 py-2.5 align-top">
                      <ClassBadge cls={fc.cls} />
                    </td>
                    <td className="px-3 py-2.5 align-top text-[0.78rem] text-muted-foreground italic max-w-[32ch]">{fc.note}</td>
                  </tr>
                  {fc.items.map((ex, i) => (
                    <tr key={fc.cluster + i} className="border-b border-border/30 last:border-b-0">
                      <td className="px-3 py-1.5 pl-6 align-top" colSpan={1}>
                        <span className="font-thai-display text-lg">{ex.th}</span>
                      </td>
                      <td className="px-3 py-1.5 align-top text-xs italic text-muted-foreground" colSpan={2}>{ex.rom}</td>
                      <td className="px-3 py-1.5 align-top text-xs text-muted-foreground" colSpan={2}>{ex.en}</td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Separator className="mb-8" />

      {/* ── Rules & notes ──────────────────────────────────────────── */}
      <section>
        <h2 className="font-serif text-xl font-normal mb-5">Key rules</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CLUSTER_RULES.map((rule, i) => (
            <Card key={i} className="rounded-none shadow-none">
              <CardContent className="p-5">
                <div className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-2">
                  {rule.heading}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{rule.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Quick-reference summary strip ──────────────────────────── */}
      <div className="mt-10 border border-border rounded-lg overflow-hidden">
        <div className="text-[0.68rem] font-bold tracking-widest uppercase text-muted-foreground px-4 py-2 bg-muted/30 border-b border-border">
          All true clusters at a glance
        </div>
        <div className="p-4 flex flex-wrap gap-x-6 gap-y-3">
          {TRUE_CLUSTER_GROUPS.map(group =>
            group.items.map(item => (
              <div key={item.cluster} className="flex items-center gap-1.5">
                <span className="font-thai-display text-xl font-light leading-none">{item.cluster}</span>
                <span className="text-[0.68rem] font-mono text-muted-foreground">{item.rom}</span>
                <ClassBadge cls={item.cls} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
