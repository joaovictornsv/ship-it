import { useState } from 'react';
import {
  isRewriteAvailable,
  previewRewritePower,
  rewritesGained,
  tokensUntilRewrite,
} from '../../game/economy';
import { formatTokensCompact } from '../../game/format';
import { useGameStore } from '../../game/state';
import { RewriteConfirmDialog } from './RewriteConfirmDialog';

/**
 * Rewrite affordance under Ship It (#49):
 * - Locked: one muted progress line (tokens until next whole Rewrite)
 * - Available: compact CTA → confirm → Rewrites shop
 */
export function RewritePanel() {
  const tokens = useGameStore((s) => s.tokens);
  const tokensEarnedThisRun = useGameStore((s) => s.tokensEarnedThisRun);
  const rewrites = useGameStore((s) => s.rewrites);
  const prestigeOwned = useGameStore((s) => s.prestigeOwned);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const available = isRewriteAvailable(tokensEarnedThisRun);

  if (!available) {
    const until = tokensUntilRewrite(tokensEarnedThisRun);
    const untilLabel = formatTokensCompact(until);
    return (
      <p
        className="w-full text-center text-xs tabular-nums text-[var(--ship-muted)]"
        role="status"
        aria-label={`Rewrite locked. Earn ${untilLabel} more tokens this run to unlock.`}
      >
        Rewrite · {untilLabel} more
      </p>
    );
  }

  const gained = rewritesGained(tokensEarnedThisRun);
  const preview = previewRewritePower(rewrites, gained, prestigeOwned);

  return (
    <>
      <div className="flex items-center justify-center gap-2.5">
        <p className="text-xs leading-none text-[var(--ship-muted)]">
          <span className="font-semibold text-[var(--ship-ink)]">Rewrite</span>
          {' · '}
          bank {formatTokensCompact(gained)} Rewrite
          {gained === 1 ? '' : 's'}
        </p>
        <button
          type="button"
          className={[
            'inline-flex h-8 shrink-0 items-center rounded-lg px-3',
            'border border-[var(--ship-accent)] bg-[var(--ship-bg-elevated)]',
            'text-sm font-semibold leading-none text-[var(--ship-accent)]',
            'hover:bg-[color-mix(in_srgb,var(--ship-accent)_10%,var(--ship-bg-elevated))]',
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
