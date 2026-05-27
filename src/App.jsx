import { useState, useEffect, useRef } from 'react';
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
import LoginPage from './pages/LoginPage.jsx';
import { useAuth } from './context/AuthContext.jsx';

const GROUP_MAP = {
  home: null,
  dashboard: null,
  login: null,
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
  login:        'Sign In — Thai Study',
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

function App() {
  const { user } = useAuth();
  const [activePage, setActivePage] = useState(pageFromHash);
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

      <div key={activePage} className="animate-page-in">
        {activePage === 'dashboard'     && (user ? <DashboardPage showPage={showPage} /> : <LoginPage />)}
        {activePage === 'login'         && <LoginPage />}
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
