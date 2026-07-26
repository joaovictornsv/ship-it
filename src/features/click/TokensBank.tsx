import { selectTokensPerSecond, useGameStore } from '../../game/state';
import { formatTokensCompact } from '../../game/format';

/** Header (or equivalent) token bank + tokens/s display. */
export function TokensBank() {
  const tokens = useGameStore((state) => state.tokens);
  const tps = useGameStore(selectTokensPerSecond);
  const flooredTokens = Math.floor(tokens);
  const tokenLabel = flooredTokens === 1 ? 'token' : 'tokens';

  return (
    <div className="text-right text-sm tabular-nums text-[var(--ship-muted)]">
      <p aria-live="polite">
        <span className="font-semibold text-[var(--ship-ink)]">
          {formatTokensCompact(tokens)}
        </span>{' '}
        {tokenLabel}
      </p>
      <p
        className="text-xs text-[color-mix(in_srgb,var(--ship-muted)_85%,transparent)]"
        aria-live="polite"
      >
        {formatTokensCompact(tps)} tokens/s
      </p>
    </div>
  );
}
