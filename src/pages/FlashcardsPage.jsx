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

export default function FlashcardsPage({ starred, toggleStar }) {
  const [search, setSearch] = useState('');
  const [activeTopic, setActiveTopic] = useState('all');
  const [showStarred, setShowStarred] = useState(false);
  const [order, setOrder] = useState(allVocab);
  const [studyOpen, setStudyOpen] = useState(false);
  const [studyIndex, setStudyIndex] = useState(0);

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

  return (
    <div className="max-w-3xl mx-auto px-5 py-8">
      <h1 className="text-3xl font-serif font-normal mb-1">
        Thai <em className="text-primary not-italic font-medium">Flashcards</em>
      </h1>
      <p className="text-sm text-muted-foreground mb-6">{filtered.length} words</p>

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
      <div className="flex flex-wrap gap-1.5 mb-3">
        <Button
          size="sm"
          variant={activeTopic === 'all' ? 'default' : 'outline'}
          onClick={() => setActiveTopic('all')}
        >
          All
        </Button>
        {Object.entries(topics).map(([key, val]) => (
          <Button
            key={key}
            size="sm"
            variant={activeTopic === key ? 'default' : 'outline'}
            onClick={() => setActiveTopic(key)}
            style={activeTopic === key ? { background: val.color, borderColor: val.color, color: '#fff' } : undefined}
          >
            {val.label}
          </Button>
        ))}
      </div>

      {/* My List + Study Mode row */}
      <div className="flex items-center gap-2 mb-3">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowStarred(s => !s)}
          className={showStarred ? 'bg-amber-500 border-amber-500 text-white hover:bg-amber-500' : ''}
        >
          ★ My List
          <span className="ml-1 inline-flex items-center justify-center rounded-full bg-amber-500 text-white text-[0.65rem] font-bold px-1.5 min-w-[1.1rem] leading-[1.4]">
            {starred.size}
          </span>
        </Button>
        <Button size="sm" variant="outline" onClick={() => openStudyMode(0)}>
          ▶ Study Mode
        </Button>
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
        />
      )}
    </div>
  );
}
