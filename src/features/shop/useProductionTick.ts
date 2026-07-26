import { useEffect } from 'react';
import { useGameStore } from '../../game/state';

const TICK_MS = 100;

/**
 * Drives the passive tokens/s loop while the tab is open.
 * On hide → show, resumes the tick cursor without offline accrual.
 *
 * Pass `enabled=false` until save hydrate finishes so boot does not
 * advance an empty store (and trigger autosave) before restore.
 */
export function useProductionTick(
  enabled: boolean = true,
  now: () => number = Date.now,
): void {
  const tick = useGameStore((s) => s.tick);
  const resumeFromHidden = useGameStore((s) => s.resumeFromHidden);
  const ensureTickClock = useGameStore((s) => s.ensureTickClock);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    ensureTickClock(now());

    const id = window.setInterval(() => {
      tick(now());
    }, TICK_MS);

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        tick(now());
      } else {
        resumeFromHidden(now());
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [enabled, tick, resumeFromHidden, ensureTickClock, now]);
}
