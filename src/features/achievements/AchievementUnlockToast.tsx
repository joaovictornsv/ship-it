import { useEffect } from 'react';
import { getAchievement } from '../../data/achievements';
import { useGameStore } from '../../game/state';

const TOAST_LINGER_MS = 3200;

/**
 * Non-blocking HUD feedback when an achievement unlocks.
 * Shows one toast at a time from the FIFO queue; auto-dismisses.
 * Does not steal focus (no autoFocus / no dialog).
 */
export function AchievementUnlockToast() {
  const currentId = useGameStore((s) => s.achievementToastQueue[0] ?? null);
  const queued = useGameStore((s) => s.achievementToastQueue.length);
  const dismiss = useGameStore((s) => s.dismissAchievementToast);

  useEffect(() => {
    if (currentId == null) {
      return;
    }
    const timer = window.setTimeout(() => {
      dismiss();
    }, TOAST_LINGER_MS);
    return () => window.clearTimeout(timer);
  }, [currentId, dismiss]);

  if (currentId == null) {
    return null;
  }

  const def = getAchievement(currentId);
  const more = queued > 1 ? queued - 1 : 0;

  return (
    <div
      className="achievement-toast-host pointer-events-none fixed inset-x-0 top-14 z-40 flex justify-center px-4"
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        className={[
          'achievement-toast pointer-events-none max-w-sm rounded-xl border border-[var(--ship-line)]',
          'bg-[color-mix(in_srgb,var(--ship-bg-elevated)_94%,transparent)] px-3 py-2.5 text-left',
          'shadow-[0_1px_0_color-mix(in_srgb,var(--ship-ink)_6%,transparent)]',
        ].join(' ')}
        role="status"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ship-accent-deep)]">
          Achievement unlocked
          {more > 0 ? (
            <span className="ml-1 font-normal normal-case tracking-normal text-[var(--ship-muted)]">
              · +{more} queued
            </span>
          ) : null}
        </p>
        <p className="mt-0.5 text-sm font-semibold tracking-tight text-[var(--ship-ink)]">
          {def.title}
        </p>
        <p className="mt-0.5 text-xs text-[var(--ship-muted)]">{def.blurb}</p>
      </div>
    </div>
  );
}
