import type { Tokens } from '../game/types';

/** Stable prestige upgrade IDs — do not rename without a save migrator. */
export const POSTMORTEM_ID = 'postmortem' as const;
export const MUSCLE_MEMORY_ID = 'muscle-memory' as const;
export const STUB_REPO_ID = 'stub-repo' as const;

export type PrestigeUpgradeId =
  typeof POSTMORTEM_ID | typeof MUSCLE_MEMORY_ID | typeof STUB_REPO_ID;

/** CSS custom-property name for a prestige shop accent. */
export type PrestigeUpgradeColorVar =
  | '--ship-prestige-postmortem'
  | '--ship-prestige-muscle'
  | '--ship-prestige-stub';

/**
 * Prestige shop effect — permanent across Rewrites.
 * `tpsPct` / `clickPct` are additive fractions per owned level (0.05 = +5%).
 */
export type PrestigeUpgradeEffect =
  | { kind: 'tpsPct'; pct: number }
  | { kind: 'clickPct'; pct: number }
  | { kind: 'stubRepo' };

export type PrestigeUpgradeDef = {
  id: PrestigeUpgradeId;
  name: string;
  /** Short joke blurb for shop rows. */
  blurb: string;
  /** Cost of the first purchase in Rewrites (owned = 0). */
  baseCost: Tokens;
  /**
   * Max owned count. `1` = one-shot (Stub repo).
   * Omit / Infinity for unlimited repeatable tiers.
   */
  maxOwned: number;
  effect: PrestigeUpgradeEffect;
  emoji: string;
  colorVar: PrestigeUpgradeColorVar;
};

/**
 * Small prestige shop (PRODUCT §7). Costs are playtest starting points —
 * spend **Rewrites**, never tokens.
 */
export const POSTMORTEM: PrestigeUpgradeDef = {
  id: POSTMORTEM_ID,
  name: 'Postmortem',
  blurb:
    'Write it down so the next rewrite hurts less. Permanent tokens/s bump.',
  baseCost: 1,
  maxOwned: Number.POSITIVE_INFINITY,
  effect: { kind: 'tpsPct', pct: 0.05 },
  emoji: '📋',
  colorVar: '--ship-prestige-postmortem',
};

export const MUSCLE_MEMORY: PrestigeUpgradeDef = {
  id: MUSCLE_MEMORY_ID,
  name: 'Muscle memory',
  blurb:
    'Fingers still know the merge hotkey. Permanent tokens per click bump.',
  baseCost: 1,
  maxOwned: Number.POSITIVE_INFINITY,
  effect: { kind: 'clickPct', pct: 0.1 },
  emoji: '💪',
  colorVar: '--ship-prestige-muscle',
};

export const STUB_REPO: PrestigeUpgradeDef = {
  id: STUB_REPO_ID,
  name: 'Stub repo',
  blurb:
    'Scaffold the espresso machine before day one. Each Rewrite starts with 1 Espresso.',
  baseCost: 2,
  maxOwned: 1,
  effect: { kind: 'stubRepo' },
  emoji: '📦',
  colorVar: '--ship-prestige-stub',
};

/** Prestige catalog in shop order. */
export const prestigeUpgrades: readonly PrestigeUpgradeDef[] = [
  POSTMORTEM,
  MUSCLE_MEMORY,
  STUB_REPO,
];

const byId = new Map(prestigeUpgrades.map((def) => [def.id, def] as const));

export function getPrestigeUpgrade(id: PrestigeUpgradeId): PrestigeUpgradeDef {
  const def = byId.get(id);
  if (!def) {
    throw new Error(`Unknown prestige upgrade id: ${id}`);
  }
  return def;
}
