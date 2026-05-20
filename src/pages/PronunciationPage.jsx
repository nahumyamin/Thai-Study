import { PRONUNCIATION_INTRO, TONES, TONE_TABLE, CORE_VOWELS, COMPOUND_VOWELS, TIPS } from '../data/pronunciation.js';
import { CONSONANTS } from '../data/consonants.js';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function PronunciationPage() {
  const midClass = CONSONANTS.filter(c => c.cls === 'mid');
  const highClass = CONSONANTS.filter(c => c.cls === 'high');
  const lowClass = CONSONANTS.filter(c => c.cls === 'low');

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-8">
      <h1 className="text-3xl font-serif font-normal mb-1">
        Thai <em className="text-primary not-italic font-medium">Pronunciation</em>
      </h1>
      <Separator className="mb-4" />
      <p className="text-sm text-muted-foreground leading-relaxed mb-8">{PRONUNCIATION_INTRO}</p>

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
                    row.clsClass === 'mid-cls' ? 'bg-blue-50 text-blue-800' :
                    row.clsClass === 'high-cls' ? 'bg-red-50 text-red-900' :
                    'bg-green-50 text-green-800'
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
          { cls: midClass, label: `Mid class — ${midClass.length} letters`, color: 'text-blue-800 bg-blue-50' },
          { cls: highClass, label: `High class — ${highClass.length} letters`, color: 'text-red-900 bg-red-50' },
          { cls: lowClass, label: `Low class — ${lowClass.length} letters`, color: 'text-green-800 bg-green-50' },
        ].map(({ cls, label, color }) => (
          <div key={label} className="mb-5">
            <span className={`inline-block text-xs font-semibold tracking-widest uppercase px-2 py-1 mb-2 ${color}`}>
              {label}
            </span>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(72px,1fr))] gap-1.5">
              {cls.map(c => (
                <Card key={c.l + c.name} className="rounded-none shadow-none">
                  <CardContent className="flex flex-col items-center text-center gap-0.5 p-2">
                    <span className="text-2xl text-foreground leading-snug">{c.l}</span>
                    <span className="text-xs font-semibold text-primary">{c.sound}</span>
                    <span className="text-[0.65rem] italic text-muted-foreground">{c.name}</span>
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
    </div>
  );
}
