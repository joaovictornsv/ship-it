import type { UpgradeDef } from '../../data/upgrades';
import { nextUpgradeCost } from '../../game/economy';
import { formatTokensCompact } from '../../game/format';
import { useGameStore } from '../../game/state';
import { onUpgradeOwnedChanged } from '../scene';
import { ShopUpgradeIcon } from './ShopUpgradeIcon';

type ShopRowProps = {
  upgrade: UpgradeDef;
};

/** One buyable upgrade row: icon, copy, owned, tokens/s, cost + buy. */
export function ShopRow({ upgrade }: ShopRowProps) {
  const tokens = useGameStore((s) => s.tokens);
  const owned = useGameStore((s) => s.owned[upgrade.id] ?? 0);
  const buyUpgrade = useGameStore((s) => s.buyUpgrade);
  const cost = nextUpgradeCost(upgrade.id, owned);
  const canAfford = tokens >= cost;

  return (
    <article
      className="rounded-xl border border-[var(--ship-line)] bg-[color-mix(in_srgb,var(--ship-bg-elevated)_88%,transparent)] px-4 py-3 text-left shadow-[0_1px_0_color-mix(in_srgb,var(--ship-ink)_6%,transparent)]"
      aria-label={upgrade.name}
    >
      <div className="flex items-start gap-3">
        <div
          className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border border-[var(--ship-line)] bg-[color-mix(in_srgb,var(--ship-bg)_70%,transparent)]"
          aria-hidden
        >
          <ShopUpgradeIcon icon={upgrade.icon} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-base font-semibold tracking-tight text-[var(--ship-ink)]">
                {upgrade.name}
              </h3>
              <p className="mt-0.5 text-sm text-[var(--ship-muted)]">
                {upgrade.blurb}
              </p>
              <p className="mt-2 text-xs tabular-nums text-[color-mix(in_srgb,var(--ship-muted)_90%,transparent)]">
                Owned {owned} · +{upgrade.tokensPerSecond} tokens/s each
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
              aria-label={`Buy ${upgrade.name} for ${formatTokensCompact(cost)} tokens`}
              onClick={() => {
                if (!buyUpgrade(upgrade.id)) {
                  return;
                }
                const nextOwned =
                  useGameStore.getState().owned[upgrade.id] ?? 0;
                onUpgradeOwnedChanged(upgrade.id, nextOwned);
              }}
            >
              {formatTokensCompact(cost)}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
