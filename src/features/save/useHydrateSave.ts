import { useEffect, useState } from 'react';
import { useGameStore } from '../../game/state';
import { readSaveFromStorage } from './storage';

/**
 * Hydrate the game store from the single localStorage slot once on mount.
 * Checksum failures still load; `saveUntrusted` is set for the UI banner.
 */
export function useHydrateSave(): { ready: boolean; error: string | null } {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hydrateFromSave = useGameStore((s) => s.hydrateFromSave);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (typeof localStorage === 'undefined') {
        if (!cancelled) {
          setReady(true);
        }
        return;
      }
      try {
        const loaded = await readSaveFromStorage(localStorage);
        if (cancelled) {
          return;
        }
        if (loaded) {
          hydrateFromSave(loaded.file.state, {
            untrusted: !loaded.checksumOk,
            nowMs: Date.now(),
          });
        }
        setReady(true);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Could not load saved run',
          );
          setReady(true);
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [hydrateFromSave]);

  return { ready, error };
}
