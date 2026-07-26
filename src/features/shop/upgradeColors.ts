import type {
  UpgradeColorVar,
  UpgradeIconId,
  UpgradeId,
} from '../../data/upgrades';
import { getUpgrade, getUpgradeByIcon } from '../../data/upgrades';

export type { UpgradeColorVar };

export function upgradeColorVar(id: UpgradeId): UpgradeColorVar {
  return getUpgrade(id).colorVar;
}

export function upgradeIconColorVar(icon: UpgradeIconId): UpgradeColorVar {
  return getUpgradeByIcon(icon).colorVar;
}
