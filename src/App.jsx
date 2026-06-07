import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
import ConsonantCardsPage from './pages/ConsonantCardsPage.jsx';
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
import Footer from './components/Footer.jsx';
import { useAuth } from './context/AuthContext.jsx';
import { useRomaji } from './context/RomajiContext.jsx';

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
  'consonant-cards': 'study',
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
  numbers: 'reference',
  clusters: 'reference',
};

const VALID_PAGES = new Set(Object.keys(GROUP_MAP));

const BASE_URL = 'https://thai-study.com';

const PAGE_META = {
  home:         { title: 'Thai Study — Learn Thai Vocabulary, Grammar & Pronunciation', description: 'Free Thai language learning app with 329 vocabulary flashcards, 20 grammar patterns, reading passages, tones, classifiers, idioms, festivals, and interactive games. Study Thai online at your own pace.' },
  dashboard:    { title: 'Dashboard — Thai Study', description: 'Track your Thai language learning progress, streaks, XP, and mastery across all vocabulary and practice tools on Thai Study.' },
  words:        { title: 'Vocabulary Practice — Thai Study', description: 'Practice Thai vocabulary with flashcards, quizzes, spaced repetition review, and fill-in-the-blank exercises. 329 words across 18 topics.' },
  sentences:    { title: 'Grammar Practice — Thai Study', description: 'Practice Thai grammar with word scramble, mistake hunter, and classifier drop games. Build correct Thai sentences through interactive exercises.' },
  script:       { title: 'Reading & Script — Thai Study', description: 'Build Thai reading skills with consonant class drills, graded reading passages, Thai months, and font recognition. Master the Thai alphabet and script.' },
  cards:        { title: 'Flashcards — Thai Study', description: 'Learn Thai vocabulary with 329 interactive flashcards across 18 topics including food, travel, emotions, and everyday conversation.' },
  quiz:         { title: 'Vocabulary Quiz — Thai Study', description: 'Test your Thai vocabulary knowledge with multiple-choice and typed recall quizzes. Choose any topic or mix all 329 words.' },
  review:       { title: 'Spaced Review — Thai Study', description: 'Review Thai vocabulary with spaced repetition — focus on the words due today based on your personal memory schedule.' },
  cloze:        { title: 'Fill the Blank — Thai Study', description: 'Practice Thai vocabulary in context by filling in missing words inside real example sentences.' },
  rush:         { title: 'Class Rush — Thai Study', description: 'Sort Thai consonants into their correct classes (high, mid, low) against the clock in this fast-paced flashcard game.' },
  'consonant-cards': { title: 'Consonant Cards — Thai Study', description: 'Flip flashcards for all 44 Thai consonants to learn each one\'s class, initial sound, and whether it forms a dead or live syllable as a final.' },
  scramble:         { title: 'Scramble — Thai Study', description: 'Reorder scrambled Thai words into grammatically correct sentences. Grammar tips are revealed with every correct answer.' },
  'classifier-drop':{ title: 'Classifier Drop — Thai Study', description: 'Pick the correct Thai noun classifier for each word in this fast 30-question game. Master Thai noun classifiers through repetition.' },
  'mistake-hunter': { title: 'Mistake Hunter — Thai Study', description: 'Find the single grammar mistake hidden in each Thai sentence and sharpen your eye for correct Thai structure.' },
  passages:     { title: 'Reading Passages — Thai Study', description: 'Read graded Thai texts with vocabulary support and comprehension questions. Build real reading fluency with authentic Thai content.' },
  months:       { title: 'Thai Months — Thai Study', description: 'Learn all 12 Thai months in Thai script with pronunciation, romanization, and a built-in quiz. Master the Thai calendar.' },
  grammar:      { title: 'Grammar Patterns — Thai Study', description: 'Study 20 core Thai grammar patterns with example sentences, English explanations, and usage notes. Essential grammar for speaking and reading Thai.' },
  pronunciation:{ title: 'Pronunciation & Tones — Thai Study', description: 'Master Thai tones, vowel sounds, and consonant classes with visual guides and interactive reference tables.' },
  classifiers:  { title: 'Numbers & Classifiers — Thai Study', description: 'Complete reference for Thai numbers (0–1,000,000) and noun classifiers grouped by category with examples.' },
  reading:      { title: 'Reading & Writing Strategies — Thai Study', description: 'Learn strategies for decoding Thai script: vowel placement, silent letters, tone marks, and reading flow for beginners and intermediate learners.' },
  register:     { title: 'Thai Registers — Thai Study', description: 'Understand Thai speech registers — formal, polite, colloquial, and regal — with vocabulary comparisons and usage guidance.' },
  fonts:        { title: 'Font Recognition — Thai Study', description: 'Train your eye to recognise Thai words across five very different typefaces: Sriracha, Charmonman, Srisakdi, Mali, and Chonburi.' },
  playbooks:    { title: 'Study Playbooks — Thai Study', description: 'Structured study plans for learning Thai systematically — whether you are a complete beginner or working towards reading fluency.' },
  about:        { title: 'About — Thai Study', description: 'Thai Study is a free Thai language learning app. Learn about the project and support its development on Ko-fi.' },
  culture:      { title: 'Thai Anthems — Thai Study', description: 'Explore Thai national and royal anthems with lyrics in Thai script, romanization, and English translation. Learn about Thai cultural heritage.' },
  idioms:       { title: 'Thai Idioms — Thai Study', description: 'Discover Thai idioms and proverbs with meanings, literal translations, and illustrated examples. Enrich your Thai with culturally rich expressions.' },
  festivals:    { title: 'Festivals & Calendar — Thai Study', description: 'Explore major Thai festivals — Songkran, Loy Krathong, Makha Bucha, and more — with dates, traditions, and key vocabulary.' },
  food:         { title: 'Thai Food — Thai Study', description: 'Learn Thai food vocabulary with names in Thai script, romanization, and descriptions of popular dishes, ingredients, and flavors.' },
  numbers:      { title: 'Numbers — Thai Study', description: 'Learn Thai numbers from 0 to 1,000,000 with Thai script, romanization, and pronunciation. Essential Thai counting vocabulary.' },
  clusters:     { title: 'Consonant Clusters — Thai Study', description: 'Complete reference for Thai consonant clusters — two and three consonant combinations with their romanized pronunciation and example words.' },
};

function pageUrl(page) {
  return page === 'home' ? `${BASE_URL}/` : `${BASE_URL}/${page}`;
}

function updatePageMeta(page) {
  const m = PAGE_META[page] ?? PAGE_META.home;
  const url = pageUrl(page);
  document.title = m.title;
  const set = (sel, attr, val) => { const el = document.querySelector(sel); if (el) el.setAttribute(attr, val); };
  set('meta[name="description"]', 'content', m.description);
  set('link[rel="canonical"]', 'href', url);
  set('meta[property="og:title"]', 'content', m.title);
  set('meta[property="og:description"]', 'content', m.description);
  set('meta[property="og:url"]', 'content', url);
  set('meta[name="twitter:title"]', 'content', m.title);
  set('meta[name="twitter:description"]', 'content', m.description);
  set('meta[name="twitter:url"]', 'content', url);
}

function pageFromPath(pathname) {
  const slug = pathname.replace(/^\//, '').replace(/\/$/, '') || 'home';
  return VALID_PAGES.has(slug) ? slug : 'home';
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
  const navigate = useNavigate();
  const location = useLocation();
  const [activePage, setActivePage] = useState(() => pageFromPath(location.pathname));
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
  const { showRomaji, toggleRomaji } = useRomaji();

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
    navigate(page === 'home' ? '/' : `/${page}`);
  };

  // Sync state and meta with URL changes (back/forward navigation)
  useEffect(() => {
    const page = pageFromPath(location.pathname);
    setActivePage(page);
    updatePageMeta(page);
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location.pathname]);

  // Track section navigation — skip first render (GA4 handles initial page_view automatically)
  const isFirstNav = useRef(true);
  useEffect(() => {
    if (isFirstNav.current) { isFirstNav.current = false; return; }
    track('page_view', {
      page_title: PAGE_META[activePage]?.title ?? PAGE_META.home.title,
      page_location: window.location.href,
    });
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
        onToggleRomaji={toggleRomaji}
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
        {activePage === 'consonant-cards' && <ConsonantCardsPage />}
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

      <Footer showPage={showPage} />
    </div>
  );
}

export default App;
