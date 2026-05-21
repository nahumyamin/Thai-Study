import { useState, useEffect, useCallback } from 'react';
import { topics } from '../data/vocab.js';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export default function StudyModal({ words, initialIndex, starred, onToggleStar, onClose, showRomaji = true }) {
  const [idx, setIdx] = useState(initialIndex || 0);
  const [flipped, setFlipped] = useState(false);

  const current = words[idx];
  const color = current ? (topics[current.topic]?.color || '#888') : '';

  const goPrev = useCallback(() => {
    setIdx(i => (i - 1 + words.length) % words.length);
    setFlipped(false);
  }, [words.length]);

  const goNext = useCallback(() => {
    setIdx(i => (i + 1) % words.length);
    setFlipped(false);
  }, [words.length]);

  const flip = useCallback(() => {
    setFlipped(f => !f);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'ArrowRight') goNext();
      else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(); }
      else if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goPrev, goNext, flip, onClose]);

  if (!current) return null;

  const isStarred = starred.has(current.thai);

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-lg w-full p-0 gap-0 border border-border bg-background [&>button]:hidden">
        <DialogTitle className="sr-only">Study Mode</DialogTitle>

        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <span className="text-xs text-muted-foreground tracking-wide">{idx + 1} / {words.length}</span>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-lg leading-none px-1 bg-transparent border-none cursor-pointer transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Card area */}
        <div
          className="flex items-center justify-center p-2 min-h-[320px] cursor-pointer relative"
          onClick={flip}
        >
          <div className={cn('card-wrapper w-full', flipped && 'flipped')} style={{ height: '300px', perspective: '1000px' }}>
            <div className="card-inner">
              {/* Front */}
              <div className="card-face flex flex-col items-center justify-center border border-border bg-card rounded-lg p-8 gap-2">
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-lg" style={{ background: color }} />
                <div className="text-[4rem] font-light font-thai-display text-foreground text-center leading-tight">{current.thai}</div>
                <div className="absolute bottom-3 text-[0.72rem] text-muted-foreground tracking-widest uppercase">tap to flip</div>
              </div>

              {/* Back */}
              <div className="card-face card-back card-back-rich flex flex-col items-center justify-center rounded-lg p-8 gap-2">
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-lg opacity-70" style={{ background: color }} />
                <div className="text-[1.6rem] font-serif font-normal text-center leading-snug">{current.en}</div>
                {showRomaji && <div className="text-[0.9rem] italic text-center opacity-65">{current.rom}</div>}
                {current.ex && <div className="text-[0.82rem] italic text-center opacity-50 leading-relaxed mt-1 px-2">{current.ex}</div>}
                <div className="absolute bottom-3 text-[0.7rem] tracking-widest uppercase opacity-40">
                  {topics[current.topic]?.label || current.topic}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nav bar */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border shrink-0 gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 text-2xl rounded-none"
            onClick={goPrev}
            aria-label="Previous"
          >
            ‹
          </Button>
          <button
            onClick={() => onToggleStar(current.thai)}
            className={cn(
              'text-2xl transition-all bg-transparent border-none cursor-pointer hover:scale-110',
              isStarred ? 'text-amber-500' : 'text-muted-foreground'
            )}
            aria-label={isStarred ? 'Unstar' : 'Star'}
          >
            {isStarred ? '★' : '☆'}
          </button>
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 text-2xl rounded-none"
            onClick={goNext}
            aria-label="Next"
          >
            ›
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
