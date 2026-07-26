import { useEffect, useRef } from 'react';
import { selectPersistedState, useGameStore } from '../../game/state';
import { exportSaveBlob } from './codec';
import { SAVE_STORAGE_KEY } from './types';

const AUTOSAVE_DEBOUNCE_MS = 1500;

function getPersistedSnapshot() {
  return selectPersistedState(useGameStore.getState());
}

/**
 * Trailing autosave ~1.5s after tokens / owned changes, plus sync flush on
 * `visibilitychange` (hidden) and `pagehide` via a warmed base64 blob.
 *
 * `lastTickAt`-only updates do not schedule a save. Token accrual from the
 * production tick does schedule, but an already-pending timer is not reset —
 * otherwise a 100ms tick would prevent autosave from ever landing.
 *
 * Pass `enabled=false` until hydrate finishes so boot never writes an empty store.
 */
export function useAutosave(enabled: boolean = true): void {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warmBlobRef = useRef<string | null>(null);
  const warmEpochRef = useRef(0);
  const epochRef = useRef(0);

  useEffect(() => {
    if (!enabled || typeof localStorage === 'undefined') {
      return;
    }

    let cancelled = false;

    const persistSnapshot = async (epoch: number): Promise<void> => {
      const snapshot = getPersistedSnapshot();
      const blob = await exportSaveBlob(snapshot);
      if (cancelled || epoch !== epochRef.current) {
        if (
          !cancelled &&
          epoch !== epochRef.current &&
          timerRef.current === null
        ) {
          schedule();
        }
        return;
      }
      warmBlobRef.current = blob;
      warmEpochRef.current = epoch;
      localStorage.setItem(SAVE_STORAGE_KEY, blob);
    };

    const schedule = () => {
      epochRef.current += 1;
      warmBlobRef.current = null;
      if (timerRef.current !== null) {
        return;
      }
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        const epoch = epochRef.current;
        void persistSnapshot(epoch).catch((err: unknown) => {
          console.error('Autosave failed', err);
        });
      }, AUTOSAVE_DEBOUNCE_MS);
    };

    /** Sync when a warm blob matches the latest epoch; otherwise best-effort async. */
    const flush = () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      const epoch = epochRef.current;
      if (warmBlobRef.current !== null && warmEpochRef.current === epoch) {
        localStorage.setItem(SAVE_STORAGE_KEY, warmBlobRef.current);
        return;
      }
      void persistSnapshot(epoch).catch((err: unknown) => {
        console.error('Autosave flush failed', err);
      });
    };

    // Persist hydrated state once (includes refreshed lastTickAt).
    epochRef.current += 1;
    const bootEpoch = epochRef.current;
    void persistSnapshot(bootEpoch).catch((err: unknown) => {
      console.error('Autosave boot persist failed', err);
    });

    const unsub = useGameStore.subscribe((state, prev) => {
      // Ignore lastTickAt-only noise from the production tick clock.
      if (state.tokens === prev.tokens && state.owned === prev.owned) {
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
      cancelled = true;
      unsub();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', flush);
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, [enabled]);
}
