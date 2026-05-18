import { useState, useEffect } from 'react';
import Nav from './components/Nav.jsx';
import FlashcardsPage from './pages/FlashcardsPage.jsx';
import GrammarPage from './pages/GrammarPage.jsx';
import PronunciationPage from './pages/PronunciationPage.jsx';
import QuizPage from './pages/QuizPage.jsx';
import ClassifiersPage from './pages/ClassifiersPage.jsx';
import NumbersPage from './pages/NumbersPage.jsx';
import ClassRushPage from './pages/ClassRushPage.jsx';
import ReadingPassagesPage from './pages/ReadingPassagesPage.jsx';
import ConsonantsPage from './pages/ConsonantsPage.jsx';

const GROUP_MAP = {
  cards: 'study',
  quiz: 'study',
  rush: 'study',
  passages: 'study',
  grammar: 'reference',
  pronunciation: 'reference',
  classifiers: 'reference',
  numbers: 'reference',
  consonants: 'reference',
};

function App() {
  const [activePage, setActivePage] = useState('cards');
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

  useEffect(() => {
    localStorage.setItem('thai-study-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('thai-study-starred', JSON.stringify([...starred]));
  }, [starred]);

  const toggleTheme = () => {
    setTheme(t => t === 'light' ? 'dark' : 'light');
  };

  const toggleStar = (thai) => {
    setStarred(prev => {
      const next = new Set(prev);
      if (next.has(thai)) {
        next.delete(thai);
      } else {
        next.add(thai);
      }
      return next;
    });
  };

  const showPage = (page) => {
    setActivePage(page);
  };

  const activeGroup = GROUP_MAP[activePage] || 'study';

  return (
    <div className="min-h-screen bg-background text-foreground" data-theme={theme === 'dark' ? 'dark' : undefined}>
      <Nav activePage={activePage} activeGroup={activeGroup} showPage={showPage} toggleTheme={toggleTheme} theme={theme} />

      {activePage === 'cards' && <FlashcardsPage starred={starred} toggleStar={toggleStar} />}
      {activePage === 'grammar' && <GrammarPage />}
      {activePage === 'pronunciation' && <PronunciationPage />}
      {activePage === 'quiz' && <QuizPage starred={starred} />}
      {activePage === 'classifiers' && <ClassifiersPage />}
      {activePage === 'numbers' && <NumbersPage />}
      {activePage === 'rush' && <ClassRushPage />}
      {activePage === 'passages' && <ReadingPassagesPage />}
      {activePage === 'consonants' && <ConsonantsPage />}
    </div>
  );
}

export default App;
