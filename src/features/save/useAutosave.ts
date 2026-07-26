import { useEffect, useRef } from 'react';
import { selectPersistedState, useGameStore } from '../../game/state';
import { writeSaveToStorage } from './storage';

const AUTOSAVE_DEBOUNCE_MS = 1500;

function getPersistedSnapshot() {
  return selectPersistedState(useGameStore.getState());
}

async function persistNow(): Promise<void> {
  if (typeof localStorage === 'undefined') {
    return;
  }
  await writeSaveToStorage(getPersistedSnapshot(), localStorage);
}

/**
 * Debounced autosave on game-state changes, plus flush on
 * `visibilitychange` (hidden) and `pagehide`.
 */
export function useAutosave(): void {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const writingRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    const schedule = () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        writingRef.current = persistNow().catch((err: unknown) => {
          console.error('Autosave failed', err);
        });
      }, AUTOSAVE_DEBOUNCE_MS);
    };

    const flush = () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      writingRef.current = persistNow().catch((err: unknown) => {
        console.error('Autosave flush failed', err);
      });
    };

    const unsub = useGameStore.subscribe((state, prev) => {
      if (
        state.tokens === prev.tokens &&
        state.lastTickAt === prev.lastTickAt &&
        state.owned === prev.owned
      ) {
        return;
      }
      schedule();
    });

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        flush();
      }
    };

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', flush);

    return () => {
      unsub();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', flush);
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);
}
