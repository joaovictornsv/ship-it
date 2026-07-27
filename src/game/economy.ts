import {
  getPrestigeUpgrade,
  MUSCLE_MEMORY_ID,
  POSTMORTEM_ID,
  prestigeUpgrades,
  STUB_REPO_ID,
  type PrestigeUpgradeId,
} from '../data/prestigeUpgrades';
import {
  applyBuildingUpgradeEffect,
  buildingUpgrades,
  getBuildingUpgrade,
  isBuildingUpgradeUnlocked,
  type BuildingUpgradeId,
} from '../data/buildingUpgrades';
import {
  applyShipUpgradeEffect,
  getShipUpgrade,
  shipUpgrades,
  type ShipUpgradeId,
} from '../data/shipUpgrades';
import {
  ESPRESSO_MACHINE,
  ESPRESSO_MACHINE_ID,
  type UpgradeId,
  upgrades,
} from '../data/upgrades';
import type {
  OwnedBuildingUpgrades,
  OwnedPrestigeUpgrades,
  OwnedShipUpgrades,
  OwnedUpgrades,
  Tokens,
} from './types';

export { formatTokensCompact } from './format';

/** Cookie Clicker–style building cost growth per owned unit. */
export const COST_GROWTH = 1.15;

/**
 * Rewrite unlock constant: `rewritesGained = floor(sqrt(tokensEarnedThisRun / K))`.
 * Playtest-tuned for first Rewrite ~20–40 min of engaged play (#49 raised from 10k).
 */
export const REWRITE_K = 100_000;

/** Passive tokens/s bonus per banked Rewrite (0.05 = +5% each). */
export const REWRITE_TPS_BONUS_PER = 0.05;

/** Prestige shop rising cost growth per owned tier. */
export const PRESTIGE_COST_GROWTH = 1.5;

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

/** Whether a building upgrade has been purchased this run. */
export function hasBuildingUpgrade(
  buildingOwned: OwnedBuildingUpgrades,
  id: BuildingUpgradeId,
): boolean {
  return buildingOwned[id] === true;
}

/** Fixed one-shot cost for a building upgrade (not Cookie rising). */
export function buildingUpgradeCost(id: BuildingUpgradeId): Tokens {
  return getBuildingUpgrade(id).cost;
}

/**
 * Whether a building upgrade can be bought: unlocked by owning the target
 * producer threshold, not already owned.
 */
export function canBuyBuildingUpgrade(
  id: BuildingUpgradeId,
  owned: OwnedUpgrades,
  buildingOwned: OwnedBuildingUpgrades,
  tokens: Tokens,
): boolean {
  if (hasBuildingUpgrade(buildingOwned, id)) {
    return false;
  }
  const def = getBuildingUpgrade(id);
  if (!isBuildingUpgradeUnlocked(def, owned)) {
    return false;
  }
  return tokens >= def.cost;
}

/**
 * Tokens/s multiplier for one producer from owned building upgrades.
 * `1` when none apply. Multiple owned mults for the same target stack (Π).
 */
export function producerTokensPerSecondMult(
  buildingOwned: OwnedBuildingUpgrades,
  producerId: UpgradeId,
): number {
  const acc = { mult: 1 };
  for (const def of buildingUpgrades) {
    if (def.targetId !== producerId) {
      continue;
    }
    if (!hasBuildingUpgrade(buildingOwned, def.id)) {
      continue;
    }
    applyBuildingUpgradeEffect(acc, def.effect);
  }
  return acc.mult;
}

/**
 * Tokens earned per Ship It click.
 * Base 1 + sum(flats), then × product(mults) from owned Ship upgrades,
 * then × (1 + Muscle memory %).
 */
export function clickPower(
  shipOwned: OwnedShipUpgrades = {},
  prestigeOwned: OwnedPrestigeUpgrades = {},
): Tokens {
  const acc = { flat: 0, mult: 1 };
  for (const def of shipUpgrades) {
    if (!hasShipUpgrade(shipOwned, def.id)) {
      continue;
    }
    applyShipUpgradeEffect(acc, def.effect);
  }
  const ship = (1 + acc.flat) * acc.mult;
  return ship * (1 + muscleMemoryClickBonus(prestigeOwned));
}

/** Rewrites gained from this-run earnings: `floor(sqrt(earned / K))`. */
export function rewritesGained(
  tokensEarnedThisRun: Tokens,
  k: number = REWRITE_K,
): number {
  if (tokensEarnedThisRun <= 0 || k <= 0) {
    return 0;
  }
  return Math.floor(Math.sqrt(tokensEarnedThisRun / k));
}

/** True when projected Rewrite gain is ≥ 1. */
export function isRewriteAvailable(
  tokensEarnedThisRun: Tokens,
  k: number = REWRITE_K,
): boolean {
  return rewritesGained(tokensEarnedThisRun, k) >= 1;
}

/**
 * Tokens still needed this run before the next whole Rewrite unlocks.
 * `0` when already available.
 */
export function tokensUntilRewrite(
  tokensEarnedThisRun: Tokens,
  k: number = REWRITE_K,
): Tokens {
  const next = rewritesGained(tokensEarnedThisRun, k) + 1;
  const need = next * next * k;
  return Math.max(0, need - tokensEarnedThisRun);
}

/** Owned count for a prestige upgrade (missing = 0). */
export function prestigeOwnedCount(
  prestigeOwned: OwnedPrestigeUpgrades,
  id: PrestigeUpgradeId,
): number {
  return prestigeOwned[id] ?? 0;
}

/** Whether Stub repo is owned (each Rewrite starts with 1 Espresso). */
export function hasStubRepo(prestigeOwned: OwnedPrestigeUpgrades): boolean {
  return prestigeOwnedCount(prestigeOwned, STUB_REPO_ID) > 0;
}

/** Additive click % from Muscle memory levels (0.1 = +10% per level). */
export function muscleMemoryClickBonus(
  prestigeOwned: OwnedPrestigeUpgrades,
): number {
  const levels = prestigeOwnedCount(prestigeOwned, MUSCLE_MEMORY_ID);
  if (levels <= 0) {
    return 0;
  }
  const def = getPrestigeUpgrade(MUSCLE_MEMORY_ID);
  if (def.effect.kind !== 'clickPct') {
    return 0;
  }
  return levels * def.effect.pct;
}

/** Additive tokens/s % from Postmortem levels. */
export function postmortemTpsBonus(
  prestigeOwned: OwnedPrestigeUpgrades,
): number {
  const levels = prestigeOwnedCount(prestigeOwned, POSTMORTEM_ID);
  if (levels <= 0) {
    return 0;
  }
  const def = getPrestigeUpgrade(POSTMORTEM_ID);
  if (def.effect.kind !== 'tpsPct') {
    return 0;
  }
  return levels * def.effect.pct;
}

/**
 * Combined permanent tokens/s multiplier from banked Rewrites + Postmortem.
 * `1` when neither applies.
 */
export function prestigeTokensPerSecondMult(
  rewrites: number,
  prestigeOwned: OwnedPrestigeUpgrades = {},
): number {
  const bank = 1 + Math.max(0, rewrites) * REWRITE_TPS_BONUS_PER;
  return bank * (1 + postmortemTpsBonus(prestigeOwned));
}

/** Cookie-style rising cost for the next prestige purchase (Rewrites). */
export function prestigeUpgradeCost(baseCost: Tokens, owned: number): Tokens {
  if (owned < 0) {
    throw new Error('owned must be >= 0');
  }
  return Math.ceil(baseCost * PRESTIGE_COST_GROWTH ** owned);
}

/** Next prestige purchase cost for a catalog id. */
export function nextPrestigeUpgradeCost(
  id: PrestigeUpgradeId,
  owned: number,
): Tokens {
  return prestigeUpgradeCost(getPrestigeUpgrade(id).baseCost, owned);
}

/** Human-readable effect label for a prestige def at current owned count. */
export function prestigeEffectLabel(
  id: PrestigeUpgradeId,
  owned: number = 0,
): string {
  const def = getPrestigeUpgrade(id);
  switch (def.effect.kind) {
    case 'tpsPct': {
      const pct = Math.round(def.effect.pct * 100);
      const total = Math.round(owned * def.effect.pct * 100);
      return owned > 0
        ? `+${pct}% tokens/s each (now +${total}%)`
        : `+${pct}% tokens/s each`;
    }
    case 'clickPct': {
      const pct = Math.round(def.effect.pct * 100);
      const total = Math.round(owned * def.effect.pct * 100);
      return owned > 0
        ? `+${pct}% tokens per click each (now +${total}%)`
        : `+${pct}% tokens per click each`;
    }
    case 'stubRepo':
      return 'Each Rewrite starts with 1 Espresso machine';
    default: {
      const _exhaustive: never = def.effect;
      return _exhaustive;
    }
  }
}

/** Whether another prestige purchase is allowed (respects maxOwned). */
export function canBuyPrestigeUpgrade(
  id: PrestigeUpgradeId,
  prestigeOwned: OwnedPrestigeUpgrades,
  rewrites: Tokens,
): boolean {
  const def = getPrestigeUpgrade(id);
  const owned = prestigeOwnedCount(prestigeOwned, id);
  if (owned >= def.maxOwned) {
    return false;
  }
  return rewrites >= nextPrestigeUpgradeCost(id, owned);
}

/** Passive tokens/s multiplier preview after banking `gained` more Rewrites. */
export function previewRewritePower(
  currentRewrites: number,
  gained: number,
  prestigeOwned: OwnedPrestigeUpgrades = {},
): { nextRewrites: number; tpsMult: number } {
  const nextRewrites = currentRewrites + Math.max(0, gained);
  return {
    nextRewrites,
    tpsMult: prestigeTokensPerSecondMult(nextRewrites, prestigeOwned),
  };
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
 * Total passive tokens/s from owned producers × per-building mults × prestige
 * mult (banked Rewrites + Postmortem). Ship upgrades never contribute here.
 *
 * ```text
 * tokens/s = Σ(owned × rate × Π buildingMults) × prestigeMult
 * ```
 */
export function tokensPerSecond(
  owned: OwnedUpgrades,
  rewrites: number = 0,
  prestigeOwned: OwnedPrestigeUpgrades = {},
  buildingOwned: OwnedBuildingUpgrades = {},
): number {
  let total = 0;
  for (const def of upgrades) {
    const count = ownedCount(owned, def.id);
    if (count <= 0) {
      continue;
    }
    total +=
      count *
      def.tokensPerSecond *
      producerTokensPerSecondMult(buildingOwned, def.id);
  }
  return total * prestigeTokensPerSecondMult(rewrites, prestigeOwned);
}

/** Starting owned map after a Rewrite (Stub repo → 1 Espresso). */
export function ownedAfterRewrite(
  prestigeOwned: OwnedPrestigeUpgrades,
): OwnedUpgrades {
  if (!hasStubRepo(prestigeOwned)) {
    return {};
  }
  return { [ESPRESSO_MACHINE_ID]: 1 };
}

/** Catalog ids that spend Rewrites (never tokens). */
export function isPrestigeUpgradeId(id: string): id is PrestigeUpgradeId {
  return prestigeUpgrades.some((def) => def.id === id);
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
