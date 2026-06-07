import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

export const FONT_MIN = 1.0;
export const FONT_MAX = 2.5;
export const FONT_STEP = 0.1;

const round1 = (n) => Math.round(n * 10) / 10;

function ResetIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

// The pill itself — used both inline (desktop) and inside the floating
// wrapper (mobile).
function Stepper({ scale, setScale }) {
  const atMin = scale <= FONT_MIN + 0.001;
  const atMax = scale >= FONT_MAX - 0.001;

  const dec   = () => setScale(s => round1(Math.max(FONT_MIN, s - FONT_STEP)));
  const inc   = () => setScale(s => round1(Math.min(FONT_MAX, s + FONT_STEP)));
  const reset = () => setScale(FONT_MIN);

  const stepBtn = 'flex items-center justify-center h-8 w-8 rounded-full text-foreground transition-colors hover:bg-muted disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-default cursor-pointer';

  return (
    <div className="flex items-center gap-0.5 rounded-full border border-border bg-card/95 backdrop-blur shadow-lg sm:shadow-sm px-1.5 py-1">
      <span className="px-1.5 text-[0.7rem] font-semibold text-muted-foreground select-none" aria-hidden>Aa</span>
      <button onClick={dec} disabled={atMin} className={stepBtn} aria-label="Decrease font size" title="Decrease font size">
        <span className="text-lg leading-none">−</span>
      </button>
      <span className="w-10 text-center text-xs font-medium tabular-nums text-foreground select-none">
        {scale.toFixed(1)}×
      </span>
      <button onClick={inc} disabled={atMax} className={stepBtn} aria-label="Increase font size" title="Increase font size">
        <span className="text-lg leading-none">+</span>
      </button>
      <span className="w-px h-5 bg-border mx-0.5" aria-hidden />
      <button onClick={reset} disabled={atMin} className={stepBtn} aria-label="Reset font size" title="Reset font size">
        <ResetIcon />
      </button>
    </div>
  );
}

// Font-size stepper for the passage text.
// Desktop: sits inline in the meta row. Mobile: floats anchored to the bottom
// of the viewport (portaled to <body> so the page-transition transform doesn't
// turn `fixed` into a relative containing block), and fades out while the
// footer is in view so it never overlaps it.
export default function PassageFontControl({ scale, setScale }) {
  const [onFooter, setOnFooter] = useState(false);

  useEffect(() => {
    const check = () => {
      const footer = document.querySelector('footer');
      if (!footer) return;
      setOnFooter(footer.getBoundingClientRect().top < window.innerHeight - 8);
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, []);

  return (
    <>
      {/* Desktop: inline in the meta row */}
      <div className="hidden sm:block sm:ml-auto">
        <Stepper scale={scale} setScale={setScale} />
      </div>

      {/* Mobile: floating, anchored to the bottom of the viewport */}
      {createPortal(
        <div
          className={cn(
            'sm:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 transition-opacity duration-200',
            onFooter && 'opacity-0 pointer-events-none'
          )}
        >
          <Stepper scale={scale} setScale={setScale} />
        </div>,
        document.body
      )}
    </>
  );
}
