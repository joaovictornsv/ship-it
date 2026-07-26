import { ESPRESSO_MACHINE, type UpgradeId, upgrades } from '../data/upgrades';
import type { OwnedUpgrades, Tokens } from './types';

export { formatTokensCompact } from './format';

/** Cookie Clicker–style building cost growth per owned unit. */
export const COST_GROWTH = 1.15;

/**
 * Tokens earned per Ship It click.
 * Base click power is 1; modifiers land with later upgrades / prestige.
 */
export function clickPower(): Tokens {
  return 1;
}

/**
 * Cookie-style rising cost for the next purchase of an upgrade.
 * `cost = ceil(baseCost * COST_GROWTH ^ owned)`.
 */
export function upgradeCost(baseCost: Tokens, owned: number): Tokens {
  if (owned < 0) {
    throw new Error('owned must be >= 0');
  }
  return Math.ceil(baseCost * COST_GROWTH ** owned);
}

/** Next purchase cost for a catalog upgrade given current owned count. */
export function nextUpgradeCost(id: UpgradeId, owned: number): Tokens {
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
 * Total passive tokens/s from owned producers (no prestige mults yet).
 */
export function tokensPerSecond(owned: OwnedUpgrades): number {
  let total = 0;
  for (const def of upgrades) {
    total += ownedCount(owned, def.id) * def.tokensPerSecond;
  }
  return total;
}

/** Tokens granted over `deltaMs` at the given tokens/s rate. */
export function tokensFromDelta(tps: number, deltaMs: number): Tokens {
  if (deltaMs <= 0 || tps <= 0) {
    return 0;
  }
  return tps * (deltaMs / 1000);
}

/** Convenience: Espresso machine next cost from owned count. */
export function espressoMachineCost(owned: number): Tokens {
  return upgradeCost(ESPRESSO_MACHINE.baseCost, owned);
}
