import { createEnum } from '../lib/createEnum';
import type { Tokens } from '../game/types';
import {
  CI_CD_ID,
  CODE_REVIEW_ID,
  DEV_ID,
  ESPRESSO_MACHINE_ID,
  getUpgrade,
  ON_CALL_ID,
  type UpgradeColorVar,
  type UpgradeId,
} from './upgrades';

/** Stable building-upgrade IDs — do not rename without a save migrator. */
export const DOUBLE_SHOT_ID = 'double-shot' as const;
export const SECOND_MONITOR_ID = 'second-monitor' as const;
export const RUBBER_STAMP_ID = 'rubber-stamp' as const;
export const MATRIX_BUILDS_ID = 'matrix-builds' as const;
export const FOLLOW_THE_SUN_ID = 'follow-the-sun' as const;

export type BuildingUpgradeId =
  | typeof DOUBLE_SHOT_ID
  | typeof SECOND_MONITOR_ID
  | typeof RUBBER_STAMP_ID
  | typeof MATRIX_BUILDS_ID
  | typeof FOLLOW_THE_SUN_ID;

/** Multiply a target producer's tokens/s for every owned unit. */
export type BuildingUpgradeEffect = { kind: 'mult'; factor: number };

/**
 * Effect kinds own label / accumulate behavior so shop / achievements /
 * economy do not duplicate `effect.kind` chains.
 */
export const BuildingUpgradeEffectKinds = createEnum({
  mult: {
    getLabel: (effect: { factor: number }, producerName: string) =>
      `×${effect.factor} ${producerName} tokens/s`,
    accumulate: (acc: { mult: number }, effect: { factor: number }) => {
      acc.mult *= effect.factor;
    },
  },
});

export type BuildingUpgradeEffectKind = keyof typeof BuildingUpgradeEffectKinds;

/** Player-facing effect line naming the building. */
export function buildingUpgradeEffectLabel(
  effect: BuildingUpgradeEffect,
  targetId: UpgradeId,
): string {
  const producerName = getUpgrade(targetId).name;
  return BuildingUpgradeEffectKinds.mult.getLabel(effect, producerName);
}

/** Fold one owned mult into a producer tokens/s accumulator. */
export function applyBuildingUpgradeEffect(
  acc: { mult: number },
  effect: BuildingUpgradeEffect,
): void {
  BuildingUpgradeEffectKinds.mult.accumulate(acc, effect);
}

export type BuildingUpgradeDef = {
  id: BuildingUpgradeId;
  name: string;
  /** Short joke blurb for tiles / achievements. */
  blurb: string;
  /** Fixed one-shot cost (not Cookie-style rising). */
  cost: Tokens;
  /** Producer whose tokens/s this multiplies. */
  targetId: UpgradeId;
  /** Own at least this many of `targetId` to unlock. */
  unlockAt: number;
  effect: BuildingUpgradeEffect;
  /** Shop glyph — owned by the catalog entry. */
  emoji: string;
  /** Accent CSS var — reuses the target producer's hue. */
  colorVar: UpgradeColorVar;
};

/**
 * One-shot per-producer multipliers (Cookie “building upgrade” pattern).
 * Soft-unlock when the player owns `unlockAt` of the target building.
 * Not click power; not Dev tier promotion.
 */
export const DOUBLE_SHOT: BuildingUpgradeDef = {
  id: DOUBLE_SHOT_ID,
  name: 'Double shot',
  blurb: 'Twice the drip. Same tiny machine. Somehow louder.',
  cost: 500,
  targetId: ESPRESSO_MACHINE_ID,
  unlockAt: 1,
  effect: { kind: 'mult', factor: 2 },
  emoji: '☕',
  colorVar: '--ship-upgrade-espresso',
};

export const SECOND_MONITOR: BuildingUpgradeDef = {
  id: SECOND_MONITOR_ID,
  name: 'Second monitor',
  blurb: 'Twice the tabs. Same one brain cell.',
  cost: 5_000,
  targetId: DEV_ID,
  unlockAt: 1,
  effect: { kind: 'mult', factor: 2 },
  emoji: '🖥️',
  colorVar: '--ship-upgrade-dev',
};

export const RUBBER_STAMP: BuildingUpgradeDef = {
  id: RUBBER_STAMP_ID,
  name: 'Rubber stamp',
  blurb: 'LGTM, but louder. Tests still optional.',
  cost: 55_000,
  targetId: CODE_REVIEW_ID,
  unlockAt: 1,
  effect: { kind: 'mult', factor: 2 },
  emoji: '🔏',
  colorVar: '--ship-upgrade-code-review',
};

export const MATRIX_BUILDS: BuildingUpgradeDef = {
  id: MATRIX_BUILDS_ID,
  name: 'Matrix builds',
  blurb: 'Parallel pipelines. Parallel blame.',
  cost: 600_000,
  targetId: CI_CD_ID,
  unlockAt: 1,
  effect: { kind: 'mult', factor: 2 },
  emoji: '🔀',
  colorVar: '--ship-upgrade-ci-cd',
};

export const FOLLOW_THE_SUN: BuildingUpgradeDef = {
  id: FOLLOW_THE_SUN_ID,
  name: 'Follow-the-sun',
  blurb: 'Someone is always awake. Usually you.',
  cost: 6_500_000,
  targetId: ON_CALL_ID,
  unlockAt: 1,
  effect: { kind: 'mult', factor: 2 },
  emoji: '🌅',
  colorVar: '--ship-upgrade-on-call',
};

/** Shop / catalog order: early → late (by target ladder). */
export const buildingUpgrades = [
  DOUBLE_SHOT,
  SECOND_MONITOR,
  RUBBER_STAMP,
  MATRIX_BUILDS,
  FOLLOW_THE_SUN,
] as const;

export function getBuildingUpgrade(id: BuildingUpgradeId): BuildingUpgradeDef {
  const found = buildingUpgrades.find((u) => u.id === id);
  if (!found) {
    throw new Error(`Unknown building upgrade id: ${id}`);
  }
  return found;
}

/** Whether the soft-unlock threshold for this upgrade is met. */
export function isBuildingUpgradeUnlocked(
  def: BuildingUpgradeDef,
  owned: Partial<Record<UpgradeId, number>>,
): boolean {
  return (owned[def.targetId] ?? 0) >= def.unlockAt;
}

/**
 * Shop queue: all unlocked, not-yet-owned building upgrades.
 * Unlike Ship upgrades, these are not a single ladder — several can show.
 */
export function visibleBuildingUpgradeQueue(
  owned: Partial<Record<UpgradeId, number>>,
  buildingOwned: Partial<Record<BuildingUpgradeId, true>>,
): BuildingUpgradeDef[] {
  return buildingUpgrades.filter(
    (def) =>
      isBuildingUpgradeUnlocked(def, owned) && buildingOwned[def.id] !== true,
  );
}
