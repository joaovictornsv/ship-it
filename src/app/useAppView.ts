import { useEffect, useState } from 'react';
import { type AppView, appViewHash, parseAppView } from './appView';

/**
 * Lightweight hash navigation (`#/` play, `#/save` save) without a router.
 * Progress stays in Zustand; changing views does not touch the save slot.
 */
export function useAppView(): [AppView, (view: AppView) => void] {
  const [view, setViewState] = useState<AppView>(() =>
    parseAppView(typeof window !== 'undefined' ? window.location.hash : ''),
  );

  useEffect(() => {
    const onHashChange = () => {
      setViewState(parseAppView(window.location.hash));
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  function setView(next: AppView) {
    const nextHash = appViewHash(next);
    if (window.location.hash === nextHash) {
      setViewState(next);
      return;
    }
    window.location.hash = nextHash;
  }

  return [view, setView];
}
