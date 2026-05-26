import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { READING_INTRO, READING_SECTIONS } from '../data/reading.js';
import { WRITING_INTRO, WRITING_SECTIONS } from '../data/writing.js';

function SectionAnchor({ id }) {
  return <span id={id} className="block" style={{ scrollMarginTop: '5rem' }} />;
}

function TipList({ tips }) {
  return (
    <ul className="mt-4 flex flex-col gap-2">
      {tips.map((t, i) => (
        <li key={i} className="flex gap-2 text-sm text-muted-foreground leading-relaxed">
          <span className="text-primary shrink-0 mt-0.5">›</span>
          {t.text}
        </li>
      ))}
    </ul>
  );
}

function SyllableExamples({ examples }) {
  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
      {examples.map((ex, i) => (
        <div key={i} className="rounded-lg border border-border bg-card p-4 flex flex-col gap-1">
          <div className="text-3xl font-light text-foreground text-center">{ex.thai}</div>
          <div className="text-sm italic text-primary text-center">{ex.rom}</div>
          <div className="text-xs text-muted-foreground text-center leading-relaxed">{ex.label}</div>
        </div>
      ))}
    </div>
  );
}

function ParticleTable({ particles }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm border border-border">
        <thead>
          <tr>
            <th className="border border-border px-3 py-2 text-left text-xs font-semibold text-muted-foreground bg-muted/30 w-32">Thai</th>
            <th className="border border-border px-3 py-2 text-left text-xs font-semibold text-muted-foreground bg-muted/30 w-28">Romanisation</th>
            <th className="border border-border px-3 py-2 text-left text-xs font-semibold text-muted-foreground bg-muted/30">Use</th>
          </tr>
        </thead>
        <tbody>
          {particles.map((p, i) => (
            <tr key={i} className={i % 2 === 0 ? '' : 'bg-muted/20'}>
              <td className="border border-border px-3 py-2 text-base text-foreground font-light">{p.thai}</td>
              <td className="border border-border px-3 py-2 text-sm italic text-primary">{p.rom}</td>
              <td className="border border-border px-3 py-2 text-sm text-muted-foreground">{p.use}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RegisterTable({ rows }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm border border-border">
        <thead>
          <tr>
            <th className="border border-border px-3 py-2 text-left text-xs font-semibold text-muted-foreground bg-muted/30">Spoken</th>
            <th className="border border-border px-3 py-2 text-left text-xs font-semibold text-muted-foreground bg-muted/30">Formal / Written</th>
            <th className="border border-border px-3 py-2 text-left text-xs font-semibold text-muted-foreground bg-muted/30 w-36">Meaning</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={i % 2 === 0 ? '' : 'bg-muted/20'}>
              <td className="border border-border px-3 py-2 text-base text-foreground font-light">{r.spoken}</td>
              <td className="border border-border px-3 py-2 text-base text-primary font-light">{r.formal}</td>
              <td className="border border-border px-3 py-2 text-sm text-muted-foreground">{r.meaning}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ApproachCards({ approaches }) {
  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
      {approaches.map((a, i) => (
        <Card key={i} className="rounded-none shadow-none">
          <CardContent className="p-4">
            <div className="font-semibold text-sm text-foreground mb-2 leading-snug">{a.name}</div>
            <div className="text-sm text-muted-foreground leading-relaxed">{a.desc}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function FeatureList({ features }) {
  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
      {features.map((f, i) => (
        <Card key={i} className="rounded-none shadow-none">
          <CardContent className="p-4">
            <div className="font-semibold text-sm text-foreground mb-1">{f.label}</div>
            <div className="text-sm text-muted-foreground leading-relaxed">{f.desc}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function Section({ section, showPage }) {
  return (
    <section className="mb-10">
      <SectionAnchor id={section.id} />
      <h2 className="font-serif text-xl font-normal mb-2 pb-2 border-b border-border">{section.title}</h2>
      <p className="text-sm text-muted-foreground leading-relaxed">{section.body}</p>

      {section.tips          && <TipList tips={section.tips} />}
      {section.examples      && <SyllableExamples examples={section.examples} />}
      {section.particles     && <ParticleTable particles={section.particles} />}
      {section.registerTable && <RegisterTable rows={section.registerTable} />}
      {section.approaches    && <ApproachCards approaches={section.approaches} />}
      {section.features      && <FeatureList features={section.features} />}

      {section.id === 'reader' && (
        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={() => showPage('passages')}>
            Open Reading Passages →
          </Button>
        </div>
      )}
    </section>
  );
}

function ReadingTab({ showPage }) {
  return (
    <>
      <p className="text-sm text-muted-foreground leading-relaxed mb-8">{READING_INTRO}</p>

      <nav className="mb-10 flex flex-wrap gap-2">
        {READING_SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' })}
            className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
          >
            {s.title}
          </button>
        ))}
      </nav>

      {READING_SECTIONS.map(s => (
        <Section key={s.id} section={s} showPage={showPage} />
      ))}

      <div className="pt-6 border-t border-border flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Practice this</div>
          <p className="text-sm text-muted-foreground">Apply these strategies on real Thai texts with the interactive reader.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => showPage('passages')} className="shrink-0">
          Try Reading Passages →
        </Button>
      </div>
    </>
  );
}

function WritingTab() {
  return (
    <>
      <p className="text-sm text-muted-foreground leading-relaxed mb-8">{WRITING_INTRO}</p>

      <nav className="mb-10 flex flex-wrap gap-2">
        {WRITING_SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => document.getElementById('w-' + s.id)?.scrollIntoView({ behavior: 'smooth' })}
            className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
          >
            {s.title}
          </button>
        ))}
      </nav>

      {WRITING_SECTIONS.map(s => (
        <section key={s.id} className="mb-10">
          <span id={'w-' + s.id} className="block" style={{ scrollMarginTop: '5rem' }} />
          <h2 className="font-serif text-xl font-normal mb-2 pb-2 border-b border-border">{s.title}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>

          {s.tips          && <TipList tips={s.tips} />}
          {s.registerTable && <RegisterTable rows={s.registerTable} />}
          {s.approaches    && <ApproachCards approaches={s.approaches} />}
          {s.features      && <FeatureList features={s.features} />}
        </section>
      ))}
    </>
  );
}

export default function ReadingStrategiesPage({ showPage }) {
  const [tab, setTab] = useState('reading');

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-8">
      <h1 className="text-3xl font-serif font-normal mb-1">
        Thai <em className="text-primary not-italic font-medium">Language Strategies</em>
      </h1>
      <Separator className="mb-6" />

      <Tabs value={tab} onValueChange={setTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="reading">Reading</TabsTrigger>
          <TabsTrigger value="writing">Writing</TabsTrigger>
        </TabsList>

        <TabsContent value="reading" className="mt-6">
          <ReadingTab showPage={showPage} />
        </TabsContent>

        <TabsContent value="writing" className="mt-6">
          <WritingTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
