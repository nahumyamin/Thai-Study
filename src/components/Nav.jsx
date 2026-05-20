import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const STUDY_PAGES = [
  { id: 'cards', label: 'Flashcards' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'rush', label: 'Class Rush' },
  { id: 'scramble', label: 'Scramble' },
  { id: 'passages', label: 'Passages' },
];

const REFERENCE_PAGES = [
  { id: 'grammar', label: 'Grammar' },
  { id: 'pronunciation', label: 'Pronunciation' },
  { id: 'months', label: 'Months' },
  { id: 'classifiers', label: 'Classifiers' },
  { id: 'numbers', label: 'Numbers' },
  { id: 'tones',   label: 'Tones' },
];

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
      <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 10L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function Nav({ activePage, activeGroup, showPage, onSearch }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (page) => {
    showPage(page);
    setMenuOpen(false);
  };

  const groupTabClass = (group) => cn(
    'text-xs font-semibold uppercase tracking-widest px-4 py-3 border-b-2 transition-all whitespace-nowrap bg-transparent border-x-0 border-t-0 cursor-pointer',
    activeGroup === group
      ? 'text-white border-amber-400'
      : 'text-white/50 hover:text-white/85 border-transparent'
  );

  const subTabClass = (pageId) => cn(
    'text-xs uppercase tracking-wide px-[0.9rem] py-[0.6rem] border-b-2 transition-all whitespace-nowrap bg-transparent border-x-0 border-t-0 cursor-pointer',
    activePage === pageId
      ? 'text-white border-amber-400'
      : 'text-white/50 hover:text-white/85 border-transparent'
  );

  const subPages = activeGroup === 'study' ? STUDY_PAGES : REFERENCE_PAGES;

  return (
    <nav className="bg-zinc-900 text-white sticky top-0 z-50 border-b border-white/10">
      {/* Row 1: brand + group tabs + theme toggle */}
      <div className="flex items-center px-5 border-b border-white/[0.08]">
        <button
          onClick={() => handleNav('home')}
          className="font-serif text-sm text-white/90 py-3 whitespace-nowrap shrink-0 bg-transparent cursor-pointer hover:text-white transition-colors pr-4 mr-2 border-r border-white/15"
        >
          Thai <em className="text-amber-400 not-italic">Study</em>
        </button>

        {/* Desktop group tabs */}
        <div className={cn('items-center', activePage === 'home' ? 'hidden' : 'hidden sm:flex')}>
          <button className={groupTabClass('study')} onClick={() => handleNav('cards')}>
            Study
          </button>
          <button className={groupTabClass('reference')} onClick={() => handleNav('grammar')}>
            Reference
          </button>
        </div>

        {/* Search + mobile hamburger */}
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={onSearch}
            className="p-2.5 text-white/60 hover:text-white transition-colors"
            aria-label="Search"
          >
            <SearchIcon />
          </button>
          <div className="sm:hidden">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <button
                className="flex flex-col gap-[5px] items-center justify-center p-2"
                aria-label="Menu"
              >
                <span className="block w-5 h-0.5 bg-white/80 rounded-sm transition-all" />
                <span className="block w-5 h-0.5 bg-white/80 rounded-sm transition-all" />
                <span className="block w-5 h-0.5 bg-white/80 rounded-sm transition-all" />
              </button>
            </SheetTrigger>
            <SheetContent side="top" className="bg-zinc-900 border-none p-0 pt-0">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col py-2">
                <span className={cn(
                  'px-5 py-2 text-[0.68rem] font-bold tracking-[0.1em] uppercase',
                  activeGroup === 'study' ? 'text-amber-400' : 'text-white/40'
                )}>
                  Study
                </span>
                {STUDY_PAGES.map(p => (
                  <button
                    key={p.id}
                    className={cn(
                      'text-left px-7 py-[0.65rem] text-sm tracking-[0.02em] border-l-[3px] transition-all',
                      activePage === p.id
                        ? 'text-white border-amber-400 bg-white/[0.06]'
                        : 'text-white/65 border-transparent'
                    )}
                    onClick={() => handleNav(p.id)}
                  >
                    {p.label}
                  </button>
                ))}

                <div className="h-px bg-white/[0.08] my-1.5" />

                <span className={cn(
                  'px-5 py-2 text-[0.68rem] font-bold tracking-[0.1em] uppercase',
                  activeGroup === 'reference' ? 'text-amber-400' : 'text-white/40'
                )}>
                  Reference
                </span>
                {REFERENCE_PAGES.map(p => (
                  <button
                    key={p.id}
                    className={cn(
                      'text-left px-7 py-[0.65rem] text-sm tracking-[0.02em] border-l-[3px] transition-all',
                      activePage === p.id
                        ? 'text-white border-amber-400 bg-white/[0.06]'
                        : 'text-white/65 border-transparent'
                    )}
                    onClick={() => handleNav(p.id)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
          </div>
        </div>
      </div>

      {/* Row 2: sub-tabs (desktop only, hidden on home) */}
      <div className={cn('items-center px-5 bg-black/[0.18] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden', activePage === 'home' ? 'hidden' : 'hidden sm:flex')}>
        {subPages.map(p => (
          <button key={p.id} className={subTabClass(p.id)} onClick={() => handleNav(p.id)}>
            {p.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
