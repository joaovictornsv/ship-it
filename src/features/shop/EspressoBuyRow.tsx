import { ESPRESSO_MACHINE, ESPRESSO_MACHINE_ID } from '../../data/upgrades';
import { espressoMachineCost } from '../../game/economy';
import { selectEspressoOwned, useGameStore } from '../../game/state';

function formatCost(beans: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(
    beans,
  );
}

/**
 * Minimal single-row buy UI for the Espresso machine (full shop rail in #6).
 */
export function EspressoBuyRow() {
  const beans = useGameStore((s) => s.beans);
  const owned = useGameStore(selectEspressoOwned);
  const buyUpgrade = useGameStore((s) => s.buyUpgrade);
  const cost = espressoMachineCost(owned);
  const canAfford = beans >= cost;

  return (
    <section
      className="w-full max-w-md rounded-xl border border-black/10 bg-white/50 px-4 py-3 text-left"
      aria-label="Espresso machine"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-semibold tracking-tight">
            {ESPRESSO_MACHINE.name}
          </h2>
          <p className="mt-0.5 text-sm text-black/60">
            {ESPRESSO_MACHINE.blurb}
          </p>
          <p className="mt-2 text-xs tabular-nums text-black/55">
            Owned {owned} · +{ESPRESSO_MACHINE.beansPerSecond} beans/s each
          </p>
        </div>
        <button
          type="button"
          className={[
            'shrink-0 rounded-lg px-3 py-2 text-sm font-semibold tabular-nums',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ship-accent)]',
            canAfford
              ? 'bg-[var(--ship-accent)] text-white hover:brightness-110'
              : 'cursor-not-allowed bg-black/10 text-black/40',
          ].join(' ')}
          disabled={!canAfford}
          aria-label={`Buy ${ESPRESSO_MACHINE.name} for ${formatCost(cost)} beans`}
          onClick={() => buyUpgrade(ESPRESSO_MACHINE_ID)}
        >
          {formatCost(cost)} beans
        </button>
      </div>
    </section>
  );
}
