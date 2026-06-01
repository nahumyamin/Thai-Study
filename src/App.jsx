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
import ReviewPage from './pages/ReviewPage.jsx';
import ClozePage from './pages/ClozePage.jsx';
import StudyHubPage from './pages/StudyHubPage.jsx';
import { STUDY_HUBS, toolMeta } from './data/studyHubs.js';
import ClassifiersPage from './pages/ClassifiersPage.jsx';
import NumbersPage from './pages/NumbersPage.jsx';
import ClassRushPage from './pages/ClassRushPage.jsx';
import ScramblePage from './pages/ScramblePage.jsx';
import ClassifierDropPage from './pages/ClassifierDropPage.jsx';
import MistakeHunterPage from './pages/MistakeHunterPage.jsx';
import ReadingPassagesPage from './pages/ReadingPassagesPage.jsx';
import MonthsPage from './pages/MonthsPage.jsx';
import ConsonantClustersPage from './pages/ConsonantClustersPage.jsx';
import ReadingStrategiesPage from './pages/ReadingStrategiesPage.jsx';
import CulturePage from './pages/CulturePage.jsx';
import IdiomsPage from './pages/IdiomsPage.jsx';
import FestivalsPage from './pages/FestivalsPage.jsx';
import FoodPage from './pages/FoodPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import FontGamePage from './pages/FontGamePage.jsx';
import PlaybooksPage from './pages/PlaybooksPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import AuthModal from './components/AuthModal.jsx';
import FeedbackButton from './components/FeedbackButton.jsx';
import { useAuth } from './context/AuthContext.jsx';

const GROUP_MAP = {
  home: null,
  dashboard: null,
  about: 'about',
  words: 'study',
  sentences: 'study',
  script: 'study',
  cards: 'study',
  quiz: 'study',
  review: 'study',
  cloze: 'study',
  rush: 'study',
  scramble: 'study',
  'classifier-drop': 'study',
  'mistake-hunter':  'study',
  passages: 'study',
  months: 'study',
  grammar: 'reference',
  pronunciation: 'reference',
  classifiers: 'reference',
  reading: 'reference',
  register:  'reference',
  fonts:     'script',
  playbooks: 'reference',
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
  words:        'Vocabulary Practice — Thai Study',
  sentences:    'Grammar Practice — Thai Study',
  script:       'Reading & Script — Thai Study',
  cards:        'Flashcards — Thai Study',
  quiz:         'Vocabulary Quiz — Thai Study',
  review:       'Spaced Review — Thai Study',
  cloze:        'Fill the Blank — Thai Study',
  rush:         'Class Rush — Thai Study',
  scramble:          'Scramble — Thai Study',
  'classifier-drop': 'Classifier Drop — Thai Study',
  'mistake-hunter':  'Mistake Hunter — Thai Study',
  passages:          'Reading Passages — Thai Study',
  months:       'Thai Months — Thai Study',
  grammar:      'Grammar Patterns — Thai Study',
  pronunciation:'Pronunciation & Tones — Thai Study',
  classifiers:  'Numbers & Classifiers — Thai Study',
  reading:      'Reading & Writing Strategies — Thai Study',
  register:     'Thai Registers — Thai Study',
  fonts:        'Font Recognition — Thai Study',
  playbooks:    'Study Playbooks — Thai Study',
  about:        'About — Thai Study',
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
  return (
    <div className="max-w-3xl mx-auto px-4 pt-6 pb-0">
      <div className="flex items-center justify-between gap-3 rounded-full bg-zinc-100 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700/60 px-4 py-2">
        <span className="text-xs text-zinc-600 dark:text-zinc-300">
          <span className="hidden sm:inline">Every word you study disappears when you close this tab — sign in and make it count.</span>
          <span className="sm:hidden">Your progress vanishes when you leave.</span>
        </span>
        <button
          onClick={onCta}
          className="text-[0.7rem] font-medium text-zinc-600 dark:text-zinc-300 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-full px-3 py-1 hover:bg-zinc-50 dark:hover:bg-zinc-600 transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          Get started free
        </button>
      </div>
    </div>
  );
}

// Breadcrumb shown above any practice tool, linking back to its category hub.
function StudyBreadcrumb({ activePage, showPage }) {
  const meta = toolMeta(activePage);
  if (!meta) return null;
  return (
    <div className="border-b border-border/60 bg-muted/30">
      <nav className="max-w-[1200px] mx-auto px-5 py-2 flex items-center gap-1.5 text-xs" aria-label="Breadcrumb">
        <button
          onClick={() => showPage(meta.hubId)}
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors bg-transparent border-none cursor-pointer p-0"
        >
          <span aria-hidden className="text-sm leading-none">←</span>
          {meta.hubLabel}
        </button>
        <span className="text-muted-foreground/40" aria-hidden>/</span>
        <span className="text-foreground font-medium">{meta.name}</span>
      </nav>
    </div>
  );
}

function App() {
  const { user, signOut } = useAuth();
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
        onSignOut={async () => { await signOut(); showPage('home'); }}
      />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} showPage={showPage} />
      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} initialMode={authModalMode} />
      <FeedbackButton />

      <div key={activePage} className="animate-page-in">
        {/* Breadcrumb back to the category hub — shown on every practice tool */}
        <StudyBreadcrumb activePage={activePage} showPage={showPage} />

        {/* Nudge banner — above the page title, only for logged-out users on content pages */}
        {user === null && !NO_NUDGE_PAGES.has(activePage) && (
          <StudyNudgeBanner
            onCta={() => { setAuthModalMode('signup'); setAuthModalOpen(true); }}
          />
        )}

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
        {STUDY_HUBS.some(h => h.id === activePage) && <StudyHubPage hub={activePage} showPage={showPage} />}
        {activePage === 'cards'         && <FlashcardsPage starred={starred} toggleStar={toggleStar} showRomaji={showRomaji} showPage={showPage} />}
        {activePage === 'grammar'       && <GrammarPage showPage={showPage} />}
        {activePage === 'pronunciation' && <PronunciationPage showPage={showPage} />}
        {activePage === 'quiz'          && <QuizPage starred={starred} showRomaji={showRomaji} showPage={showPage} />}
        {activePage === 'review'        && <ReviewPage showRomaji={showRomaji} showPage={showPage} />}
        {activePage === 'cloze'         && <ClozePage starred={starred} showRomaji={showRomaji} showPage={showPage} />}
        {activePage === 'classifiers'   && <ClassifiersPage showPage={showPage} />}
        {activePage === 'reading'       && <ReadingStrategiesPage showPage={showPage} />}
        {activePage === 'register'      && <RegisterPage showPage={showPage} />}
        {activePage === 'fonts'         && <FontGamePage showPage={showPage} />}
        {activePage === 'playbooks'     && <PlaybooksPage />}
        {activePage === 'about'         && <AboutPage showPage={showPage} />}
        {activePage === 'numbers'       && <NumbersPage />}
        {activePage === 'rush'          && <ClassRushPage showPage={showPage} />}
        {activePage === 'scramble'          && <ScramblePage showPage={showPage} />}
        {activePage === 'classifier-drop'  && <ClassifierDropPage showPage={showPage} />}
        {activePage === 'mistake-hunter'   && <MistakeHunterPage showPage={showPage} />}
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
