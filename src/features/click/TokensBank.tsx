import { useEffect, useRef, useState } from 'react';
import { selectTokensPerSecond, useGameStore } from '../../game/state';
import { formatTokensCompact } from '../../game/format';
import { subscribeProductionTick } from '../shop/productionPulse';

/**
 * Game HUD token bank + tokens/s — docks on the Ship It cluster (not the header).
 * tokens/s pulses briefly when passive production lands.
 */
export function TokensBank() {
  const tokens = useGameStore((state) => state.tokens);
  const tps = useGameStore(selectTokensPerSecond);
  const flooredTokens = Math.floor(tokens);
  const tokenLabel = flooredTokens === 1 ? 'token' : 'tokens';
  const [tpsPulse, setTpsPulse] = useState(false);
  const [spendFlash, setSpendFlash] = useState(false);
  const prevTokensRef = useRef(tokens);

  useEffect(() => {
    return subscribeProductionTick(() => {
      setTpsPulse(false);
      requestAnimationFrame(() => {
        setTpsPulse(true);
      });
    });
  }, []);

  useEffect(() => {
    if (tokens < prevTokensRef.current) {
      setSpendFlash(false);
      requestAnimationFrame(() => {
        setSpendFlash(true);
      });
    }
    prevTokensRef.current = tokens;
  }, [tokens]);

  return (
    <div
      className={[
        'w-full rounded-2xl border border-[var(--ship-line)]',
        'bg-[color-mix(in_srgb,var(--ship-bg-elevated)_90%,transparent)] px-4 py-3',
        'text-center shadow-[0_1px_0_color-mix(in_srgb,var(--ship-ink)_6%,transparent)]',
        spendFlash ? 'buy-spend-flash' : '',
      ].join(' ')}
      onAnimationEnd={(event) => {
        if (event.animationName === 'buy-spend-flash') {
          setSpendFlash(false);
        }
      }}
    >
      <p
        className="text-3xl font-bold tracking-tight tabular-nums text-[var(--ship-ink)] sm:text-4xl"
        aria-live="polite"
      >
        <span className="text-[var(--ship-token)]">
          {formatTokensCompact(tokens)}
        </span>{' '}
        <span className="text-lg font-semibold text-[var(--ship-muted)] sm:text-xl">
          {tokenLabel}
        </span>
      </p>
      <p
        className={[
          'mt-1 text-sm tabular-nums text-[var(--ship-muted)]',
          tpsPulse ? 'tokens-tps-pulse inline-block' : 'inline-block',
        ].join(' ')}
        aria-live="polite"
        onAnimationEnd={() => setTpsPulse(false)}
      >
        {formatTokensCompact(tps)} tokens/s
      </p>
    </div>
  );
}
