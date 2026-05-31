import { useState, useEffect, useCallback, useRef } from 'react';
import { topics } from '../data/vocab.js';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useAuth } from '../context/AuthContext.jsx';
import { recordAnswer, recordSession } from '../lib/progress.js';

const THAI_FONT_CLASS = { kanit: 'font-thai-kanit', 'noto-sans': 'font-thai-noto-sans', sriracha: 'font-thai-sriracha', athiti: 'font-thai-athiti' };

export default function StudyModal({ words, initialIndex, starred, onToggleStar, onClose, showRomaji = true, thaiFont = 'default' }) {
  const { user } = useAuth();
  const [idx, setIdx] = useState(initialIndex || 0);
  const [flipped, setFlipped] = useState(false);
  const sessionStartRef = useRef(Date.now());
  const resultsRef = useRef({ correct: 0, incorrect: 0, seen: new Set() });

  const current = words[idx];
  const color = current ? (topics[current.topic]?.color || '#888') : '';

  const handleClose = useCallback(() => {
    const { correct, incorrect, seen } = resultsRef.current;
    const wordsStudied = seen.size;
    if (wordsStudied > 0) {
      const secs = Math.round((Date.now() - sessionStartRef.current) / 1000);
      recordSession(user?.id, 'flashcard', wordsStudied, correct, secs);
    }
    onClose();
  }, [user, onClose]);

  const handleKnowIt = useCallback(() => {
    if (!current) return;
    recordAnswer(user?.id, current, true);
    resultsRef.current.correct += 1;
    resultsRef.current.seen.add(current.thai);
    setIdx(i => (i + 1) % words.length);
    setFlipped(false);
  }, [user, current, words.length]);

  const handleStillLearning = useCallback(() => {
    if (!current) return;
    recordAnswer(user?.id, current, false);
    resultsRef.current.incorrect += 1;
    resultsRef.current.seen.add(current.thai);
    setIdx(i => (i + 1) % words.length);
    setFlipped(false);
  }, [user, current, words.length]);

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
      else if (e.key === 'Escape') handleClose();
      else if (e.key === '1' && flipped) handleKnowIt();
      else if (e.key === '2' && flipped) handleStillLearning();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goPrev, goNext, flip, handleClose, handleKnowIt, handleStillLearning, flipped]);

  if (!current) return null;

  const isStarred = starred.has(current.thai);

  return (
    <Dialog open onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent className="max-w-lg w-full p-0 gap-0 border border-border bg-background [&>button]:hidden">
        <DialogTitle className="sr-only">Study Mode</DialogTitle>

        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <span className="text-xs text-muted-foreground tracking-wide">{idx + 1} / {words.length}</span>
          <button
            onClick={handleClose}
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
          <div className={cn('card-wrapper activated w-full', flipped && 'flipped')} style={{ height: '300px' }}>
            <div className="card-inner">
              {/* Front */}
              <div className="card-face flex flex-col items-center justify-center border border-border bg-card rounded-lg p-8 gap-2">
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-lg" style={{ background: color }} />
                <div className={cn('text-[4rem] font-light text-foreground text-center leading-tight', THAI_FONT_CLASS[thaiFont] ?? 'font-thai-display')}>{current.thai}</div>
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
          {flipped ? (
            <>
              <button
                onClick={handleStillLearning}
                className="flex-1 py-2.5 rounded-lg border border-red-300 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 text-sm font-medium transition-colors cursor-pointer bg-transparent"
                title="Still learning (key: 2)"
              >
                Still learning
              </button>
              <button
                onClick={() => onToggleStar(current.thai)}
                className={cn(
                  'text-2xl transition-all bg-transparent border-none cursor-pointer hover:scale-110 px-1',
                  isStarred ? 'text-amber-500' : 'text-muted-foreground'
                )}
                aria-label={isStarred ? 'Unstar' : 'Star'}
              >
                {isStarred ? '★' : '☆'}
              </button>
              <button
                onClick={handleKnowIt}
                className="flex-1 py-2.5 rounded-lg border border-emerald-300 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-sm font-medium transition-colors cursor-pointer bg-transparent"
                title="Know it (key: 1)"
              >
                Know it ✓
              </button>
            </>
          ) : (
            <>
              <Button variant="outline" size="icon" className="h-12 w-12 text-2xl rounded-none" onClick={goPrev} aria-label="Previous">
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
              <Button variant="outline" size="icon" className="h-12 w-12 text-2xl rounded-none" onClick={goNext} aria-label="Next">
                ›
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
