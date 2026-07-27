import { Medal } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAchievement } from '../../data/achievements';
import type { AchievementId } from '../../data/achievements';
import { useGameStore } from '../../game/state';

/** How long the unlock toast stays readable before exit begins. */
export const TOAST_LINGER_MS = 5500;
/** Exit fade duration before the next queued unlock (if any) appears. */
export const TOAST_EXIT_MS = 280;

/**
 * Non-blocking HUD feedback when an achievement unlocks.
 * Shows one toast at a time from the FIFO queue; auto-dismisses.
 * Does not steal focus (no autoFocus / no dialog).
 */
export function AchievementUnlockToast() {
  const currentId = useGameStore((s) => s.achievementToastQueue[0] ?? null);
  const queued = useGameStore((s) => s.achievementToastQueue.length);
  const dismiss = useGameStore((s) => s.dismissAchievementToast);

  if (currentId == null) {
    return null;
  }

  const more = queued > 1 ? queued - 1 : 0;

  return (
    <div
      className="achievement-toast-host pointer-events-none fixed inset-x-0 top-14 z-40 flex justify-center px-4"
      aria-live="polite"
      aria-atomic="true"
    >
      <AchievementUnlockToastItem
        key={currentId}
        achievementId={currentId}
        more={more}
        onDismiss={dismiss}
      />
    </div>
  );
}

function AchievementUnlockToastItem({
  achievementId,
  more,
  onDismiss,
}: {
  achievementId: AchievementId;
  more: number;
  onDismiss: () => void;
}) {
  const [exiting, setExiting] = useState(false);
  const def = getAchievement(achievementId);

  useEffect(() => {
    const exitTimer = window.setTimeout(() => {
      setExiting(true);
    }, TOAST_LINGER_MS);
    const dismissTimer = window.setTimeout(() => {
      onDismiss();
    }, TOAST_LINGER_MS + TOAST_EXIT_MS);
    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(dismissTimer);
    };
  }, [achievementId, onDismiss]);

  return (
    <div
      className={[
        'achievement-toast pointer-events-none flex max-w-md gap-3 rounded-xl border px-4 py-3 text-left',
        'border-[color-mix(in_srgb,var(--ship-accent)_35%,var(--ship-line))]',
        'bg-[color-mix(in_srgb,var(--ship-bg-elevated)_92%,var(--ship-token-soft)_8%)]',
        'shadow-[inset_3px_0_0_0_var(--ship-accent),0_1px_0_color-mix(in_srgb,var(--ship-ink)_6%,transparent)]',
        exiting ? 'achievement-toast-out' : null,
      ]
        .filter(Boolean)
        .join(' ')}
      role="status"
    >
      <div
        className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border border-[color-mix(in_srgb,var(--ship-accent)_28%,var(--ship-line))] bg-[color-mix(in_srgb,var(--ship-accent)_14%,transparent)] text-[var(--ship-accent-deep)]"
        aria-hidden
      >
        <Medal className="size-4" strokeWidth={2.5} />
      </div>
      <div className="min-w-0 flex-1">
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
