import { CONSONANTS } from '../data/consonants.js';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ClassBadge from '../components/ClassBadge.jsx';

export default function ConsonantsPage() {
  const midClass = CONSONANTS.filter(c => c.cls === 'mid');
  const highClass = CONSONANTS.filter(c => c.cls === 'high');
  const lowClass = CONSONANTS.filter(c => c.cls === 'low');

  return (
    <div className="max-w-3xl mx-auto px-5 py-8">
      <h1 className="text-3xl font-serif font-normal mb-1">
        Thai <em className="text-primary not-italic font-medium">Consonants</em>
      </h1>
      <Separator className="mb-4" />
      <p className="text-sm text-muted-foreground leading-relaxed mb-8">
        Thai has 44 consonant letters grouped into three classes — low, mid, and high. The class determines the default tone of a syllable. Each consonant has a traditional name (used for memorization) and a sound value.
      </p>

      {[
        { cls: midClass,  clsKey: 'mid',  label: `Mid class — ${midClass.length} letters`  },
        { cls: highClass, clsKey: 'high', label: `High class — ${highClass.length} letters` },
        { cls: lowClass,  clsKey: 'low',  label: `Low class — ${lowClass.length} letters`   },
      ].map(({ cls, clsKey, label }) => (
        <div key={label} className="mb-6">
          <ClassBadge cls={clsKey} variant="block" label={label} className="mb-3" />
          <div className="grid grid-cols-[repeat(auto-fill,minmax(72px,1fr))] gap-1.5">
            {cls.map(c => (
              <Card key={c.l + c.name} className="rounded-none shadow-none">
                <CardContent className="flex flex-col items-center text-center gap-0.5 p-2">
                  <span className="text-2xl text-foreground leading-snug">{c.l}</span>
                  <span className="text-xs font-semibold text-primary">{c.sound}</span>
                  <span className="text-[0.65rem] italic text-muted-foreground">{c.name}</span>
                  <div className="flex items-center gap-2 mt-1 pt-1 border-t border-border w-full justify-center">
                    <span className="font-thai-kanit text-base text-muted-foreground leading-none">{c.l}</span>
                    <span className="font-thai-playpen text-base text-muted-foreground leading-none">{c.l}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
