import { useState, useEffect } from 'react';
import Nav from './components/Nav.jsx';
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

const GROUP_MAP = {
  home: null,
  cards: 'study',
  quiz: 'study',
  rush: 'study',
  scramble: 'study',
  passages: 'study',
  grammar: 'reference',
  pronunciation: 'reference',
  months: 'reference',
  classifiers: 'reference',
  numbers: 'reference',
};

const VALID_PAGES = new Set(Object.keys(GROUP_MAP));

function pageFromHash() {
  const hash = window.location.hash.slice(1);
  return VALID_PAGES.has(hash) ? hash : 'home';
}

function App() {
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

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  const toggleStar = (thai) => {
    setStarred(prev => {
      const next = new Set(prev);
      if (next.has(thai)) next.delete(thai);
      else next.add(thai);
      return next;
    });
  };

  const activeGroup = GROUP_MAP[activePage] || 'study';

  return (
    <div className="min-h-screen bg-background text-foreground" data-theme={theme === 'dark' ? 'dark' : undefined}>
      <Nav activePage={activePage} activeGroup={activeGroup} showPage={showPage} onSearch={() => setSearchOpen(true)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} showPage={showPage} />

      {/* Floating theme toggle */}
      <button
        onClick={toggleTheme}
        className="fixed bottom-5 right-5 z-50 w-12 h-12 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white shadow-lg flex items-center justify-center text-xl transition-colors"
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      {activePage === 'home'       && <HomePage showPage={showPage} />}
      {activePage === 'cards'      && <FlashcardsPage starred={starred} toggleStar={toggleStar} />}
      {activePage === 'grammar'    && <GrammarPage />}
      {activePage === 'pronunciation' && <PronunciationPage />}
      {activePage === 'quiz'       && <QuizPage starred={starred} />}
      {activePage === 'classifiers' && <ClassifiersPage />}
      {activePage === 'numbers'    && <NumbersPage />}
      {activePage === 'rush'       && <ClassRushPage />}
      {activePage === 'scramble'   && <ScramblePage />}
      {activePage === 'passages'   && <ReadingPassagesPage />}
      {activePage === 'months'     && <MonthsPage />}
    </div>
  );
}

export default App;
