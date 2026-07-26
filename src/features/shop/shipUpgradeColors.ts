import type { ShipUpgradeIconId, ShipUpgradeId } from '../../data/shipUpgrades';
import {
  DARK_MODE_ID,
  LGTM_STAMP_ID,
  MECHANICAL_KEYBOARD_ID,
  RUBBER_DUCK_ID,
  STACK_OVERFLOW_TAB_ID,
} from '../../data/shipUpgrades';

/** CSS custom-property name for a Ship upgrade accent. */
export type ShipUpgradeColorVar =
  | '--ship-upgrade-rubber-duck'
  | '--ship-upgrade-keyboard'
  | '--ship-upgrade-stack-overflow'
  | '--ship-upgrade-dark-mode'
  | '--ship-upgrade-lgtm';

const BY_ID: Record<ShipUpgradeId, ShipUpgradeColorVar> = {
  [RUBBER_DUCK_ID]: '--ship-upgrade-rubber-duck',
  [MECHANICAL_KEYBOARD_ID]: '--ship-upgrade-keyboard',
  [STACK_OVERFLOW_TAB_ID]: '--ship-upgrade-stack-overflow',
  [DARK_MODE_ID]: '--ship-upgrade-dark-mode',
  [LGTM_STAMP_ID]: '--ship-upgrade-lgtm',
};

const BY_ICON: Record<ShipUpgradeIconId, ShipUpgradeColorVar> = {
  'rubber-duck': '--ship-upgrade-rubber-duck',
  'mechanical-keyboard': '--ship-upgrade-keyboard',
  'stack-overflow-tab': '--ship-upgrade-stack-overflow',
  'dark-mode': '--ship-upgrade-dark-mode',
  'lgtm-stamp': '--ship-upgrade-lgtm',
};

export function shipUpgradeColorVar(id: ShipUpgradeId): ShipUpgradeColorVar {
  return BY_ID[id];
}

export function shipUpgradeIconColorVar(
  icon: ShipUpgradeIconId,
): ShipUpgradeColorVar {
  return BY_ICON[icon];
}
