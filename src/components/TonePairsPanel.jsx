import { useState } from 'react';
import { TONE_PAIRS, TONE_META, TONE_ORDER, TONE_PAIRS_INTRO } from '../data/pronunciation.js';
import { useRomaji } from '../context/RomajiContext.jsx';
import { cn } from '@/lib/utils';

// ── Text-to-speech ────────────────────────────────────────────────
function SpeakerBtn({ text, className = '' }) {
  const [playing, setPlaying] = useState(false);
  const handleClick = (e) => {
    e.stopPropagation();
    if (!window.speechSynthesis) return;
    setPlaying(true);
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'th-TH';
    utt.rate = 0.8;
    utt.onend = () => setPlaying(false);
    utt.onerror = () => setPlaying(false);
    window.speechSynthesis.speak(utt);
  };
  return (
    <button
      onClick={handleClick}
      aria-label={`Listen to ${text}`}
      title="Listen"
      className={cn(
        'relative flex items-center justify-center w-7 h-7 rounded-full border transition-colors shrink-0',
        playing
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-border text-muted-foreground hover:border-primary/50 hover:text-primary',
        className
      )}
    >
      {playing && (
        <span className="absolute inset-0 rounded-full animate-speaker-ripple border border-primary/30" />
      )}
      <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
        <path d="M2 5h2.5L8 2v10L4.5 9H2a1 1 0 01-1-1V6a1 1 0 011-1z" fill="currentColor" />
        <path d="M10 4.5c1 .8 1.5 1.5 1.5 2.5s-.5 1.7-1.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    </button>
  );
}

// ── Pitch-contour badge for a single tone ─────────────────────────
function ToneBadge({ tone }) {
  const meta = TONE_META[tone];
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full pl-1.5 pr-2.5 py-1 border', meta.chip, meta.ring)}>
      <svg className={cn('w-6 h-3.5', meta.text)} viewBox="0 0 80 40" dangerouslySetInnerHTML={{ __html: meta.svgPath }} />
      <span className="text-[0.7rem] font-semibold leading-none">{tone}</span>
    </span>
  );
}

export default function TonePairsPanel() {
  const { showRomaji } = useRomaji();
  const [activeFirst, setActiveFirst] = useState('all');

  const groups = activeFirst === 'all'
    ? TONE_PAIRS
    : TONE_PAIRS.filter(g => g.first === activeFirst);

  return (
    <div>
      <p className="text-sm text-muted-foreground leading-relaxed mb-6">{TONE_PAIRS_INTRO}</p>

      {/* Filter by first tone */}
      <div className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2">
        Filter by first syllable
      </div>
      <div className="flex flex-wrap gap-1.5 mb-8">
        <button
          onClick={() => setActiveFirst('all')}
          className={cn(
            'rounded-full px-3 py-1 text-xs font-semibold border transition-colors',
            activeFirst === 'all'
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border text-muted-foreground hover:text-foreground'
          )}
        >
          All
        </button>
        {TONE_ORDER.map(tone => {
          const meta = TONE_META[tone];
          const active = activeFirst === tone;
          return (
            <button
              key={tone}
              onClick={() => setActiveFirst(tone)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border transition-colors',
                active ? meta.chip : 'border-border text-muted-foreground hover:text-foreground',
                active ? meta.ring : ''
              )}
            >
              <span className={cn('w-2 h-2 rounded-full', meta.dot)} />
              {tone}
            </button>
          );
        })}
      </div>

      {/* Tone-pair groups */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map(group => (
          <div key={`${group.first}-${group.second}`} className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
              <ToneBadge tone={group.first} />
              <span className="text-muted-foreground/40 text-sm">+</span>
              <ToneBadge tone={group.second} />
            </div>
            <ul className="divide-y divide-border/50">
              {group.words.map(w => (
                <li key={w.thai} className="flex items-center gap-3 px-4 py-2.5">
                  <SpeakerBtn text={w.thai} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="font-thai-display text-lg text-foreground leading-snug">{w.thai}</span>
                      {showRomaji && <span className="text-xs italic text-muted-foreground">{w.rom}</span>}
                    </div>
                    <div className="text-xs text-muted-foreground">{w.en}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
