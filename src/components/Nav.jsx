import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const CULTURE_PAGES = [
  { id: 'culture',   label: 'Anthems'   },
  { id: 'idioms',    label: 'Idioms'    },
  { id: 'festivals', label: 'Festivals' },
];

const STUDY_PAGES = [
  { id: 'cards',    label: 'Flashcards' },
  { id: 'quiz',     label: 'Quiz' },
  { id: 'rush',     label: 'Class Rush' },
  { id: 'scramble', label: 'Scramble' },
  { id: 'passages', label: 'Passages' },
  { id: 'months',   label: 'Months' },
];

const REFERENCE_PAGES = [
  { id: 'grammar',       label: 'Grammar' },
  { id: 'pronunciation', label: 'Pronunciation' },
  { id: 'classifiers',   label: 'Numbers & Classifiers' },
  { id: 'reading',       label: 'Reading Strategies' },
];

function CoffeeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
      <line x1="6" y1="1" x2="6" y2="4" />
      <line x1="10" y1="1" x2="10" y2="4" />
      <line x1="14" y1="1" x2="14" y2="4" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
      <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 10L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2"    x2="12" y2="5"    />
      <line x1="12" y1="19"   x2="12" y2="22"   />
      <line x1="4.22" y1="4.22"   x2="6.34" y2="6.34"   />
      <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
      <line x1="2"  y1="12"   x2="5"    y2="12"   />
      <line x1="19" y1="12"   x2="22"   y2="12"   />
      <line x1="4.22" y1="19.78"  x2="6.34" y2="17.66"  />
      <line x1="17.66" y1="6.34"  x2="19.78" y2="4.22"  />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function Nav({ activePage, activeGroup, showPage, onSearch, theme, onToggleTheme, showRomaji, onToggleRomaji }) {
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

  const subPages = activeGroup === 'study' ? STUDY_PAGES
    : activeGroup === 'culture' ? CULTURE_PAGES
    : REFERENCE_PAGES;

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
        <div className="hidden sm:flex items-center">
          <button className={groupTabClass('study')} onClick={() => handleNav('cards')}>
            Study
          </button>
          <button className={groupTabClass('reference')} onClick={() => handleNav('grammar')}>
            Reference
          </button>
          <button className={groupTabClass('culture')} onClick={() => handleNav('culture')}>
            Culture
          </button>
        </div>

        {/* Search + mobile hamburger */}
        <div className="ml-auto flex items-center gap-1">
          <a
            href="https://buymeacoffee.com/randomnoise"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 text-amber-400/70 hover:text-amber-400 transition-colors"
            aria-label="Buy me a coffee"
            title="Buy me a coffee"
          >
            <CoffeeIcon />
          </a>
          <button
            onClick={onSearch}
            className="p-2.5 text-white/60 hover:text-white transition-colors"
            aria-label="Search"
          >
            <SearchIcon />
          </button>
          <button
            onClick={onToggleRomaji}
            className={cn(
              'px-2 py-1.5 text-[0.6rem] font-bold tracking-widest uppercase rounded transition-colors',
              showRomaji ? 'text-amber-400' : 'text-white/30 hover:text-white/60'
            )}
            aria-label={showRomaji ? 'Hide romanization' : 'Show romanization'}
            title={showRomaji ? 'Hide romanization' : 'Show romanization'}
          >
            rōm
          </button>
          <button
            onClick={onToggleTheme}
            className="p-2.5 text-white/60 hover:text-white transition-colors"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
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

                <div className="h-px bg-white/[0.08] my-1.5" />

                <span className={cn(
                  'px-5 py-2 text-[0.68rem] font-bold tracking-[0.1em] uppercase',
                  activeGroup === 'culture' ? 'text-amber-400' : 'text-white/40'
                )}>
                  Culture
                </span>
                {CULTURE_PAGES.map(p => (
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
      <div className={cn('items-center px-5 bg-black/[0.18] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden', activePage === 'home' ? 'hidden' : 'hidden sm:flex')} aria-hidden={activePage === 'home'}>
        {subPages.map(p => (
          <button key={p.id} className={subTabClass(p.id)} onClick={() => handleNav(p.id)}>
            {p.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
