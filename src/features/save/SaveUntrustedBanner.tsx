import { useGameStore } from '../../game/state';

/**
 * Banner when a loaded save failed the SHA-256 integrity check.
 * Play continues; player can dismiss.
 */
export function SaveUntrustedBanner() {
  const saveUntrusted = useGameStore((s) => s.saveUntrusted);
  const dismissSaveWarning = useGameStore((s) => s.dismissSaveWarning);

  if (!saveUntrusted) {
    return null;
  }

  return (
    <div
      role="status"
      className="border-b border-[var(--ship-line)] border-l-4 border-l-[var(--ship-accent-deep)] bg-[color-mix(in_srgb,var(--ship-bg-elevated)_94%,transparent)] px-4 py-2"
    >
      <div className="mx-auto flex max-w-6xl items-start justify-between gap-3 text-left">
        <p className="text-sm text-[var(--ship-ink)]">
          This save failed the integrity check. Progress still loaded — treat it
          as untrusted.
        </p>
        <button
          type="button"
          className="shrink-0 rounded-lg px-2 py-1 text-sm font-semibold text-[var(--ship-accent-deep)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ship-accent)]"
          onClick={dismissSaveWarning}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
