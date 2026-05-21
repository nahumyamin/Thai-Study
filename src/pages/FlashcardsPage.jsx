import { useState, useMemo } from 'react';
import { allVocab, topics } from '../data/vocab.js';
import FlashCard from '../components/FlashCard.jsx';
import StudyModal from '../components/StudyModal.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function FlashcardsPage({ starred, toggleStar, showRomaji = true }) {
  const [search, setSearch] = useState('');
  const [activeTopic, setActiveTopic] = useState('all');
  const [showStarred, setShowStarred] = useState(false);
  const [order, setOrder] = useState(allVocab);
  const [studyOpen, setStudyOpen] = useState(false);
  const [studyIndex, setStudyIndex] = useState(0);

  // Word count per topic (unfiltered totals for the pill badges)
  const topicCounts = useMemo(() => {
    const counts = { all: allVocab.length };
    for (const w of allVocab) counts[w.topic] = (counts[w.topic] ?? 0) + 1;
    return counts;
  }, []);

  const filtered = useMemo(() => {
    let list = order;
    if (showStarred) list = list.filter(w => starred.has(w.thai));
    if (activeTopic !== 'all') list = list.filter(w => w.topic === activeTopic);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(w =>
        w.thai.includes(q) ||
        w.rom.toLowerCase().includes(q) ||
        w.en.toLowerCase().includes(q)
      );
    }
    return list;
  }, [order, showStarred, activeTopic, search, starred]);

  const handleShuffle = () => {
    setOrder(prev => shuffle(prev));
  };

  const openStudyMode = (idx = 0) => {
    setStudyIndex(idx);
    setStudyOpen(true);
  };

  const myListBtn = (extraClass = '') => (
    <Button
      size="sm"
      variant="outline"
      onClick={() => setShowStarred(s => !s)}
      className={cn(extraClass, showStarred ? 'bg-amber-500 border-amber-500 text-white hover:bg-amber-500' : '')}
    >
      ★ My List
      <span className="ml-1 inline-flex items-center justify-center rounded-full bg-amber-500 text-white text-[0.65rem] font-bold px-1.5 min-w-[1.1rem] leading-[1.4]">
        {starred.size}
      </span>
    </Button>
  );

  const studyBtn = (extraClass = '') => (
    <Button size="sm" variant="outline" className={extraClass} onClick={() => openStudyMode(0)}>
      ▶ Study Mode
    </Button>
  );

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-8">
      {/* Title row — buttons on right on desktop */}
      <div className="flex items-start justify-between gap-4 mb-1">
        <h1 className="text-3xl font-serif font-normal">
          Thai <em className="text-primary not-italic font-medium">Flashcards</em>
        </h1>
        <div className="hidden md:flex items-center gap-2 mt-1 shrink-0">
          {myListBtn()}
          {studyBtn()}
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{filtered.length} words</p>

      {/* Mobile: full-width half/half buttons below title */}
      <div className="flex gap-2 md:hidden mb-5">
        {myListBtn('flex-1 justify-center')}
        {studyBtn('flex-1')}
      </div>

      {/* Search row */}
      <div className="flex gap-2 mb-3">
        <Input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search Thai, pronunciation, or English…"
          className="flex-1"
        />
        <Button onClick={handleShuffle}>Shuffle</Button>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[['all', 'All'], ...Object.entries(topics).map(([k, v]) => [k, v.label])].map(([key, label]) => {
          const active = activeTopic === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTopic(key)}
              className={cn(
                'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors border',
                active
                  ? 'bg-primary/10 border-primary/40 text-foreground'
                  : 'bg-transparent border-border text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              {label}
              <span className={cn(
                'text-[0.65rem] font-mono rounded-full px-1.5 leading-5 min-w-[1.25rem] text-center tabular-nums',
                active ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
              )}>
                {topicCounts[key] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground text-center mb-2">Tap any card to reveal translation &amp; pronunciation</p>

      {/* Card grid */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3 mt-6">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground py-12 italic">No cards match your filter.</div>
        ) : (
          filtered.map((word, i) => (
            <FlashCard
              key={word.thai + i}
              word={word}
              starred={starred.has(word.thai)}
              onToggleStar={toggleStar}
              showRomaji={showRomaji}
            />
          ))
        )}
      </div>

      {studyOpen && filtered.length > 0 && (
        <StudyModal
          words={filtered}
          initialIndex={studyIndex}
          starred={starred}
          onToggleStar={toggleStar}
          onClose={() => setStudyOpen(false)}
          showRomaji={showRomaji}
        />
      )}
    </div>
  );
}
