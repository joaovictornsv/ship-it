import { selectTokensPerSecond, useGameStore } from '../../game/state';

const integerFormat = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

function formatTokens(tokens: number): string {
  return integerFormat.format(Math.floor(tokens));
}

function formatRate(tps: number): string {
  return integerFormat.format(Math.floor(tps));
}

/** Header (or equivalent) token bank + tokens/s display. */
export function TokensBank() {
  const tokens = useGameStore((state) => state.tokens);
  const tps = useGameStore(selectTokensPerSecond);
  const tokenLabel = Math.floor(tokens) === 1 ? 'token' : 'tokens';

  return (
    <div className="text-right text-sm tabular-nums text-[var(--ship-muted)]">
      <p aria-live="polite">
        <span className="font-semibold text-[var(--ship-ink)]">
          {formatTokens(tokens)}
        </span>{' '}
        {tokenLabel}
      </p>
      <p
        className="text-xs text-[color-mix(in_srgb,var(--ship-muted)_85%,transparent)]"
        aria-live="polite"
      >
        {formatRate(tps)} tokens/s
      </p>
    </div>
  );
}
