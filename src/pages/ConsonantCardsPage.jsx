import { useState, useMemo } from 'react';
import { CONSONANTS, finalInfo } from '../data/consonants.js';
import { track } from '@/lib/analytics.js';
import ClassBadge from '@/components/ClassBadge.jsx';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const CLASS_LABEL = { low: 'Low', mid: 'Mid', high: 'High' };

const CLASS_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'low', label: 'Low' },
  { key: 'mid', label: 'Mid' },
  { key: 'high', label: 'High' },
];

function ConsonantCard({ c }) {
  const [flipped, setFlipped] = useState(false);
  const [activated, setActivated] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const fin = finalInfo(c.l);

  const handleClick = () => {
    if (!activated) {
      setActivated(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setFlipped(true)));
    } else {
      setFlipped(f => !f);
    }
  };

  const handleSpeak = (e) => {
    e.stopPropagation();
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(c.l);
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
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); } }}
    >
      <div className="card-inner">
        {/* Front — just the letter */}
        <div className="card-face flex flex-col items-center justify-center border border-border bg-card rounded-lg p-4 select-none shadow-sm">
          <ClassBadge cls={c.cls} className="absolute top-2 left-2" />
          <div className="font-thai-display text-[3.5rem] font-light text-foreground leading-none">{c.l}</div>
          <div className="absolute bottom-2 text-[0.7rem] text-muted-foreground tracking-wider uppercase">tap to flip</div>
        </div>

        {/* Back — class, sound, dead/live final */}
        <div className="card-face card-back card-back-rich flex flex-col items-center justify-center rounded-lg p-4 select-none">
          <div className="text-[0.8rem] italic opacity-60 mb-1">{c.name}</div>
          <div className="flex items-center gap-2 mb-2">
            <ClassBadge cls={c.cls} label={CLASS_LABEL[c.cls]} />
            <span className="text-[0.95rem] font-semibold">/{c.sound}/</span>
          </div>
          <Separator className="my-1 w-2/3 opacity-20" />
          {fin ? (
            <div className="text-center leading-snug">
              <div className="text-[0.7rem] uppercase tracking-widest opacity-50">as a final</div>
              <div className="text-[0.9rem]">
                <span className="font-semibold">/{fin.final}/</span>
                {' · '}
                <span className={cn('font-bold', fin.syllable === 'dead' ? 'text-red-400' : 'text-emerald-400')}>
                  {fin.syllable === 'dead' ? 'Dead' : 'Live'}
                </span>
                <span className="opacity-70"> syllable</span>
              </div>
            </div>
          ) : (
            <div className="text-center leading-snug">
              <div className="text-[0.7rem] uppercase tracking-widest opacity-50">as a final</div>
              <div className="text-[0.85rem] opacity-70">not used as a final</div>
            </div>
          )}
          <button
            onClick={handleSpeak}
            className={cn(
              'absolute bottom-1.5 right-1.5 p-1.5 z-[2] bg-transparent border-none cursor-pointer transition-opacity text-[0.7rem] uppercase tracking-wider',
              speaking ? 'opacity-100' : 'opacity-40 hover:opacity-70'
            )}
            aria-label="Pronounce"
          >
            🔊
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ConsonantCardsPage() {
  const [activeClass, setActiveClass] = useState('all');

  const counts = useMemo(() => {
    const c = { all: CONSONANTS.length, low: 0, mid: 0, high: 0 };
    for (const k of CONSONANTS) c[k.cls] = (c[k.cls] ?? 0) + 1;
    return c;
  }, []);

  const filtered = useMemo(
    () => (activeClass === 'all' ? CONSONANTS : CONSONANTS.filter(c => c.cls === activeClass)),
    [activeClass]
  );

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-8">
      <h1 className="text-3xl font-serif font-normal mb-1">
        Consonant <em className="text-primary not-italic font-medium">Cards</em>
      </h1>
      <Separator className="mb-6" />

      <p className="text-sm text-muted-foreground leading-relaxed max-w-[560px] mb-3">
        Flip each consonant to see its <strong>class</strong>, the <strong>sound</strong> it makes, and the
        kind of syllable it forms as a final. Stop finals (/k/, /p/, /t/) make a{' '}
        <span className="text-red-600 dark:text-red-400 font-semibold">dead</span> syllable;
        sonorant finals (/ng/, /n/, /m/, /y/, /w/) make a{' '}
        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">live</span> one.
      </p>
      <p className="text-xs text-muted-foreground mb-6">
        Six consonants — ฉ ผ ฝ ห อ ฮ — are never used as a final.
      </p>

      {/* Class filter */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {CLASS_FILTERS.map(({ key, label }) => (
          <Button
            key={key}
            size="sm"
            variant={activeClass === key ? 'default' : 'outline'}
            onClick={() => { setActiveClass(key); if (key !== 'all') track('filter_class', { game: 'consonant_cards', cls: key }); }}
          >
            {label}
            <span className="ml-1.5 text-[0.65rem] opacity-70 tabular-nums">{counts[key] ?? 0}</span>
          </Button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground text-center mb-4">Tap any card to flip it</p>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3">
        {filtered.map((c, i) => (
          <ConsonantCard key={c.l + i} c={c} />
        ))}
      </div>
    </div>
  );
}
