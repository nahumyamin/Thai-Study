import { Separator } from '@/components/ui/separator';

function KofiHeart() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
    </svg>
  );
}

const FEATURES = [
  { stat: '313', label: 'vocabulary flashcards', sub: 'across 18 topics',    page: 'cards'    },
  { stat: '60',  label: 'grammar patterns',      sub: 'with examples',       page: 'grammar'  },
  { stat: '24+', label: 'reading passages',       sub: 'graded texts',        page: 'passages' },
  { stat: '5',   label: 'interactive games',      sub: 'to drill faster',     page: 'scramble' },
];

export default function AboutPage({ showPage }) {
  return (
    <div className="max-w-2xl mx-auto px-5 py-12">

      {/* Header — title + subtle Ko-fi nudge inline with subtitle */}
      <h1 className="text-4xl font-serif font-normal mb-2">
        Thai <em className="text-primary not-italic font-medium">Study</em>
      </h1>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-4 mb-6">
        <p className="text-base text-muted-foreground">
          A free Thai learning tool, built in the browser, open to everyone.
        </p>
        <a
          href="https://ko-fi.com/thaistudy"
          target="_blank"
          rel="noopener noreferrer"
          className="self-start shrink-0 inline-flex items-center gap-1.5 text-xs text-muted-foreground/70 hover:text-[#FF5E5B] transition-colors whitespace-nowrap"
        >
          <KofiHeart />
          Support on Ko-fi ↗
        </a>
      </div>

      <Separator className="mb-8" />

      {/* Origin */}
      <p className="text-base text-foreground leading-relaxed mb-8">
        Thai Study started as a tool I built for my own studying and grew into something I figured others might find useful too. It's free, runs entirely in your browser, and covers a lot of ground.
      </p>

      {/* Feature stats — clickable, link to each section */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {FEATURES.map(f => (
          <button
            key={f.stat}
            onClick={() => showPage(f.page)}
            className="group rounded-xl border border-border bg-card px-4 py-4 text-center hover:border-primary/40 hover:bg-muted/40 transition-all cursor-pointer"
          >
            <div className="text-2xl font-serif font-normal text-foreground mb-0.5">{f.stat}</div>
            <div className="text-xs font-medium text-foreground leading-tight">{f.label}</div>
            <div className="text-[0.65rem] text-muted-foreground mt-0.5">{f.sub}</div>
            <div className="text-[0.6rem] text-primary mt-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              Open →
            </div>
          </button>
        ))}
      </div>

      {/* What's here */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
        There are flashcards, grammar patterns, reading passages, tones, classifiers, idioms, festivals, and a few games to make the drilling less of a slog. Progress tracking, spaced review, and daily challenges are there if you want them.
      </p>

      {/* No paywall */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-8">
        You can create an account to save your progress, but it's completely optional — nothing is locked behind a wall, and that's not changing.
      </p>

      <Separator className="mb-8" />

      {/* Support section */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-6">
        <div className="flex-1">
          <h2 className="text-lg font-serif font-normal mb-2">Support the site</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-1">
            If it's earned a spot in your daily routine and you feel like chipping in, Ko-fi support goes straight back into building more — extra vocabulary, longer passages, whatever makes the app better.
          </p>
          <p className="text-sm text-muted-foreground">
            Entirely optional, always appreciated.{' '}
            <span className="font-thai-display text-foreground">ขอบคุณครับ</span>
          </p>
        </div>

        <a
          href="https://ko-fi.com/thaistudy"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#FF5E5B] hover:bg-[#e54e4b] text-white font-semibold text-sm transition-colors shadow-sm hover:shadow-md self-start sm:self-center"
        >
          <KofiHeart />
          Support on Ko-fi
        </a>
      </div>

    </div>
  );
}
