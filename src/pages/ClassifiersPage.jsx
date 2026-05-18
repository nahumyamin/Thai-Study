import { CLASSIFIERS_INTRO, CLASSIFIER_GROUPS } from '../data/classifiers.js';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function ClassifiersPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 py-8">
      <h1 className="text-3xl font-serif font-normal mb-1">
        Thai <em className="text-primary not-italic font-medium">Classifiers</em>
      </h1>
      <Separator className="mb-4" />
      <p className="text-sm text-muted-foreground leading-relaxed mb-8" dangerouslySetInnerHTML={{ __html: CLASSIFIERS_INTRO }} />

      {CLASSIFIER_GROUPS.map((group, gi) => (
        <div key={gi} className="mb-8">
          <div className="text-xs font-semibold tracking-widest uppercase text-muted-foreground py-1 border-b-2 border-foreground mb-3">
            {group.label}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="text-left px-3 py-2 text-[0.72rem] font-semibold tracking-widest uppercase text-muted-foreground bg-muted/30 border-b border-border">Thai</th>
                  <th className="text-left px-3 py-2 text-[0.72rem] font-semibold tracking-widest uppercase text-muted-foreground bg-muted/30 border-b border-border">Meaning</th>
                  <th className="text-left px-3 py-2 text-[0.72rem] font-semibold tracking-widest uppercase text-muted-foreground bg-muted/30 border-b border-border">Used for</th>
                  <th className="text-left px-3 py-2 text-[0.72rem] font-semibold tracking-widest uppercase text-muted-foreground bg-muted/30 border-b border-border">Example</th>
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
    </div>
  );
}
