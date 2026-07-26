import { useState } from 'react';
import { X } from 'lucide-react';

const TIP_STORAGE_KEY = 'ship-it-play-tip-dismissed';

function isTipDismissed(): boolean {
  try {
    return window.localStorage.getItem(TIP_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

/**
 * One-shot ephemeral tip near the click cluster.
 * Dismissible; stays gone for this browser via localStorage.
 */
export function PlayTip() {
  const [visible, setVisible] = useState(() => !isTipDismissed());

  if (!visible) {
    return null;
  }

  function dismiss() {
    setVisible(false);
    try {
      window.localStorage.setItem(TIP_STORAGE_KEY, '1');
    } catch {
      // ignore
    }
  }

  return (
    <div
      className="play-tip relative max-w-sm rounded-xl border border-[var(--ship-line)] bg-[color-mix(in_srgb,var(--ship-bg-elevated)_92%,transparent)] px-3 py-2 text-left text-sm text-[var(--ship-muted)] shadow-[0_1px_0_color-mix(in_srgb,var(--ship-ink)_6%,transparent)]"
      role="status"
    >
      <p className="pr-8">
        Click Ship It to earn tokens. Hire Devs and buy tools for tokens/s.
      </p>
      <button
        type="button"
        className="absolute right-1.5 top-1.5 inline-flex size-7 items-center justify-center rounded-lg text-[var(--ship-muted)] hover:bg-[color-mix(in_srgb,var(--ship-ink)_6%,transparent)] hover:text-[var(--ship-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ship-accent)]"
        aria-label="Dismiss tip"
        onClick={dismiss}
      >
        <X className="size-4" strokeWidth={2} aria-hidden />
      </button>
    </div>
  );
}
