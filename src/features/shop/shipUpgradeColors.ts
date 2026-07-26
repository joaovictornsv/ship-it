import type { ShipUpgradeIconId, ShipUpgradeId } from '../../data/shipUpgrades';
import {
  DARK_MODE_ID,
  GREEN_BUILD_ID,
  LGTM_STAMP_ID,
  MECHANICAL_KEYBOARD_ID,
  PAIR_PROGRAMMING_ID,
  POMODORO_ID,
  README_DRIVEN_ID,
  RUBBER_DUCK_ID,
  SHIP_IT_FRIDAY_ID,
  STACK_OVERFLOW_TAB_ID,
  STANDUP_ID,
  STICKY_NOTES_ID,
} from '../../data/shipUpgrades';

/** CSS custom-property name for a Ship upgrade accent. */
export type ShipUpgradeColorVar =
  | '--ship-upgrade-rubber-duck'
  | '--ship-upgrade-keyboard'
  | '--ship-upgrade-standup'
  | '--ship-upgrade-stack-overflow'
  | '--ship-upgrade-sticky-notes'
  | '--ship-upgrade-dark-mode'
  | '--ship-upgrade-pair'
  | '--ship-upgrade-lgtm'
  | '--ship-upgrade-pomodoro'
  | '--ship-upgrade-green-build'
  | '--ship-upgrade-readme'
  | '--ship-upgrade-friday';

const BY_ID: Record<ShipUpgradeId, ShipUpgradeColorVar> = {
  [RUBBER_DUCK_ID]: '--ship-upgrade-rubber-duck',
  [MECHANICAL_KEYBOARD_ID]: '--ship-upgrade-keyboard',
  [STANDUP_ID]: '--ship-upgrade-standup',
  [STACK_OVERFLOW_TAB_ID]: '--ship-upgrade-stack-overflow',
  [STICKY_NOTES_ID]: '--ship-upgrade-sticky-notes',
  [DARK_MODE_ID]: '--ship-upgrade-dark-mode',
  [PAIR_PROGRAMMING_ID]: '--ship-upgrade-pair',
  [LGTM_STAMP_ID]: '--ship-upgrade-lgtm',
  [POMODORO_ID]: '--ship-upgrade-pomodoro',
  [GREEN_BUILD_ID]: '--ship-upgrade-green-build',
  [README_DRIVEN_ID]: '--ship-upgrade-readme',
  [SHIP_IT_FRIDAY_ID]: '--ship-upgrade-friday',
};

const BY_ICON: Record<ShipUpgradeIconId, ShipUpgradeColorVar> = {
  'rubber-duck': '--ship-upgrade-rubber-duck',
  'mechanical-keyboard': '--ship-upgrade-keyboard',
  standup: '--ship-upgrade-standup',
  'stack-overflow-tab': '--ship-upgrade-stack-overflow',
  'sticky-notes': '--ship-upgrade-sticky-notes',
  'dark-mode': '--ship-upgrade-dark-mode',
  'pair-programming': '--ship-upgrade-pair',
  'lgtm-stamp': '--ship-upgrade-lgtm',
  pomodoro: '--ship-upgrade-pomodoro',
  'green-build': '--ship-upgrade-green-build',
  'readme-driven': '--ship-upgrade-readme',
  'ship-it-friday': '--ship-upgrade-friday',
};

export function shipUpgradeColorVar(id: ShipUpgradeId): ShipUpgradeColorVar {
  return BY_ID[id];
}

export function shipUpgradeIconColorVar(
  icon: ShipUpgradeIconId,
): ShipUpgradeColorVar {
  return BY_ICON[icon];
}
