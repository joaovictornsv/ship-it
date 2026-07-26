import { shipUpgrades } from '../../data/shipUpgrades';
import { upgrades } from '../../data/upgrades';
import {
  hasShipUpgrade,
  nextShipUpgradeId,
  shipUpgradesUnlocked,
} from '../../game/economy';
import { useGameStore } from '../../game/state';
import { ShopRow } from './ShopRow';
import { ShopShipRow } from './ShopShipRow';

/** Shared catalog for the desktop rail and mobile drawer. */
export function ShopCatalog() {
  const owned = useGameStore((s) => s.owned);
  const shipOwned = useGameStore((s) => s.shipOwned);
  const unlocked = shipUpgradesUnlocked(owned);
  const nextId = nextShipUpgradeId(shipOwned);

  return (
    <div className="flex flex-col gap-5">
      <section aria-labelledby="shop-buildings-heading">
        <div className="mb-2 px-0.5">
          <h3
            id="shop-buildings-heading"
            className="text-sm font-semibold tracking-tight text-[var(--ship-ink)]"
          >
            Buildings
          </h3>
          <p className="text-xs text-[var(--ship-muted)]">tokens/s producers</p>
        </div>
        <ul className="flex list-none flex-col gap-2 p-0">
          {upgrades.map((upgrade) => (
            <li key={upgrade.id}>
              <ShopRow upgrade={upgrade} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="shop-ship-upgrades-heading">
        <div className="mb-2 px-0.5">
          <h3
            id="shop-ship-upgrades-heading"
            className="text-sm font-semibold tracking-tight text-[var(--ship-ink)]"
          >
            Ship upgrades
          </h3>
          <p className="text-xs text-[var(--ship-muted)]">
            tokens per click · one-shot
          </p>
        </div>
        <ul className="flex list-none flex-col gap-2 p-0">
          {shipUpgrades.map((upgrade) => {
            const ownedFlag = hasShipUpgrade(shipOwned, upgrade.id);
            const available = ownedFlag || nextId === upgrade.id;
            return (
              <li key={upgrade.id}>
                <ShopShipRow
                  upgrade={upgrade}
                  unlocked={unlocked}
                  available={available}
                  owned={ownedFlag}
                />
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
