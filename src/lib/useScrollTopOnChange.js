import { useEffect } from 'react';

// Scroll the window to the top whenever `key` changes.
//
// Used by screens that swap between internal views (e.g. selecting a reading
// passage, or moving intro → game → results) WITHOUT a route change. Since the
// URL doesn't change, App's route-level scroll reset never fires, so the new
// view would otherwise render at whatever scroll offset the previous view left
// behind — showing the middle/bottom of the screen instead of the top.
export function useScrollTopOnChange(key) {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [key]);
}
