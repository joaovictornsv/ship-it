import { useState } from 'react';
import {
  isRewriteAvailable,
  prestigeTokensPerSecondMult,
  previewRewritePower,
  rewritesGained,
  tokensUntilRewrite,
} from '../../game/economy';
import { formatTokensCompact } from '../../game/format';
import { useGameStore } from '../../game/state';
import { RewriteConfirmDialog } from './RewriteConfirmDialog';

/**
 * Rewrite status + CTA near the token bank.
 * Grayed preview until ≥1 Rewrite is available; confirm before soft reset.
 */
export function RewritePanel() {
  const tokens = useGameStore((s) => s.tokens);
  const tokensEarnedThisRun = useGameStore((s) => s.tokensEarnedThisRun);
  const rewrites = useGameStore((s) => s.rewrites);
  const prestigeOwned = useGameStore((s) => s.prestigeOwned);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const available = isRewriteAvailable(tokensEarnedThisRun);
  const gained = rewritesGained(tokensEarnedThisRun);
  const until = tokensUntilRewrite(tokensEarnedThisRun);
  const preview = previewRewritePower(rewrites, gained, prestigeOwned);
  const currentMult = prestigeTokensPerSecondMult(rewrites, prestigeOwned);

  return (
    <>
      <div
        className={[
          'w-full rounded-xl border border-[var(--ship-line)]',
          'bg-[color-mix(in_srgb,var(--ship-bg-elevated)_88%,transparent)] px-3 py-2.5',
          'text-left',
        ].join(' ')}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-tight text-[var(--ship-ink)]">
              Rewrite
            </p>
            <p className="mt-0.5 text-xs text-[var(--ship-muted)]">
              {available
                ? `Ready — bank ${formatTokensCompact(gained)} Rewrite${gained === 1 ? '' : 's'}`
                : `Earn ${formatTokensCompact(until)} more tokens this run`}
            </p>
            {rewrites > 0 || currentMult > 1 ? (
              <p className="mt-1 text-xs tabular-nums text-[var(--ship-muted)]">
                Bank{' '}
                <span className="font-semibold text-[var(--ship-rewrite)]">
                  {formatTokensCompact(rewrites)}
                </span>{' '}
                · ×{currentMult.toFixed(2)} tokens/s
              </p>
            ) : null}
          </div>
          <button
            type="button"
            className={[
              'shrink-0 rounded-lg px-3 py-1.5 text-sm font-semibold',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ship-accent)]',
              available
                ? 'bg-[var(--ship-accent)] text-white hover:brightness-110'
                : 'cursor-not-allowed bg-[color-mix(in_srgb,var(--ship-ink)_8%,transparent)] text-[color-mix(in_srgb,var(--ship-muted)_70%,transparent)]',
            ].join(' ')}
            disabled={!available}
            aria-label={
              available
                ? `Rewrite and bank ${formatTokensCompact(gained)} Rewrites`
                : `Rewrite locked — earn ${formatTokensCompact(until)} more tokens`
            }
            onClick={() => setConfirmOpen(true)}
          >
            Rewrite
          </button>
        </div>
        {available ? (
          <p className="mt-2 text-xs tabular-nums text-[var(--ship-muted)]">
            Lose {formatTokensCompact(tokens)} tokens · new power ×
            {preview.tpsMult.toFixed(2)} tokens/s
          </p>
        ) : null}
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
