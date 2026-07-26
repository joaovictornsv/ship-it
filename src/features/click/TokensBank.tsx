import { selectTokensPerSecond, useGameStore } from '../../game/state';

function formatTokens(tokens: number): string {
  const fractionDigits = Number.isInteger(tokens) ? 0 : 1;
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  }).format(tokens);
}

function formatRate(tps: number): string {
  if (tps === 0) return '0';
  const digits = tps < 1 ? 1 : tps < 10 ? 1 : 0;
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: digits,
    minimumFractionDigits: tps < 10 && tps > 0 ? 1 : 0,
  }).format(tps);
}

/** Header (or equivalent) token bank + tokens/s display. */
export function TokensBank() {
  const tokens = useGameStore((state) => state.tokens);
  const tps = useGameStore(selectTokensPerSecond);
  const tokenLabel = tokens === 1 ? 'token' : 'tokens';

  return (
    <div className="text-right text-sm tabular-nums text-black/70">
      <p aria-live="polite">
        <span className="font-semibold text-[var(--ship-ink)]">
          {formatTokens(tokens)}
        </span>{' '}
        {tokenLabel}
      </p>
      <p className="text-xs text-black/55" aria-live="polite">
        {formatRate(tps)} tokens/s
      </p>
    </div>
  );
}
