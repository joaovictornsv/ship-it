import { prestigeUpgrades } from '../../data/prestigeUpgrades';
import { upgrades } from '../../data/upgrades';
import { prestigeTokensPerSecondMult } from '../../game/economy';
import { formatTokensCompact } from '../../game/format';
import { useGameStore } from '../../game/state';
import { ShopBuildingTile } from './ShopBuildingTile';
import { ShopBuyModeControl } from './ShopBuyModeControl';
import { ShopPrestigeRow } from './ShopPrestigeRow';
import { ShopRow } from './ShopRow';
import { ShopShipTile } from './ShopShipTile';
import { useBuyMode } from './useBuyMode';
import { visibleOneShotQueue } from './visibleOneShotQueue';

/** Shared catalog for the desktop rail and mobile drawer. */
export function ShopCatalog() {
  const owned = useGameStore((s) => s.owned);
  const shipOwned = useGameStore((s) => s.shipOwned);
  const buildingOwned = useGameStore((s) => s.buildingOwned);
  const rewrites = useGameStore((s) => s.rewrites);
  const prestigeOwned = useGameStore((s) => s.prestigeOwned);
  const queue = visibleOneShotQueue(owned, shipOwned, buildingOwned);
  const [buyMode, setBuyMode] = useBuyMode();
  const tpsMult = prestigeTokensPerSecondMult(rewrites, prestigeOwned);
  const hasAnyBuilding = Object.values(owned).some((n) => (n ?? 0) > 0);

  return (
    <div className="flex flex-col gap-5">
      <section aria-labelledby="shop-upgrades-heading">
        <div className="mb-2 px-0.5">
          <h3
            id="shop-upgrades-heading"
            className="text-sm font-semibold tracking-tight text-[var(--ship-ink)]"
          >
            Upgrades
          </h3>
          <p className="text-xs text-[var(--ship-muted)]">
            click power + building boosts · one-shot queue
          </p>
        </div>
        {queue.length === 0 ? (
          <p className="px-0.5 text-xs text-[var(--ship-muted)]">
            {hasAnyBuilding
              ? 'No upgrades available. Check Achievements for what you own.'
              : 'Buy a building to unlock the upgrades queue.'}
          </p>
        ) : (
          <ul
            className={[
              'flex list-none gap-2 overflow-x-auto p-0 pb-1',
              'snap-x snap-mandatory',
              '[-ms-overflow-style:none] [scrollbar-width:thin]',
            ].join(' ')}
          >
            {queue.map((item) => (
              <li
                key={`${item.kind}-${item.upgrade.id}`}
                className="snap-start"
              >
                {item.kind === 'ship' ? (
                  <ShopShipTile upgrade={item.upgrade} />
                ) : (
                  <ShopBuildingTile upgrade={item.upgrade} />
                )}
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
