import { useState } from 'react';
import { topics } from '../data/vocab.js';
import { cn } from '@/lib/utils';

export default function FlashCard({ word, starred, onToggleStar, onOpen }) {
  const [flipped, setFlipped] = useState(false);
  const color = topics[word.topic]?.color || '#888';

  const handleClick = () => {
    if (onOpen) {
      onOpen();
    } else {
      setFlipped(f => !f);
    }
  };

  const handleStar = (e) => {
    e.stopPropagation();
    onToggleStar(word.thai);
  };

  return (
    <div
      className={cn('card-wrapper', flipped && 'flipped')}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
    >
      <div className="card-inner">
        {/* Front */}
        <div className="card-face flex flex-col items-center justify-center border border-border bg-card rounded-lg p-4 select-none">
          <button
            onClick={handleStar}
            className={cn(
              'absolute top-2 left-2 text-sm leading-none p-0.5 z-[2] transition-all bg-transparent border-none cursor-pointer',
              starred ? 'text-amber-500' : 'text-muted-foreground hover:text-amber-500'
            )}
            aria-label={starred ? 'Unstar' : 'Star'}
          >
            {starred ? '★' : '☆'}
          </button>
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ background: color }} />
          <div className="text-[1.75rem] font-light text-foreground text-center leading-snug">{word.thai}</div>
          <div className="absolute bottom-2 text-[0.7rem] text-muted-foreground tracking-wider uppercase">tap to flip</div>
        </div>

        {/* Back */}
        <div className="card-face card-back flex flex-col items-center justify-center bg-foreground text-background rounded-lg p-4 select-none">
          <div className="text-[1.1rem] font-serif font-normal text-center leading-snug mb-1">{word.en}</div>
          <div className="text-[0.8rem] italic text-center opacity-60 leading-snug">{word.rom}</div>
          {word.ex && <div className="text-[0.75rem] italic text-center opacity-50 leading-snug mt-1 px-2">{word.ex}</div>}
          <div className="absolute bottom-2 text-[0.7rem] tracking-widest uppercase opacity-50">
            {topics[word.topic]?.label || word.topic}
          </div>
        </div>
      </div>
    </div>
  );
}
