import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ClassBadge from '@/components/ClassBadge.jsx';
import { finalInfo } from '../data/consonants.js';
import { cn } from '@/lib/utils';

const CLASS_LABEL = { low: 'Low', mid: 'Mid', high: 'High' };
const CLASS_STRIP = { low: '#16a34a', mid: '#2563eb', high: '#b91c1c' };

export default function ConsonantStudyModal({ cards, onClose }) {
  const [deck, setDeck] = useState(cards);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);
  const [known, setKnown] = useState(() => new Set());
  const [learning, setLearning] = useState(() => new Set());

  const current = deck[idx];

  const flip = useCallback(() => setFlipped(f => !f), []);
  const goPrev = useCallback(() => { setIdx(i => Math.max(0, i - 1)); setFlipped(false); }, []);
  const goNext = useCallback(() => { setIdx(i => Math.min(deck.length - 1, i + 1)); setFlipped(false); }, [deck.length]);

  const grade = useCallback((isKnown) => {
    if (!current) return;
    const L = current.l;
    setKnown(prev => { const n = new Set(prev); if (isKnown) n.add(L); else n.delete(L); return n; });
    setLearning(prev => { const n = new Set(prev); if (isKnown) n.delete(L); else n.add(L); return n; });
    if (idx + 1 < deck.length) { setIdx(idx + 1); setFlipped(false); }
    else { setDone(true); }
  }, [current, idx, deck.length]);

  const restart = useCallback((nextDeck) => {
    setDeck(nextDeck);
    setIdx(0);
    setFlipped(false);
    setDone(false);
    setKnown(new Set());
    setLearning(new Set());
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (done) return;
      if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'ArrowRight') goNext();
      else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(); }
      else if (e.key === '1' && flipped) grade(true);
      else if (e.key === '2' && flipped) grade(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goPrev, goNext, flip, grade, onClose, flipped, done]);

  if (!current && !done) return null;

  // ── Session summary ───────────────────────────────────────────────
  if (done) {
    const learnCards = cards.filter(c => learning.has(c.l));
    return (
      <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
        <DialogContent className="max-w-lg w-full p-0 gap-0 border border-border bg-background [&>button]:hidden">
          <DialogTitle className="sr-only">Study session complete</DialogTitle>
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-xs text-muted-foreground tracking-wide">Session complete</span>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg leading-none px-1 bg-transparent border-none cursor-pointer transition-colors" aria-label="Close">✕</button>
          </div>

          <div className="px-6 py-8 text-center">
            <div className="font-serif text-6xl italic text-primary leading-none mb-1">{known.size}/{deck.length}</div>
            <div className="text-sm text-muted-foreground mb-6">marked “Know it”</div>

            {learnCards.length > 0 ? (
              <div className="text-left mb-6">
                <div className="text-[0.72rem] font-semibold tracking-widest uppercase text-muted-foreground mb-2 pb-2 border-b border-border">
                  Still learning ({learnCards.length})
                </div>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(56px,1fr))] gap-1.5">
                  {learnCards.map((c, i) => (
                    <div key={i} className="text-center py-2 rounded border border-border">
                      <div className="font-thai-display text-2xl text-foreground leading-none">{c.l}</div>
                      <div className="text-[0.58rem] text-muted-foreground mt-0.5">{c.cls}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mb-6">🎉 You knew every card!</p>
            )}

            <div className="flex flex-col gap-2">
              {learnCards.length > 0 && (
                <Button onClick={() => restart(learnCards)}>Review still learning ({learnCards.length})</Button>
              )}
              <Button variant="outline" onClick={() => restart(cards)}>Study all again</Button>
              <Button variant="ghost" onClick={onClose}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // ── Card view ─────────────────────────────────────────────────────
  const fin = finalInfo(current.l);
  const strip = CLASS_STRIP[current.cls];

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-lg w-full p-0 gap-0 border border-border bg-background [&>button]:hidden">
        <DialogTitle className="sr-only">Consonant Study Mode</DialogTitle>

        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <span className="text-xs text-muted-foreground tracking-wide">{idx + 1} / {deck.length}</span>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg leading-none px-1 bg-transparent border-none cursor-pointer transition-colors" aria-label="Close">✕</button>
        </div>

        {/* Card area */}
        <div className="flex items-center justify-center p-2 min-h-[320px] cursor-pointer relative" onClick={flip}>
          <div className={cn('card-wrapper activated w-full', flipped && 'flipped')} style={{ height: '300px' }}>
            <div className="card-inner">
              {/* Front */}
              <div className="card-face flex flex-col items-center justify-center border border-border bg-card rounded-lg p-8 gap-2">
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-lg" style={{ background: strip }} />
                <ClassBadge cls={current.cls} className="absolute top-3 left-3" />
                <div className="font-thai-display text-[5rem] font-light text-foreground leading-none">{current.l}</div>
                <div className="absolute bottom-3 text-[0.72rem] text-muted-foreground tracking-widest uppercase">tap to flip</div>
              </div>

              {/* Back */}
              <div className="card-face card-back card-back-rich flex flex-col items-center justify-center rounded-lg p-8 gap-1.5">
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-lg opacity-70" style={{ background: strip }} />
                <div className="text-sm italic opacity-60">{current.name}</div>
                <div className="flex items-center gap-2">
                  <ClassBadge cls={current.cls} label={CLASS_LABEL[current.cls]} />
                  <span className="text-xl font-semibold">/{current.sound}/</span>
                </div>
                <div className="text-center mt-1">
                  <div className="text-[0.7rem] uppercase tracking-widest opacity-50">as a final</div>
                  {fin ? (
                    <div className="text-base">
                      <span className="font-semibold">/{fin.final}/</span>
                      {' · '}
                      <span className={cn('font-bold', fin.syllable === 'dead' ? 'text-red-400' : 'text-emerald-400')}>
                        {fin.syllable === 'dead' ? 'Dead' : 'Live'}
                      </span>
                      <span className="opacity-70"> syllable</span>
                    </div>
                  ) : (
                    <div className="text-sm opacity-70">not used as a final</div>
                  )}
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
                onClick={() => grade(false)}
                className="flex-1 py-2.5 rounded-lg border border-red-300 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 text-sm font-medium transition-colors cursor-pointer bg-transparent"
                title="Still learning (key: 2)"
              >
                Still learning
              </button>
              <button
                onClick={() => grade(true)}
                className="flex-1 py-2.5 rounded-lg border border-emerald-300 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-sm font-medium transition-colors cursor-pointer bg-transparent"
                title="Know it (key: 1)"
              >
                Know it ✓
              </button>
            </>
          ) : (
            <>
              <Button variant="outline" size="icon" className="h-12 w-12 text-2xl rounded-none" onClick={goPrev} disabled={idx === 0} aria-label="Previous">‹</Button>
              <span className="text-xs text-muted-foreground tracking-wide">tap card to flip</span>
              <Button variant="outline" size="icon" className="h-12 w-12 text-2xl rounded-none" onClick={goNext} disabled={idx === deck.length - 1} aria-label="Next">›</Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
