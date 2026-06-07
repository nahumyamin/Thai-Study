import { createContext, useContext, useState, useEffect } from 'react';

// Single source of truth for the "show romanization" preference, so the
// rōm toggle in the nav controls every romanized reading across the site.
// Core phonetics pages (Pronunciation guide, consonant sound/name on
// Class Rush / Consonant Cards / Clusters) intentionally don't consume this —
// there the romanized sound IS the lesson.
const RomajiContext = createContext({
  showRomaji: true,
  toggleRomaji: () => {},
  setShowRomaji: () => {},
});

export function RomajiProvider({ children }) {
  const [showRomaji, setShowRomaji] = useState(
    () => localStorage.getItem('thai-study-romaji') !== 'false'
  );

  useEffect(() => {
    localStorage.setItem('thai-study-romaji', showRomaji ? 'true' : 'false');
  }, [showRomaji]);

  const toggleRomaji = () => setShowRomaji(r => !r);

  return (
    <RomajiContext.Provider value={{ showRomaji, toggleRomaji, setShowRomaji }}>
      {children}
    </RomajiContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRomaji() {
  return useContext(RomajiContext);
}
