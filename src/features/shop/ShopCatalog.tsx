import { prestigeUpgrades } from '../../data/prestigeUpgrades';
import { visibleShipUpgradeQueue } from '../../data/shipUpgrades';
import { upgrades } from '../../data/upgrades';
import {
  prestigeTokensPerSecondMult,
  shipUpgradesUnlocked,
} from '../../game/economy';
import { formatTokensCompact } from '../../game/format';
import { useGameStore } from '../../game/state';
import { ShopBuyModeControl } from './ShopBuyModeControl';
import { ShopPrestigeRow } from './ShopPrestigeRow';
import { ShopRow } from './ShopRow';
import { ShopShipTile } from './ShopShipTile';
import { useBuyMode } from './useBuyMode';

/** Shared catalog for the desktop rail and mobile drawer. */
export function ShopCatalog() {
  const owned = useGameStore((s) => s.owned);
  const shipOwned = useGameStore((s) => s.shipOwned);
  const rewrites = useGameStore((s) => s.rewrites);
  const prestigeOwned = useGameStore((s) => s.prestigeOwned);
  const unlocked = shipUpgradesUnlocked(owned);
  const queue = unlocked ? visibleShipUpgradeQueue(shipOwned) : [];
  const [buyMode, setBuyMode] = useBuyMode();
  const tpsMult = prestigeTokensPerSecondMult(rewrites, prestigeOwned);

  return (
    <div className="flex flex-col gap-5">
      <section aria-labelledby="shop-ship-upgrades-heading">
        <div className="mb-2 px-0.5">
          <h3
            id="shop-ship-upgrades-heading"
            className="text-sm font-semibold tracking-tight text-[var(--ship-ink)]"
          >
            Ship upgrades
          </h3>
          <p className="text-xs text-[var(--ship-muted)]">
            tokens per click · one-shot queue
          </p>
        </div>
        {queue.length === 0 ? (
          <p className="px-0.5 text-xs text-[var(--ship-muted)]">
            {unlocked
              ? 'No Ship upgrades available. Check Achievements for what you own.'
              : 'Buy a building to unlock the Ship upgrades queue.'}
          </p>
        ) : (
          <ul
            className={[
              'flex list-none gap-2 overflow-x-auto p-0 pb-1',
              'snap-x snap-mandatory',
              '[-ms-overflow-style:none] [scrollbar-width:thin]',
            ].join(' ')}
          >
            {queue.map((upgrade) => (
              <li key={upgrade.id} className="snap-start">
                <ShopShipTile upgrade={upgrade} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="shop-buildings-heading">
        <div className="mb-2 flex flex-wrap items-end justify-between gap-2 px-0.5">
          <div className="min-w-0">
            <h3
              id="shop-buildings-heading"
              className="text-sm font-semibold tracking-tight text-[var(--ship-ink)]"
            >
              Buildings
            </h3>
            <p className="text-xs text-[var(--ship-muted)]">
              tokens/s producers
            </p>
          </div>
          <ShopBuyModeControl mode={buyMode} onChange={setBuyMode} />
        </div>
        <ul className="flex list-none flex-col gap-2 p-0">
          {upgrades.map((upgrade) => (
            <li key={upgrade.id}>
              <ShopRow upgrade={upgrade} buyMode={buyMode} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="shop-rewrites-heading">
        <div className="mb-2 px-0.5">
          <h3
            id="shop-rewrites-heading"
            className="text-sm font-semibold tracking-tight text-[var(--ship-ink)]"
          >
            Rewrites shop
          </h3>
          <p className="text-xs text-[var(--ship-muted)]">
            permanent power · spend{' '}
            <span className="font-semibold tabular-nums text-[var(--ship-rewrite)]">
              {formatTokensCompact(rewrites)}
            </span>{' '}
            Rewrites
            {tpsMult > 1 ? <> · ×{tpsMult.toFixed(2)} tokens/s</> : null}
          </p>
        </div>
        <ul className="flex list-none flex-col gap-2 p-0">
          {prestigeUpgrades.map((upgrade) => (
            <li key={upgrade.id}>
              <ShopPrestigeRow upgrade={upgrade} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
