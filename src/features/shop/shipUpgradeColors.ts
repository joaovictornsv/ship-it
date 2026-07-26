import type {
  ShipUpgradeColorVar,
  ShipUpgradeIconId,
  ShipUpgradeId,
} from '../../data/shipUpgrades';
import { getShipUpgrade, getShipUpgradeByIcon } from '../../data/shipUpgrades';

export type { ShipUpgradeColorVar };

export function shipUpgradeColorVar(id: ShipUpgradeId): ShipUpgradeColorVar {
  return getShipUpgrade(id).colorVar;
}

export function shipUpgradeIconColorVar(
  icon: ShipUpgradeIconId,
): ShipUpgradeColorVar {
  return getShipUpgradeByIcon(icon).colorVar;
}
