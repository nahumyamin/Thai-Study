import { useState } from 'react';
import { topics } from '../data/vocab.js';
import { cn } from '@/lib/utils';

function SpeakerIcon({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
      <path d="M2 5H4.5L8 2V12L4.5 9H2V5Z" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M10 4.5C10.8 5.3 11.3 6.1 11.3 7C11.3 7.9 10.8 8.7 10 9.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export default function FlashCard({ word, starred, onToggleStar, onOpen, showRomaji = true }) {
  const [flipped, setFlipped] = useState(false);
  const [activated, setActivated] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const color = topics[word.topic]?.color || '#888';

  const handleClick = () => {
    if (onOpen) {
      onOpen();
      return;
    }
    if (!activated) {
      // Apply 3D context first, then flip on next frame so the transition fires
      setActivated(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setFlipped(true)));
    } else {
      setFlipped(f => !f);
    }
  };

  const handleStar = (e) => {
    e.stopPropagation();
    onToggleStar(word.thai);
  };

  const handleSpeak = (e) => {
    e.stopPropagation();
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(word.thai);
    utt.lang = 'th-TH';
    utt.rate = 0.85;
    utt.onstart = () => setSpeaking(true);
    utt.onend = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utt);
  };

  return (
    <div
      className={cn('card-wrapper', activated && 'activated', flipped && 'flipped')}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
    >
      <div className="card-inner">
        {/* Front */}
        <div className="card-face flex flex-col items-center justify-center border border-border bg-card rounded-lg p-4 select-none shadow-sm">
          {/* topic color strip */}
          <div className="absolute top-0 left-0 right-0 h-1 rounded-t-lg" style={{ background: color }} />
          <button
            onClick={handleStar}
            className={cn(
              'absolute top-3 left-2 text-xl leading-none p-1 z-[2] transition-all bg-transparent border-none cursor-pointer',
              starred ? 'text-amber-500' : 'text-muted-foreground hover:text-amber-500'
            )}
            aria-label={starred ? 'Unstar' : 'Star'}
          >
            {starred ? '★' : '☆'}
          </button>
          <div className="text-[1.75rem] font-light font-thai-display text-foreground text-center leading-snug mt-1">{word.thai}</div>
          <div className="absolute bottom-2 text-[0.7rem] text-muted-foreground tracking-wider uppercase">tap to flip</div>
          <button
            onClick={handleSpeak}
            className={cn(
              'absolute bottom-1.5 right-1.5 p-1.5 z-[2] bg-transparent border-none cursor-pointer transition-colors',
              speaking ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
            aria-label="Pronounce"
          >
            <SpeakerIcon active={speaking} />
          </button>
        </div>

        {/* Back */}
        <div className="card-face card-back card-back-rich flex flex-col items-center justify-center rounded-lg p-4 select-none">
          {/* topic color strip — subtle on dark bg */}
          <div className="absolute top-0 left-0 right-0 h-1 rounded-t-lg opacity-70" style={{ background: color }} />
          <div className="text-[1.1rem] font-serif font-normal text-center leading-snug mb-1">{word.en}</div>
          {showRomaji && <div className="text-[0.8rem] italic text-center opacity-55 leading-snug">{word.rom}</div>}
          {word.ex && <div className="text-[0.75rem] italic text-center opacity-45 leading-snug mt-1 px-2">{word.ex}</div>}
          <div className="absolute bottom-2 text-[0.65rem] tracking-widest uppercase opacity-40">
            {topics[word.topic]?.label || word.topic}
          </div>
          <button
            onClick={handleSpeak}
            className={cn(
              'absolute bottom-1.5 right-1.5 p-1.5 z-[2] bg-transparent border-none cursor-pointer transition-colors',
              speaking ? 'opacity-100' : 'opacity-40 hover:opacity-70'
            )}
            aria-label="Pronounce"
          >
            <SpeakerIcon active={speaking} />
          </button>
        </div>
      </div>
    </div>
  );
}
