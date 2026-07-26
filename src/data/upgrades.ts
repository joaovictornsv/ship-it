import type { Beans } from '../game/types';

/** Stable upgrade IDs — do not rename without a save migrator. */
export const ESPRESSO_MACHINE_ID = 'espresso-machine' as const;

export type UpgradeId = typeof ESPRESSO_MACHINE_ID;

export type UpgradeDef = {
  id: UpgradeId;
  name: string;
  /** Short joke blurb for shop rows. */
  blurb: string;
  /** Cost of the first purchase (owned = 0). */
  baseCost: Beans;
  /** Passive beans/s contributed per owned unit. */
  beansPerSecond: number;
};

/**
 * First ladder building: small beans/s producer (not a click-power boost).
 * Costs / rates are playtest-tuned starting points.
 */
export const ESPRESSO_MACHINE: UpgradeDef = {
  id: ESPRESSO_MACHINE_ID,
  name: 'Espresso machine',
  blurb: 'A tiny drip of automation. Smells like progress.',
  baseCost: 15,
  beansPerSecond: 0.1,
};

export const upgrades = [ESPRESSO_MACHINE] as const;

export function getUpgrade(id: UpgradeId): UpgradeDef {
  const found = upgrades.find((u) => u.id === id);
  if (!found) {
    throw new Error(`Unknown upgrade id: ${id}`);
  }
  return found;
}
