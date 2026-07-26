import { ESPRESSO_MACHINE, type UpgradeId, upgrades } from '../data/upgrades';
import type { Beans, OwnedUpgrades } from './types';

/** Cookie Clicker–style building cost growth per owned unit. */
export const COST_GROWTH = 1.15;

/**
 * Beans earned per Ship It click.
 * Base click power is 1; modifiers land with later upgrades / prestige.
 */
export function clickPower(): Beans {
  return 1;
}

/**
 * Cookie-style rising cost for the next purchase of an upgrade.
 * `cost = ceil(baseCost * COST_GROWTH ^ owned)`.
 */
export function upgradeCost(baseCost: Beans, owned: number): Beans {
  if (owned < 0) {
    throw new Error('owned must be >= 0');
  }
  return Math.ceil(baseCost * COST_GROWTH ** owned);
}

/** Next purchase cost for a catalog upgrade given current owned count. */
export function nextUpgradeCost(id: UpgradeId, owned: number): Beans {
  const def = upgrades.find((u) => u.id === id);
  if (!def) {
    throw new Error(`Unknown upgrade id: ${id}`);
  }
  return upgradeCost(def.baseCost, owned);
}

function ownedCount(owned: OwnedUpgrades, id: UpgradeId): number {
  return owned[id] ?? 0;
}

/**
 * Total passive beans/s from owned producers (no prestige mults yet).
 */
export function beansPerSecond(owned: OwnedUpgrades): number {
  let total = 0;
  for (const def of upgrades) {
    total += ownedCount(owned, def.id) * def.beansPerSecond;
  }
  return total;
}

/** Beans granted over `deltaMs` at the given beans/s rate. */
export function beansFromDelta(bps: number, deltaMs: number): Beans {
  if (deltaMs <= 0 || bps <= 0) {
    return 0;
  }
  return bps * (deltaMs / 1000);
}

/** Convenience: Espresso machine next cost from owned count. */
export function espressoMachineCost(owned: number): Beans {
  return upgradeCost(ESPRESSO_MACHINE.baseCost, owned);
}
