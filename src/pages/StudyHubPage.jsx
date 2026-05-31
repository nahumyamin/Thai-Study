import { getHub } from '../data/studyHubs.js';
import { Separator } from '@/components/ui/separator';

export default function StudyHubPage({ hub, showPage }) {
  const data = getHub(hub);
  if (!data) return null;

  return (
    <div className="max-w-[900px] mx-auto px-5 py-8">
      <h1 className="text-3xl font-serif font-normal mb-1">
        {data.accent ? (
          <>
            {data.title}{' '}
            <em className="text-primary not-italic font-medium">{data.accent}</em>
          </>
        ) : (
          <em className="text-primary not-italic font-medium font-serif">{data.title}</em>
        )}
      </h1>
      <Separator className="mb-4" />

      <p className="text-sm text-muted-foreground leading-relaxed max-w-[640px] mb-8">
        {data.intro}
      </p>

      <div className="text-[0.75rem] font-semibold tracking-widest uppercase text-muted-foreground mb-3">
        Choose a tool
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {data.tools.map(tool => (
          <button
            key={tool.page}
            onClick={() => showPage(tool.page)}
            className="group text-left rounded-xl border border-border bg-card p-4 hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer flex items-start gap-3"
          >
            <span className="text-2xl leading-none shrink-0 mt-0.5" aria-hidden>{tool.emoji}</span>
            <span className="flex-1 min-w-0">
              <span className="flex items-center gap-2">
                <span className="font-medium text-foreground">{tool.name}</span>
                {tool.note && (
                  <span className="text-[0.6rem] font-semibold tracking-wide uppercase text-muted-foreground border border-border rounded-full px-1.5 py-0.5">
                    {tool.note}
                  </span>
                )}
              </span>
              <span className="block text-sm text-muted-foreground leading-relaxed mt-0.5">
                {tool.desc}
              </span>
            </span>
            <span className="text-primary/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" aria-hidden>→</span>
          </button>
        ))}
      </div>
    </div>
  );
}
