import { useState, useEffect, useRef } from 'react';
import { cn } from './lib/utils.js';
import Nav from './components/Nav.jsx';
import { track } from './lib/analytics.js';
import SearchOverlay from './components/SearchOverlay.jsx';
import HomePage from './pages/HomePage.jsx';
import FlashcardsPage from './pages/FlashcardsPage.jsx';
import GrammarPage from './pages/GrammarPage.jsx';
import PronunciationPage from './pages/PronunciationPage.jsx';
import QuizPage from './pages/QuizPage.jsx';
import ClassifiersPage from './pages/ClassifiersPage.jsx';
import NumbersPage from './pages/NumbersPage.jsx';
import ClassRushPage from './pages/ClassRushPage.jsx';
import ScramblePage from './pages/ScramblePage.jsx';
import ReadingPassagesPage from './pages/ReadingPassagesPage.jsx';
import MonthsPage from './pages/MonthsPage.jsx';
import ConsonantClustersPage from './pages/ConsonantClustersPage.jsx';
import ReadingStrategiesPage from './pages/ReadingStrategiesPage.jsx';
import CulturePage from './pages/CulturePage.jsx';
import IdiomsPage from './pages/IdiomsPage.jsx';
import FestivalsPage from './pages/FestivalsPage.jsx';
import FoodPage from './pages/FoodPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import AuthModal from './components/AuthModal.jsx';
import { useAuth } from './context/AuthContext.jsx';

const GROUP_MAP = {
  home: null,
  dashboard: null,
  cards: 'study',
  quiz: 'study',
  rush: 'study',
  scramble: 'study',
  passages: 'study',
  months: 'study',
  grammar: 'reference',
  pronunciation: 'reference',
  classifiers: 'reference',
  reading: 'reference',
  culture: 'culture',
  idioms:    'culture',
  festivals: 'culture',
  food:      'culture',
  // legacy routes — still work via hash but not in nav
  numbers: 'reference',
  clusters: 'reference',
};

const VALID_PAGES = new Set(Object.keys(GROUP_MAP));

const PAGE_TITLES = {
  home:         'Thai Study — Learn Thai Vocabulary, Grammar & Pronunciation',
  dashboard:    'Dashboard — Thai Study',
  cards:        'Flashcards — Thai Study',
  quiz:         'Vocabulary Quiz — Thai Study',
  rush:         'Class Rush — Thai Study',
  scramble:     'Scramble — Thai Study',
  passages:     'Reading Passages — Thai Study',
  months:       'Thai Months — Thai Study',
  grammar:      'Grammar Patterns — Thai Study',
  pronunciation:'Pronunciation & Tones — Thai Study',
  classifiers:  'Numbers & Classifiers — Thai Study',
  reading:      'Reading & Writing Strategies — Thai Study',
  culture:      'Thai Anthems — Thai Study',
  idioms:       'Thai Idioms — Thai Study',
  festivals:    'Festivals & Calendar — Thai Study',
  food:         'Thai Food — Thai Study',
  numbers:      'Numbers — Thai Study',
  clusters:     'Consonant Clusters — Thai Study',
};

function pageFromHash() {
  const hash = window.location.hash.slice(1);
  return VALID_PAGES.has(hash) ? hash : 'home';
}

// Pages where the nudge banner should never show
const NO_NUDGE_PAGES = new Set(['home', 'dashboard']);

function StudyNudgeBanner({ onCta }) {
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem('nudge-v1') === '1'
  );

  if (dismissed) return null;

  const dismiss = () => {
    sessionStorage.setItem('nudge-v1', '1');
    setDismissed(true);
  };

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-2 bg-amber-50/80 dark:bg-amber-950/20 border-b border-amber-200/70 dark:border-amber-900/40 text-xs">
      <p className="text-amber-900/70 dark:text-amber-200/60 leading-snug">
        <span className="hidden sm:inline">Your progress isn't being saved — </span>
        <span className="sm:hidden">Progress not saved — </span>
        <button
          onClick={onCta}
          className="font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 underline underline-offset-2 decoration-amber-400/50 transition-colors cursor-pointer bg-transparent border-none p-0 text-xs"
        >
          sign in free to track words, build streaks &amp; earn XP
        </button>
      </p>
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="shrink-0 text-amber-400/60 hover:text-amber-400 transition-colors cursor-pointer bg-transparent border-none p-0 leading-none text-sm"
      >
        ✕
      </button>
    </div>
  );
}

function App() {
  const { user } = useAuth();
  const [activePage, setActivePage] = useState(pageFromHash);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('signup');
  const [searchOpen, setSearchOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('thai-study-theme') || 'light';
  });
  const [starred, setStarred] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('thai-study-starred') || '[]'));
    } catch {
      return new Set();
    }
  });
  const [showRomaji, setShowRomaji] = useState(() =>
    localStorage.getItem('thai-study-romaji') !== 'false'
  );

  const showPage = (page) => {
    if (page === 'login') {
      setAuthModalMode('login');
      setAuthModalOpen(true);
      return;
    }
    if (page === 'signup') {
      setAuthModalMode('signup');
      setAuthModalOpen(true);
      return;
    }
    setActivePage(page);
    window.location.hash = page === 'home' ? '' : page;
  };

  useEffect(() => {
    const onHashChange = () => setActivePage(pageFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    document.title = PAGE_TITLES[activePage] ?? PAGE_TITLES.home;
  }, [activePage]);

  // Track section navigation — skip first render (GA4 handles initial page_view automatically)
  const isFirstNav = useRef(true);
  useEffect(() => {
    if (isFirstNav.current) { isFirstNav.current = false; return; }
    track('page_view', {
      page_title: PAGE_TITLES[activePage] ?? PAGE_TITLES.home,
      page_location: window.location.href,
    });
  }, [activePage]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [activePage]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '/' && !searchOpen && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [searchOpen]);

  useEffect(() => {
    localStorage.setItem('thai-study-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('thai-study-starred', JSON.stringify([...starred]));
  }, [starred]);

  useEffect(() => {
    localStorage.setItem('thai-study-romaji', showRomaji ? 'true' : 'false');
  }, [showRomaji]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  const toggleStar = (thai) => {
    setStarred(prev => {
      const next = new Set(prev);
      if (next.has(thai)) next.delete(thai);
      else next.add(thai);
      return next;
    });
  };

  const activeGroup = GROUP_MAP[activePage] ?? null;

  return (
    <div className="min-h-screen bg-background text-foreground" data-theme={theme === 'dark' ? 'dark' : undefined}>
      <Nav
        activePage={activePage}
        activeGroup={activeGroup}
        showPage={showPage}
        onSearch={() => setSearchOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        showRomaji={showRomaji}
        onToggleRomaji={() => setShowRomaji(r => !r)}
        user={user}
      />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} showPage={showPage} />
      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} initialMode={authModalMode} />

      {/* Nudge logged-out users on every study/reference/culture page */}
      {user === null && !NO_NUDGE_PAGES.has(activePage) && (
        <StudyNudgeBanner
          onCta={() => { setAuthModalMode('signup'); setAuthModalOpen(true); }}
        />
      )}

      <div key={activePage} className="animate-page-in">
        {activePage === 'dashboard'     && (user ? <DashboardPage showPage={showPage} /> : (
          <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="text-center">
              <p className="text-muted-foreground text-sm mb-4">Sign in to view your dashboard</p>
              <button
                onClick={() => setAuthModalOpen(true)}
                className="text-sm font-medium text-amber-600 hover:text-amber-500 transition-colors bg-transparent border-none cursor-pointer"
              >
                Continue with Google →
              </button>
            </div>
          </div>
        ))}
        {activePage === 'home'          && <HomePage showPage={showPage} />}
        {activePage === 'cards'         && <FlashcardsPage starred={starred} toggleStar={toggleStar} showRomaji={showRomaji} showPage={showPage} />}
        {activePage === 'grammar'       && <GrammarPage showPage={showPage} />}
        {activePage === 'pronunciation' && <PronunciationPage showPage={showPage} />}
        {activePage === 'quiz'          && <QuizPage starred={starred} showRomaji={showRomaji} showPage={showPage} />}
        {activePage === 'classifiers'   && <ClassifiersPage showPage={showPage} />}
        {activePage === 'reading'       && <ReadingStrategiesPage showPage={showPage} />}
        {activePage === 'numbers'       && <NumbersPage />}
        {activePage === 'rush'          && <ClassRushPage showPage={showPage} />}
        {activePage === 'scramble'      && <ScramblePage showPage={showPage} />}
        {activePage === 'passages'      && <ReadingPassagesPage showPage={showPage} />}
        {activePage === 'months'        && <MonthsPage />}
        {activePage === 'clusters'      && <ConsonantClustersPage />}
        {activePage === 'culture'       && <CulturePage />}
        {activePage === 'idioms'        && <IdiomsPage />}
        {activePage === 'festivals'     && <FestivalsPage />}
        {activePage === 'food'          && <FoodPage />}
      </div>
    </div>
  );
}

export default App;
