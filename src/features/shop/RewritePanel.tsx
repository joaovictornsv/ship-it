import { useState } from 'react';
import {
  isRewriteAvailable,
  previewRewritePower,
  rewritesGained,
} from '../../game/economy';
import { formatTokensCompact } from '../../game/format';
import { useGameStore } from '../../game/state';
import { RewriteConfirmDialog } from './RewriteConfirmDialog';

/**
 * Discrete Rewrite CTA — mounts only when `rewritesGained ≥ 1` (#49).
 * Opens the confirm → Rewrites shop flow; no early grayed prestige chrome.
 */
export function RewritePanel() {
  const tokens = useGameStore((s) => s.tokens);
  const tokensEarnedThisRun = useGameStore((s) => s.tokensEarnedThisRun);
  const rewrites = useGameStore((s) => s.rewrites);
  const prestigeOwned = useGameStore((s) => s.prestigeOwned);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const available = isRewriteAvailable(tokensEarnedThisRun);
  if (!available) {
    return null;
  }

  const gained = rewritesGained(tokensEarnedThisRun);
  const preview = previewRewritePower(rewrites, gained, prestigeOwned);

  return (
    <>
      <div className="flex w-full items-center justify-between gap-3">
        <p className="min-w-0 text-xs text-[var(--ship-muted)]">
          <span className="font-semibold text-[var(--ship-ink)]">Rewrite</span>
          {' · '}
          bank {formatTokensCompact(gained)} Rewrite
          {gained === 1 ? '' : 's'}
        </p>
        <button
          type="button"
          className={[
            'shrink-0 rounded-lg bg-[var(--ship-accent)] px-3 py-1.5',
            'text-sm font-semibold text-white hover:brightness-110',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ship-accent)]',
          ].join(' ')}
          aria-label={`Rewrite and bank ${formatTokensCompact(gained)} Rewrites`}
          onClick={() => setConfirmOpen(true)}
        >
          Rewrite
        </button>
      </div>

      {confirmOpen ? (
        <RewriteConfirmDialog
          onClose={() => setConfirmOpen(false)}
          tokensLost={tokens}
          rewritesGained={gained}
          nextRewrites={preview.nextRewrites}
          nextTpsMult={preview.tpsMult}
        />
      ) : null}
    </>
  );
}
