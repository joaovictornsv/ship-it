import { useEffect, useRef, useState } from 'react';
import { selectTokensPerSecond, useGameStore } from '../../game/state';
import { formatTokensCompact } from '../../game/format';
import { subscribeProductionTick } from '../shop/productionPulse';

/** Min gap between tokens/s pulses so 10Hz ticks don't strobe the HUD. */
const TPS_PULSE_MIN_MS = 1600;

/**
 * Game HUD token bank + tokens/s — docks on the Ship It cluster (not the header).
 * tokens/s gives a soft, throttled nudge when passive production is landing.
 */
export function TokensBank() {
  const tokens = useGameStore((state) => state.tokens);
  const rewrites = useGameStore((state) => state.rewrites);
  const tps = useGameStore(selectTokensPerSecond);
  const flooredTokens = Math.floor(tokens);
  const tokenLabel = flooredTokens === 1 ? 'token' : 'tokens';
  const [tpsPulse, setTpsPulse] = useState(false);
  const [spendFlash, setSpendFlash] = useState(false);
  const prevTokensRef = useRef(tokens);
  const lastPulseAtRef = useRef(0);

  useEffect(() => {
    return subscribeProductionTick(() => {
      const now = Date.now();
      if (now - lastPulseAtRef.current < TPS_PULSE_MIN_MS) {
        return;
      }
      lastPulseAtRef.current = now;
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
      {rewrites > 0 ? (
        <p className="mt-1 text-xs tabular-nums text-[var(--ship-muted)]">
          <span className="font-semibold text-[var(--ship-rewrite)]">
            {formatTokensCompact(rewrites)}
          </span>{' '}
          {rewrites === 1 ? 'Rewrite' : 'Rewrites'} banked
        </p>
      ) : null}
    </div>
  );
}
