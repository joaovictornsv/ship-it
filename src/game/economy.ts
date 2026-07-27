import {
  applyShipUpgradeEffect,
  getShipUpgrade,
  shipUpgrades,
  type ShipUpgradeId,
} from '../data/shipUpgrades';
import { ESPRESSO_MACHINE, type UpgradeId, upgrades } from '../data/upgrades';
import type { OwnedShipUpgrades, OwnedUpgrades, Tokens } from './types';

export { formatTokensCompact } from './format';

/** Cookie Clicker–style building cost growth per owned unit. */
export const COST_GROWTH = 1.15;

/**
 * Soft unlock for the Ship upgrades section: own at least one producer.
 * Keeps the first-30s path click → Espresso/Dev before the click-power track.
 */
export function shipUpgradesUnlocked(owned: OwnedUpgrades): boolean {
  for (const def of upgrades) {
    if ((owned[def.id] ?? 0) > 0) {
      return true;
    }
  }
  return false;
}

/** Whether a Ship upgrade has been purchased this run. */
export function hasShipUpgrade(
  shipOwned: OwnedShipUpgrades,
  id: ShipUpgradeId,
): boolean {
  return shipOwned[id] === true;
}

/**
 * Next one-shot Ship upgrade in ladder order, or null when the track is complete.
 * Earlier ladder steps must already be owned.
 */
export function nextShipUpgradeId(
  shipOwned: OwnedShipUpgrades,
): ShipUpgradeId | null {
  for (const def of shipUpgrades) {
    if (!hasShipUpgrade(shipOwned, def.id)) {
      return def.id;
    }
  }
  return null;
}

/** Fixed one-shot cost for a Ship upgrade (not Cookie rising). */
export function shipUpgradeCost(id: ShipUpgradeId): Tokens {
  return getShipUpgrade(id).cost;
}

/**
 * Tokens earned per Ship It click.
 * Base 1 + sum(flats), then × product(mults) from owned Ship upgrades.
 * Prestige Muscle memory (#9) will stack as a permanent % on top later.
 */
export function clickPower(shipOwned: OwnedShipUpgrades = {}): Tokens {
  const acc = { flat: 0, mult: 1 };
  for (const def of shipUpgrades) {
    if (!hasShipUpgrade(shipOwned, def.id)) {
      continue;
    }
    applyShipUpgradeEffect(acc, def.effect);
  }
  return (1 + acc.flat) * acc.mult;
}

/**
 * Highest owned Ship upgrade in ladder order, or null when none owned.
 * Drives Ship It CTA label / glyph / accent evolution — every owned step
 * must change the CTA (see each def's `ctaLabel`).
 */
export function highestShipUpgrade(
  shipOwned: OwnedShipUpgrades,
): (typeof shipUpgrades)[number] | null {
  let highest: (typeof shipUpgrades)[number] | null = null;
  for (const def of shipUpgrades) {
    if (hasShipUpgrade(shipOwned, def.id)) {
      highest = def;
    }
  }
  return highest;
}

/** CTA presentation from the highest owned Ship upgrade (or base Ship It). */
export function shipItCta(shipOwned: OwnedShipUpgrades): {
  label: string;
  icon: (typeof shipUpgrades)[number]['icon'] | null;
  upgradeId: (typeof shipUpgrades)[number]['id'] | null;
  emoji: string | null;
  colorVar: (typeof shipUpgrades)[number]['colorVar'] | null;
} {
  const highest = highestShipUpgrade(shipOwned);
  if (!highest) {
    return {
      label: 'Ship It',
      icon: null,
      upgradeId: null,
      emoji: null,
      colorVar: null,
    };
  }
  return {
    label: highest.ctaLabel,
    icon: highest.icon,
    upgradeId: highest.id,
    emoji: highest.emoji,
    colorVar: highest.colorVar,
  };
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

/**
 * Sum of Cookie-style rising costs for the next `n` purchases.
 * `Σ ceil(baseCost × COST_GROWTH^(owned+i))` for `i` in `[0, n)`.
 */
export function upgradeCostForN(
  baseCost: Tokens,
  owned: number,
  n: number,
): Tokens {
  if (owned < 0) {
    throw new Error('owned must be >= 0');
  }
  if (n < 0) {
    throw new Error('n must be >= 0');
  }
  if (n === 0) {
    return 0;
  }
  let total = 0;
  for (let i = 0; i < n; i++) {
    total += upgradeCost(baseCost, owned + i);
  }
  return total;
}

/** Catalog wrapper for {@link upgradeCostForN}. */
export function nextUpgradeCostForN(
  id: UpgradeId,
  owned: number,
  n: number,
): Tokens {
  const def = upgrades.find((u) => u.id === id);
  if (!def) {
    throw new Error(`Unknown upgrade id: ${id}`);
  }
  return upgradeCostForN(def.baseCost, owned, n);
}

/**
 * Largest `n ≥ 1` such that {@link upgradeCostForN} fits in `tokens`.
 * Returns `0` when even one unit is unaffordable (including empty bank).
 */
export function maxAffordableUpgrades(
  baseCost: Tokens,
  owned: number,
  tokens: Tokens,
): number {
  if (owned < 0) {
    throw new Error('owned must be >= 0');
  }
  if (tokens <= 0) {
    return 0;
  }
  const first = upgradeCost(baseCost, owned);
  if (tokens < first) {
    return 0;
  }

  let count = 0;
  let remaining = tokens;
  // Hard cap keeps Max snappy for absurd banks; far above normal play.
  const CAP = 1_000_000;
  while (count < CAP) {
    const next = upgradeCost(baseCost, owned + count);
    if (remaining < next) {
      break;
    }
    remaining -= next;
    count += 1;
  }
  return count;
}

/** Catalog wrapper for {@link maxAffordableUpgrades}. */
export function maxAffordableOf(
  id: UpgradeId,
  owned: number,
  tokens: Tokens,
): number {
  const def = upgrades.find((u) => u.id === id);
  if (!def) {
    throw new Error(`Unknown upgrade id: ${id}`);
  }
  return maxAffordableUpgrades(def.baseCost, owned, tokens);
}

function ownedCount(owned: OwnedUpgrades, id: UpgradeId): number {
  return owned[id] ?? 0;
}

/**
 * Total passive tokens/s from owned producers (no prestige mults yet).
 * Ship upgrades never contribute here.
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
