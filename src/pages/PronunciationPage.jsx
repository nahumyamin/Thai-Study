import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PRONUNCIATION_INTRO, TONES, TONE_TABLE, CORE_VOWELS, COMPOUND_VOWELS, TIPS } from '../data/pronunciation.js';
import { CONSONANTS } from '../data/consonants.js';
import { ToneAnalyzerPanel } from './ToneAnalyzerPage.jsx';
import { ClustersPanel } from './ConsonantClustersPage.jsx';
import TonePairsPanel from '../components/TonePairsPanel.jsx';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import ClassBadge from '../components/ClassBadge.jsx';

const TABS = [
  { id: 'overview',  label: 'Overview' },
  { id: 'tonepairs', label: 'Tone Pairs' },
  { id: 'clusters',  label: 'Clusters' },
  { id: 'analyzer',  label: 'Tone Analyzer' },
];

export default function PronunciationPage({ showPage }) {
  const [tab, setTab] = useState('overview');

  const midClass = CONSONANTS.filter(c => c.cls === 'mid');
  const highClass = CONSONANTS.filter(c => c.cls === 'high');
  const lowClass = CONSONANTS.filter(c => c.cls === 'low');

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-8">
      <h1 className="text-3xl font-serif font-normal mb-1">
        Thai <em className="text-primary not-italic font-medium">Pronunciation</em>
      </h1>
      <Separator className="mb-4" />

      {/* Tab bar */}
      <div className="flex gap-1 mb-8 border-b border-border overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-5 px-5 sm:mx-0 sm:px-0">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'px-3 sm:px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap shrink-0',
              tab === t.id
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'analyzer' && <ToneAnalyzerPanel />}

      {tab === 'tonepairs' && <TonePairsPanel />}

      {tab === 'clusters' && <ClustersPanel />}

      {tab === 'overview' && <>
      <p className="text-sm text-muted-foreground leading-relaxed mb-8">{PRONUNCIATION_INTRO}</p>

      {/* Syllable structure */}
      <section className="mb-10">
        <h2 className="font-serif text-xl font-normal mb-2 pb-2 border-b border-border">Anatomy of a Thai syllable</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          Every Thai syllable has up to four components in a fixed order. Understanding these slots lets you decode any word — even unfamiliar ones.
        </p>

        {/* Four slots */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {[
            { slot: 'Initial', th: 'ก',  sub: 'consonant',          note: 'required', border: 'border-primary/40',     bg: 'bg-primary/5',          label: 'text-primary',      char: 'text-foreground' },
            { slot: 'Vowel',   th: 'า',  sub: 'above/below/around', note: 'required', border: 'border-blue-400/40',    bg: 'bg-blue-50 dark:bg-blue-900/20',    label: 'text-blue-500',     char: 'text-blue-600 dark:text-blue-300' },
            { slot: 'Tone mark', th: '้', sub: 'written above',     note: 'optional', border: 'border-amber-400/40',   bg: 'bg-amber-50 dark:bg-amber-900/20',  label: 'text-amber-600',    char: 'text-amber-600 dark:text-amber-300' },
            { slot: 'Final',   th: 'น',  sub: 'sonorant or stop',   note: 'optional', border: 'border-green-400/40',   bg: 'bg-green-50 dark:bg-green-900/20',  label: 'text-green-600',    char: 'text-green-700 dark:text-green-300' },
          ].map(({ slot, th, sub, note, border, bg, label, char }, i, arr) => (
            <div key={slot} className="flex items-center gap-2">
              <div className={cn('rounded-xl border-2 px-4 py-3 min-w-[88px] text-center', border, bg)}>
                <div className={cn('text-[0.6rem] font-bold tracking-[0.15em] uppercase mb-1', label)}>{slot}</div>
                <div className={cn('text-3xl font-thai-display leading-none mb-1.5', char)}>{th}</div>
                <div className="text-[0.65rem] text-muted-foreground leading-tight">{sub}</div>
                <div className={cn('text-[0.6rem] font-semibold mt-1.5', note === 'required' ? 'text-foreground' : 'text-muted-foreground/50')}>
                  {note}
                </div>
              </div>
              {i < arr.length - 1 && (
                <span className="text-muted-foreground/30 text-lg select-none">+</span>
              )}
            </div>
          ))}
        </div>

        {/* Worked examples */}
        <div className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">Worked examples</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          {[
            {
              word: 'มา',   rom: 'maa',   en: 'to come',
              parts: [
                { label: 'Initial', th: 'ม', rom: 'm',  color: 'text-primary' },
                { label: 'Vowel',   th: 'า', rom: 'aa', color: 'text-blue-500' },
              ],
              note: 'Open syllable — no final consonant',
            },
            {
              word: 'คน',   rom: 'khon',  en: 'person',
              parts: [
                { label: 'Initial', th: 'ค', rom: 'kh', color: 'text-primary' },
                { label: 'Vowel',   th: 'โ–ะ', rom: 'o',  color: 'text-blue-500' },
                { label: 'Final',   th: 'น', rom: 'n',  color: 'text-green-600' },
              ],
              note: 'Closed syllable — ends with sonorant',
            },
            {
              word: 'น้ำ',  rom: 'náam',  en: 'water',
              parts: [
                { label: 'Initial',    th: 'น', rom: 'n',       color: 'text-primary' },
                { label: 'Vowel',      th: 'า', rom: 'aa',      color: 'text-blue-500' },
                { label: 'Tone mark',  th: '้', rom: 'falling', color: 'text-amber-600' },
                { label: 'Final',      th: 'ม', rom: 'm',       color: 'text-green-600' },
              ],
              note: 'All four slots present',
            },
          ].map(({ word, rom, en, parts, note }) => (
            <div key={word} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-thai-display text-foreground">{word}</span>
                <span className="text-sm italic text-muted-foreground">{rom}</span>
                <span className="text-sm text-muted-foreground ml-auto">"{en}"</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {parts.map(p => (
                  <div key={p.label} className="flex flex-col items-center rounded-lg bg-muted/40 px-2.5 py-1.5 min-w-[42px]">
                    <span className={cn('text-xl font-thai-display leading-none', p.color)}>{p.th}</span>
                    <span className="text-[0.6rem] text-muted-foreground mt-0.5">{p.rom}</span>
                    <span className={cn('text-[0.55rem] font-bold tracking-wide uppercase mt-0.5', p.color)}>{p.label}</span>
                  </div>
                ))}
              </div>
              <p className="text-[0.7rem] italic text-muted-foreground">{note}</p>
            </div>
          ))}
        </div>

        {/* Live vs dead */}
        <div className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">Live vs dead syllables</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0" />
              <span className="font-semibold text-sm">Live syllable</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-2">
              Ends in a <strong className="text-foreground">sonorant final</strong> (–m, –n, –ng, –y, –w) or a <strong className="text-foreground">long vowel</strong> with no final consonant.
            </p>
            <div className="flex gap-2 flex-wrap">
              {['มา maa', 'คน khon', 'กาง kaang'].map(w => (
                <span key={w} className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-0.5 rounded-full">{w}</span>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400 shrink-0" />
              <span className="font-semibold text-sm">Dead syllable</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-2">
              Ends in a <strong className="text-foreground">stop final</strong> (–k, –t, –p) or has a <strong className="text-foreground">short vowel</strong> with no final consonant. Tones behave differently.
            </p>
            <div className="flex gap-2 flex-wrap">
              {['กิน kin', 'วัด wát', 'จบ jòp'].map(w => (
                <span key={w} className="text-xs bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-2 py-0.5 rounded-full">{w}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Vowel positions */}
        <div className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">Where vowels sit around the consonant</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { pos: 'After',      ex: 'กา',   note: '–า, –ี, –ู …',    desc: 'Most common position' },
            { pos: 'Before',     ex: 'เก',   note: 'เ–, แ–, โ– …',   desc: 'Vowel written left of consonant' },
            { pos: 'Above',      ex: 'กิ',   note: '–ิ, –ั, –็ …',   desc: 'Short vowel markers on top' },
            { pos: 'Surrounding',ex: 'เกาะ', note: 'เ–าะ, เ–ีย …',   desc: 'Split across multiple positions' },
          ].map(({ pos, ex, note, desc }) => (
            <div key={pos} className="rounded-xl border border-border bg-card p-3 text-center">
              <div className="text-[0.6rem] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-2">{pos}</div>
              <div className="text-2xl font-thai-display text-primary mb-1">{ex}</div>
              <div className="text-xs font-mono text-muted-foreground mb-1">{note}</div>
              <div className="text-[0.65rem] text-muted-foreground/70 leading-snug">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tones section */}
      <section className="mb-10">
        <h2 className="font-serif text-xl font-normal mb-2 pb-2 border-b border-border">The five tones</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Every syllable in Thai has one of five tones. Changing the tone changes the meaning entirely.
        </p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {TONES.map(tone => (
            <Card key={tone.name} className="rounded-none shadow-none">
              <CardContent className="flex flex-col items-center text-center gap-1 p-2">
                <div className="font-serif text-base font-normal">{tone.name}</div>
                <div className="text-2xl text-primary min-h-[2rem] leading-snug">{tone.mark}</div>
                <svg className="w-20 h-10 text-primary" viewBox="0 0 80 40" dangerouslySetInnerHTML={{ __html: tone.svgPath }} />
                <div className="text-lg">
                  {tone.example} <span className="text-[0.72rem] italic text-muted-foreground block">{tone.rom}</span>
                </div>
                <div className="text-xs text-muted-foreground">{tone.en}</div>
                <div className="text-[0.72rem] text-muted-foreground leading-snug mt-0.5 hidden sm:block">{tone.desc}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Tone table */}
      <section className="mb-10">
        <h2 className="font-serif text-xl font-normal mb-2 pb-2 border-b border-border">Tone rules by consonant class</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          The tone of a syllable is determined by three factors: the consonant class (low / mid / high), the tone mark used (if any), and the syllable type (live or dead).
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                {TONE_TABLE.headers.map((h, i) => (
                  <th key={i} className="border border-border px-3 py-2 text-center text-[0.78rem] font-semibold text-muted-foreground bg-muted/30 tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TONE_TABLE.rows.map(row => (
                <tr key={row.cls}>
                  <td className={`border border-border px-3 py-2 text-center font-semibold text-[0.8rem] tracking-wider uppercase ${
                    row.clsClass === 'mid-cls'  ? 'bg-blue-100  text-slate-800 dark:bg-blue-900/40  dark:text-blue-200'  :
                    row.clsClass === 'high-cls' ? 'bg-red-100   text-slate-800 dark:bg-red-900/40   dark:text-red-200'   :
                                                  'bg-green-100 text-slate-800 dark:bg-green-900/40 dark:text-green-200'
                  }`}>
                    {row.cls}
                  </td>
                  {row.tones.map((t, i) => (
                    <td key={i} className="border border-border px-3 py-2 text-center">{t}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs italic text-muted-foreground mt-3 leading-relaxed">{TONE_TABLE.note}</p>
      </section>

      {/* Consonants */}
      <section className="mb-10">
        <h2 className="font-serif text-xl font-normal mb-2 pb-2 border-b border-border">Consonants — 44 letters, 3 classes</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Thai has 44 consonant letters but only 21 distinct consonant sounds. Each letter belongs to one of three classes (low, mid, high) which determines its default tone.
        </p>

        {[
          { cls: midClass,  clsKey: 'mid',  label: `Mid class — ${midClass.length} letters`  },
          { cls: highClass, clsKey: 'high', label: `High class — ${highClass.length} letters` },
          { cls: lowClass,  clsKey: 'low',  label: `Low class — ${lowClass.length} letters`   },
        ].map(({ cls, clsKey, label }) => (
          <div key={label} className="mb-5">
            <ClassBadge cls={clsKey} variant="block" label={label} className="mb-2" />
            <div className="grid grid-cols-[repeat(auto-fill,minmax(72px,1fr))] gap-1.5">
              {cls.map(c => (
                <Card key={c.l + c.name} className="rounded-none shadow-none">
                  <CardContent className="flex flex-col items-center text-center gap-0.5 p-2">
                    <span className="text-2xl text-foreground leading-snug">{c.l}</span>
                    <span className="text-xs font-semibold text-primary">{c.sound}</span>
                    <span className="text-[0.65rem] italic text-muted-foreground">{c.name}</span>
                    <div className="flex items-center gap-1 mt-1 pt-1 border-t border-border w-full justify-center">
                      <span className="font-thai-kanit text-sm text-muted-foreground leading-none" title="Kanit">{c.l}</span>
                      <span className="font-thai-noto-sans text-sm text-muted-foreground leading-none" title="Loopless">{c.l}</span>
                      <span className="font-thai-sriracha text-sm text-muted-foreground leading-none" title="Sriracha">{c.l}</span>
                      <span className="font-thai-athiti text-sm text-muted-foreground leading-none" title="Athiti">{c.l}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Vowels */}
      <section className="mb-10">
        <h2 className="font-serif text-xl font-normal mb-2 pb-2 border-b border-border">Vowels — short &amp; long pairs</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Thai vowels are written as symbols placed above, below, before, or around the consonant. Most come in short/long pairs — length changes meaning. The consonant placeholder is shown as <strong>–</strong>.
        </p>

        <div className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2">Core vowels</div>
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse text-sm border border-border">
            <thead>
              <tr>
                <th className="border border-border px-2 py-2 text-center text-xs font-semibold text-muted-foreground bg-muted/30">Short</th>
                <th className="border border-border px-2 py-2 text-center text-xs font-semibold text-muted-foreground bg-muted/30">Long</th>
                <th className="border border-border px-2 py-2 text-center text-xs font-semibold text-muted-foreground bg-muted/30">Sound</th>
              </tr>
            </thead>
            <tbody>
              {CORE_VOWELS.map((v, i) => (
                <tr key={i}>
                  <td className="border border-border px-2 py-2 text-center text-base">{v.short}</td>
                  <td className="border border-border px-2 py-2 text-center text-base">{v.long}</td>
                  <td className="border border-border px-2 py-2 text-center text-sm italic text-primary">{v.sound}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2 mt-5">Compound vowels</div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm border border-border">
            <thead>
              <tr>
                <th className="border border-border px-2 py-2 text-center text-xs font-semibold text-muted-foreground bg-muted/30">Form</th>
                <th className="border border-border px-2 py-2 text-center text-xs font-semibold text-muted-foreground bg-muted/30">Sound</th>
                <th className="border border-border px-2 py-2 text-center text-xs font-semibold text-muted-foreground bg-muted/30">Example</th>
              </tr>
            </thead>
            <tbody>
              {COMPOUND_VOWELS.map((v, i) => (
                <tr key={i}>
                  <td className="border border-border px-2 py-2 text-center text-base">{v.form}</td>
                  <td className="border border-border px-2 py-2 text-center text-sm italic text-primary">{v.sound}</td>
                  <td className="border border-border px-2 py-2 text-center text-sm text-muted-foreground">{v.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Tips */}
      <section className="mb-10">
        <h2 className="font-serif text-xl font-normal mb-2 pb-2 border-b border-border">Beginner tips</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TIPS.map(tip => (
            <Card key={tip.num} className="rounded-none shadow-none">
              <CardContent className="p-4">
                <div className="font-serif text-2xl italic text-primary leading-none mb-2">{tip.num}</div>
                <div className="font-semibold text-sm text-foreground mb-1 leading-snug">{tip.title}</div>
                <div className="text-sm text-muted-foreground leading-relaxed">{tip.body}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Practice CTA */}
      <div className="pt-6 border-t border-border flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Practice this</div>
          <p className="text-sm text-muted-foreground">Drill consonant classes with timed flashcards.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => showPage('rush')} className="shrink-0">
          Try Class Rush →
        </Button>
      </div>
      </>}
    </div>
  );
}
