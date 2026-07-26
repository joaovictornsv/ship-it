import type { UpgradeIconId, UpgradeId } from '../../data/upgrades';
import {
  CI_CD_ID,
  CODE_REVIEW_ID,
  DEV_ID,
  ESPRESSO_MACHINE_ID,
  ON_CALL_ID,
} from '../../data/upgrades';

/** CSS custom-property name for a shop/scene upgrade accent. */
export type UpgradeColorVar =
  | '--ship-upgrade-espresso'
  | '--ship-upgrade-dev'
  | '--ship-upgrade-code-review'
  | '--ship-upgrade-ci-cd'
  | '--ship-upgrade-on-call';

const BY_ID: Record<UpgradeId, UpgradeColorVar> = {
  [ESPRESSO_MACHINE_ID]: '--ship-upgrade-espresso',
  [DEV_ID]: '--ship-upgrade-dev',
  [CODE_REVIEW_ID]: '--ship-upgrade-code-review',
  [CI_CD_ID]: '--ship-upgrade-ci-cd',
  [ON_CALL_ID]: '--ship-upgrade-on-call',
};

const BY_ICON: Record<UpgradeIconId, UpgradeColorVar> = {
  coffee: '--ship-upgrade-espresso',
  dev: '--ship-upgrade-dev',
  'code-review': '--ship-upgrade-code-review',
  'ci-cd': '--ship-upgrade-ci-cd',
  'on-call': '--ship-upgrade-on-call',
};

export function upgradeColorVar(id: UpgradeId): UpgradeColorVar {
  return BY_ID[id];
}

export function upgradeIconColorVar(icon: UpgradeIconId): UpgradeColorVar {
  return BY_ICON[icon];
}
