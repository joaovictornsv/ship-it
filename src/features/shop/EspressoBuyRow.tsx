import { ESPRESSO_MACHINE, ESPRESSO_MACHINE_ID } from '../../data/upgrades';
import { espressoMachineCost } from '../../game/economy';
import { selectEspressoOwned, useGameStore } from '../../game/state';

function formatCost(tokens: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(
    tokens,
  );
}

/**
 * Minimal single-row buy UI for the Espresso machine (full shop rail in #6).
 */
export function EspressoBuyRow() {
  const tokens = useGameStore((s) => s.tokens);
  const owned = useGameStore(selectEspressoOwned);
  const buyUpgrade = useGameStore((s) => s.buyUpgrade);
  const cost = espressoMachineCost(owned);
  const canAfford = tokens >= cost;

  return (
    <section
      className="w-full max-w-md rounded-xl border border-[var(--ship-line)] bg-[color-mix(in_srgb,var(--ship-bg-elevated)_88%,transparent)] px-4 py-3 text-left shadow-[0_1px_0_color-mix(in_srgb,var(--ship-ink)_6%,transparent)]"
      aria-label="Espresso machine"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-semibold tracking-tight text-[var(--ship-ink)]">
            {ESPRESSO_MACHINE.name}
          </h2>
          <p className="mt-0.5 text-sm text-[var(--ship-muted)]">
            {ESPRESSO_MACHINE.blurb}
          </p>
          <p className="mt-2 text-xs tabular-nums text-[color-mix(in_srgb,var(--ship-muted)_90%,transparent)]">
            Owned {owned} · +{ESPRESSO_MACHINE.tokensPerSecond} tokens/s each
          </p>
        </div>
        <button
          type="button"
          className={[
            'shrink-0 rounded-lg px-3 py-2 text-sm font-semibold tabular-nums',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ship-accent)]',
            canAfford
              ? 'bg-[var(--ship-accent)] text-white hover:brightness-110'
              : 'cursor-not-allowed bg-[color-mix(in_srgb,var(--ship-ink)_8%,transparent)] text-[color-mix(in_srgb,var(--ship-muted)_70%,transparent)]',
          ].join(' ')}
          disabled={!canAfford}
          aria-label={`Buy ${ESPRESSO_MACHINE.name} for ${formatCost(cost)} tokens`}
          onClick={() => buyUpgrade(ESPRESSO_MACHINE_ID)}
        >
          {formatCost(cost)} tokens
        </button>
      </div>
    </section>
  );
}
