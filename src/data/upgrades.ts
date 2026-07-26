import type { Tokens } from '../game/types';

/** Stable upgrade IDs — do not rename without a save migrator. */
export const ESPRESSO_MACHINE_ID = 'espresso-machine' as const;
export const DEV_ID = 'dev' as const;
export const CODE_REVIEW_ID = 'code-review' as const;
export const CI_CD_ID = 'ci-cd' as const;
export const ON_CALL_ID = 'on-call' as const;

export type UpgradeId =
  | typeof ESPRESSO_MACHINE_ID
  | typeof DEV_ID
  | typeof CODE_REVIEW_ID
  | typeof CI_CD_ID
  | typeof ON_CALL_ID;

/** Free-license Lucide icon keys for shop rows (see `ShopUpgradeIcon`). */
export type UpgradeIconId =
  'coffee' | 'dev' | 'code-review' | 'ci-cd' | 'on-call';

export type UpgradeDef = {
  id: UpgradeId;
  name: string;
  /** Short joke blurb for shop rows. */
  blurb: string;
  /** Cost of the first purchase (owned = 0). */
  baseCost: Tokens;
  /** Passive tokens/s contributed per owned unit. */
  tokensPerSecond: number;
  icon: UpgradeIconId;
};

/**
 * Early ladder buildings: Cookie-style rising costs; rates are playtest starting points.
 * Scene presence for Dev / props lands with the living office (#7).
 */
export const ESPRESSO_MACHINE: UpgradeDef = {
  id: ESPRESSO_MACHINE_ID,
  name: 'Espresso machine',
  blurb: 'A tiny drip of automation. Smells like progress.',
  baseCost: 15,
  tokensPerSecond: 0.1,
  icon: 'coffee',
};

export const DEV: UpgradeDef = {
  id: DEV_ID,
  name: 'Dev',
  blurb: 'Ships features and coffee cups in equal measure.',
  baseCost: 100,
  tokensPerSecond: 1,
  icon: 'dev',
};

export const CODE_REVIEW: UpgradeDef = {
  id: CODE_REVIEW_ID,
  name: 'Code review',
  blurb: 'Two pairs of eyes, one LGTM, zero tests.',
  baseCost: 1_100,
  tokensPerSecond: 8,
  icon: 'code-review',
};

export const CI_CD: UpgradeDef = {
  id: CI_CD_ID,
  name: 'CI / CD',
  blurb: 'Green checks soothe the soul. Red ones build character.',
  baseCost: 12_000,
  tokensPerSecond: 47,
  icon: 'ci-cd',
};

export const ON_CALL: UpgradeDef = {
  id: ON_CALL_ID,
  name: 'On-call',
  blurb: 'Pager duty: the original idle notification.',
  baseCost: 130_000,
  tokensPerSecond: 260,
  icon: 'on-call',
};

/** Shop order: early → late (cost ladder). */
export const upgrades = [
  ESPRESSO_MACHINE,
  DEV,
  CODE_REVIEW,
  CI_CD,
  ON_CALL,
] as const;

export function getUpgrade(id: UpgradeId): UpgradeDef {
  const found = upgrades.find((u) => u.id === id);
  if (!found) {
    throw new Error(`Unknown upgrade id: ${id}`);
  }
  return found;
}
