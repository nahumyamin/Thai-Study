import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { supabase } from '../lib/supabase.js';
import { getLevel } from '../lib/gamification.js';
import { STUDY_HUBS, hubForPage } from '../data/studyHubs.js';

const CULTURE_PAGES = [
  { id: 'culture',   label: 'Anthems'   },
  { id: 'idioms',    label: 'Idioms'    },
  { id: 'festivals', label: 'Festivals' },
  { id: 'food',      label: 'Food'      },
];

const STUDY_PAGES = STUDY_HUBS.map(h => ({ id: h.id, label: h.label }));

const REFERENCE_PAGES = [
  { id: 'grammar',       label: 'Grammar' },
  { id: 'pronunciation', label: 'Pronunciation' },
  { id: 'classifiers',   label: 'Numbers & Classifiers' },
  { id: 'reading',       label: 'Reading Strategies' },
  { id: 'register',      label: 'Registers' },
  { id: 'playbooks',    label: 'Playbooks' },
];

function KofiIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
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

export default function Nav({ activePage, activeGroup, showPage, onSearch, theme, onToggleTheme, showRomaji, onToggleRomaji, user, onSignOut }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [navProfile, setNavProfile] = useState(null);
  const profileRef = useRef(null);

  const handleNav = (page) => {
    showPage(page);
    setMenuOpen(false);
  };

  // Fetch lightweight profile data for the mobile menu level display
  useEffect(() => {
    if (!user || !supabase) { setNavProfile(null); return; }
    supabase.from('profiles')
      .select('display_name, total_xp, streak_count')
      .eq('id', user.id)
      .single()
      .then(({ data }) => setNavProfile(data));
  }, [user]);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Close desktop profile dropdown on outside click
  useEffect(() => {
    if (!profileOpen) return;
    function handler(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [profileOpen]);

  const groupTabClass = (group) => cn(
    'text-xs font-semibold uppercase tracking-widest px-4 py-3 border-b-2 transition-all whitespace-nowrap bg-transparent border-x-0 border-t-0 cursor-pointer',
    activeGroup === group
      ? 'text-white border-amber-400'
      : 'text-white/50 hover:text-white/85 border-transparent'
  );

  // In the Study group, a tool page (e.g. quiz) should light up its parent hub tab.
  const subActivePage = activeGroup === 'study' ? hubForPage(activePage) : activePage;

  const subTabClass = (pageId) => cn(
    'text-xs uppercase tracking-wide px-[0.9rem] py-[0.6rem] border-b-2 transition-all whitespace-nowrap bg-transparent border-x-0 border-t-0 cursor-pointer',
    subActivePage === pageId
      ? 'text-white border-amber-400'
      : 'text-white/50 hover:text-white/85 border-transparent'
  );

  const subPages = activeGroup === 'study'    ? STUDY_PAGES
    : activeGroup === 'culture'   ? CULTURE_PAGES
    : activeGroup === 'about'     ? []
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
          <button className={groupTabClass('study')} onClick={() => handleNav(STUDY_PAGES[0].id)}>
            Study
          </button>
          <button className={groupTabClass('reference')} onClick={() => handleNav('grammar')}>
            Reference
          </button>
          <button className={groupTabClass('culture')} onClick={() => handleNav('culture')}>
            Culture
          </button>
          <button className={groupTabClass('about')} onClick={() => handleNav('about')}>
            About
          </button>
        </div>

        {/* Search + mobile hamburger */}
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => handleNav('about')}
            className="p-2.5 text-amber-400/70 hover:text-amber-400 transition-colors cursor-pointer bg-transparent border-none"
            aria-label="About"
            title="About"
          >
            <KofiIcon />
          </button>
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
          {/* Profile / sign-in — far right on desktop, hidden on mobile */}
          <div className="hidden sm:flex items-center ml-1" ref={profileRef}>
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(o => !o)}
                  className="p-1 rounded-full overflow-hidden border-2 border-transparent hover:border-amber-400 transition-colors cursor-pointer"
                  aria-label="Account menu"
                >
                  {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="avatar" className="w-6 h-6 rounded-full" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center text-xs font-bold text-zinc-900">
                      {(user.email?.[0] ?? '?').toUpperCase()}
                    </div>
                  )}
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-white/10 bg-zinc-800 shadow-xl overflow-hidden z-50">
                    <button
                      onClick={() => { setProfileOpen(false); handleNav('dashboard'); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
                    >
                      Dashboard
                    </button>
                    <div className="h-px bg-white/10" />
                    <button
                      onClick={() => { setProfileOpen(false); onSignOut(); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-white/50 hover:bg-white/10 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleNav('login')}
                className="text-[0.65rem] font-semibold tracking-wider uppercase px-2.5 py-1.5 rounded-md bg-amber-400/10 text-amber-400 hover:bg-amber-400/20 transition-colors cursor-pointer border-none"
              >
                Sign in
              </button>
            )}
          </div>
          <div className="sm:hidden">
            {/* Hamburger trigger */}
            <button
              className="flex flex-col gap-[5px] items-center justify-center p-2"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
            >
              <span className="block w-5 h-0.5 bg-white/80 rounded-sm" />
              <span className="block w-5 h-0.5 bg-white/80 rounded-sm" />
              <span className="block w-5 h-0.5 bg-white/80 rounded-sm" />
            </button>

            {/* Full-screen overlay */}
            {menuOpen && (
              <div className="fixed inset-0 z-[200] bg-zinc-900 flex flex-col">
                {/* Top bar with X */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 shrink-0">
                  <button
                    onClick={() => handleNav('home')}
                    className="font-serif text-sm text-white/90 bg-transparent border-none cursor-pointer hover:text-white transition-colors"
                  >
                    Thai <em className="text-amber-400 not-italic">Study</em>
                  </button>
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="text-white/60 hover:text-white transition-colors bg-transparent border-none cursor-pointer p-1 text-xl leading-none"
                    aria-label="Close menu"
                  >
                    ✕
                  </button>
                </div>

                {/* Scrollable nav list */}
                <div className="flex-1 overflow-y-auto py-2">

                  {/* ── Profile / sign-in — top of menu ── */}
                  {user ? (() => {
                    const xp = navProfile?.total_xp ?? 0;
                    const { level, label } = getLevel(xp);
                    const streak = navProfile?.streak_count ?? 0;
                    const firstName = navProfile?.display_name?.split(' ')[0]
                      ?? user.email?.split('@')[0]
                      ?? 'Profile';
                    return (
                      <button
                        onClick={() => handleNav('dashboard')}
                        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-white/5 transition-colors cursor-pointer bg-transparent border-none"
                      >
                        {/* Avatar */}
                        {user.user_metadata?.avatar_url ? (
                          <img
                            src={user.user_metadata.avatar_url}
                            alt="avatar"
                            className="w-10 h-10 rounded-full shrink-0 ring-2 ring-amber-400/30"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center text-zinc-900 text-sm font-bold shrink-0">
                            {(user.email?.[0] ?? '?').toUpperCase()}
                          </div>
                        )}

                        {/* Name + level + streak */}
                        <div className="flex-1 min-w-0 text-left">
                          <div className="text-sm font-semibold text-white truncate">{firstName}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[0.65rem] font-bold text-amber-400 tracking-wide">
                              Lv {level} · {label}
                            </span>
                            {streak > 0 && (
                              <span className="text-[0.65rem] text-white/50">
                                🔥 {streak}
                              </span>
                            )}
                          </div>
                          {/* XP mini progress bar */}
                          {navProfile && (() => {
                            const { progress, nextLevel } = getLevel(xp);
                            return (
                              <div className="mt-1 h-1 w-24 bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-amber-400 rounded-full"
                                  style={{ width: `${progress * 100}%` }}
                                />
                              </div>
                            );
                          })()}
                        </div>

                        <span className="text-[0.65rem] text-amber-400/70 shrink-0">Dashboard →</span>
                      </button>
                    );
                  })() : (
                    <button
                      onClick={() => handleNav('login')}
                      className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-white/5 transition-colors cursor-pointer bg-transparent border-none"
                    >
                      <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/40 text-lg shrink-0">
                        ?
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-amber-400">Sign in</div>
                        <div className="text-[0.65rem] text-white/40 mt-0.5">Track progress &amp; unlock achievements</div>
                      </div>
                    </button>
                  )}

                  <div className="h-px bg-white/[0.08] mx-5 my-1" />

                  <span className={cn(
                    'block px-5 py-2 text-[0.68rem] font-bold tracking-[0.1em] uppercase',
                    activeGroup === 'study' ? 'text-amber-400' : 'text-white/40'
                  )}>
                    Study
                  </span>
                  {STUDY_PAGES.map(p => (
                    <button
                      key={p.id}
                      className={cn(
                        'w-full text-left px-7 py-[0.75rem] text-sm tracking-[0.02em] border-l-[3px] transition-all bg-transparent',
                        hubForPage(activePage) === p.id
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
                    'block px-5 py-2 text-[0.68rem] font-bold tracking-[0.1em] uppercase',
                    activeGroup === 'reference' ? 'text-amber-400' : 'text-white/40'
                  )}>
                    Reference
                  </span>
                  {REFERENCE_PAGES.map(p => (
                    <button
                      key={p.id}
                      className={cn(
                        'w-full text-left px-7 py-[0.75rem] text-sm tracking-[0.02em] border-l-[3px] transition-all bg-transparent',
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
                    'block px-5 py-2 text-[0.68rem] font-bold tracking-[0.1em] uppercase',
                    activeGroup === 'culture' ? 'text-amber-400' : 'text-white/40'
                  )}>
                    Culture
                  </span>
                  {CULTURE_PAGES.map(p => (
                    <button
                      key={p.id}
                      className={cn(
                        'w-full text-left px-7 py-[0.75rem] text-sm tracking-[0.02em] border-l-[3px] transition-all bg-transparent',
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
                  <button
                    className={cn(
                      'w-full text-left px-7 py-[0.75rem] text-sm tracking-[0.02em] border-l-[3px] transition-all bg-transparent',
                      activePage === 'about'
                        ? 'text-white border-amber-400 bg-white/[0.06]'
                        : 'text-white/65 border-transparent'
                    )}
                    onClick={() => handleNav('about')}
                  >
                    About
                  </button>

                  {user && (
                    <>
                      <div className="h-px bg-white/[0.08] mx-5 my-1.5" />
                      <button
                        onClick={() => { setMenuOpen(false); onSignOut(); }}
                        className="w-full text-left px-5 py-3.5 text-sm text-white/40 hover:text-white/70 transition-colors cursor-pointer bg-transparent border-none"
                      >
                        Sign out
                      </button>
                    </>
                  )}

                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: sub-tabs (desktop only, hidden on home + about) */}
      <div className={cn('items-center px-5 bg-black/[0.18] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden', (activePage === 'home' || activeGroup === 'about') ? 'hidden' : 'hidden sm:flex')} aria-hidden={activePage === 'home'}>
        {subPages.map(p => (
          <button key={p.id} className={subTabClass(p.id)} onClick={() => handleNav(p.id)}>
            {p.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
