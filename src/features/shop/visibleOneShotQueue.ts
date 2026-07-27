import {
  visibleBuildingUpgradeQueue,
  type BuildingUpgradeDef,
} from '../../data/buildingUpgrades';
import {
  visibleShipUpgradeQueue,
  type ShipUpgradeDef,
} from '../../data/shipUpgrades';
import type {
  OwnedBuildingUpgrades,
  OwnedShipUpgrades,
  OwnedUpgrades,
} from '../../game/types';
import { shipUpgradesUnlocked } from '../../game/economy';

export type OneShotQueueItem =
  | { kind: 'ship'; upgrade: ShipUpgradeDef; cost: number }
  | { kind: 'building'; upgrade: BuildingUpgradeDef; cost: number };

/**
 * Combined horizontal queue: next Ship upgrade (ladder) + all available
 * building upgrades, interleaved by ascending cost (Cookie-style).
 */
export function visibleOneShotQueue(
  owned: OwnedUpgrades,
  shipOwned: OwnedShipUpgrades,
  buildingOwned: OwnedBuildingUpgrades,
): OneShotQueueItem[] {
  const items: OneShotQueueItem[] = [];

  if (shipUpgradesUnlocked(owned)) {
    for (const upgrade of visibleShipUpgradeQueue(shipOwned)) {
      items.push({ kind: 'ship', upgrade, cost: upgrade.cost });
    }
  }

  for (const upgrade of visibleBuildingUpgradeQueue(owned, buildingOwned)) {
    items.push({ kind: 'building', upgrade, cost: upgrade.cost });
  }

  items.sort(
    (a, b) => a.cost - b.cost || a.upgrade.id.localeCompare(b.upgrade.id),
  );
  return items;
}
