/**
 * Pure achievement threshold checks — no store / DOM.
 */

import {
  type AchievementDef,
  type AchievementGoal,
  type AchievementId,
  achievements,
  getAchievement,
} from '../data/achievements';
import type { GameState, OwnedAchievements, OwnedUpgrades } from './types';

/** Slice of game state used for unlock evaluation. */
export type AchievementSnapshot = {
  lifetimeTokensEarned: number;
  lifetimeClicks: number;
  lifetimePurchases: number;
  owned: OwnedUpgrades;
  rewrites: number;
};

export function achievementSnapshotFromState(
  state: Pick<
    GameState,
    | 'lifetimeTokensEarned'
    | 'lifetimeClicks'
    | 'lifetimePurchases'
    | 'owned'
    | 'rewrites'
  >,
): AchievementSnapshot {
  return {
    lifetimeTokensEarned: state.lifetimeTokensEarned,
    lifetimeClicks: state.lifetimeClicks,
    lifetimePurchases: state.lifetimePurchases,
    owned: state.owned,
    rewrites: state.rewrites,
  };
}

/** Whether a single goal is met against the snapshot. */
export function isGoalMet(
  goal: AchievementGoal,
  snap: AchievementSnapshot,
): boolean {
  switch (goal.kind) {
    case 'lifetimeTokens':
      return snap.lifetimeTokensEarned >= goal.threshold;
    case 'lifetimeClicks':
      return snap.lifetimeClicks >= goal.threshold;
    case 'lifetimePurchases':
      return snap.lifetimePurchases >= goal.threshold;
    case 'owned':
      return (snap.owned[goal.upgradeId] ?? 0) >= goal.threshold;
    case 'rewrites':
      return snap.rewrites >= goal.threshold;
    default: {
      const _exhaustive: never = goal;
      return _exhaustive;
    }
  }
}

export function isAchievementUnlocked(
  id: AchievementId,
  snap: AchievementSnapshot,
): boolean {
  return isGoalMet(getAchievement(id).goal, snap);
}

/**
 * Progress toward a goal for UI (current / threshold).
 * Owned uses live owned count; Rewrites use banked Rewrites.
 */
export function achievementProgress(
  goal: AchievementGoal,
  snap: AchievementSnapshot,
): { current: number; threshold: number } {
  switch (goal.kind) {
    case 'lifetimeTokens':
      return {
        current: snap.lifetimeTokensEarned,
        threshold: goal.threshold,
      };
    case 'lifetimeClicks':
      return { current: snap.lifetimeClicks, threshold: goal.threshold };
    case 'lifetimePurchases':
      return {
        current: snap.lifetimePurchases,
        threshold: goal.threshold,
      };
    case 'owned':
      return {
        current: snap.owned[goal.upgradeId] ?? 0,
        threshold: goal.threshold,
      };
    case 'rewrites':
      return { current: snap.rewrites, threshold: goal.threshold };
    default: {
      const _exhaustive: never = goal;
      return _exhaustive;
    }
  }
}

/** All catalog ids whose goals are currently met. */
export function metAchievementIds(snap: AchievementSnapshot): AchievementId[] {
  return achievements
    .filter((def) => isGoalMet(def.goal, snap))
    .map((def) => def.name);
}

/**
 * Newly unlocked ids: goals met and not already in `unlocked`.
 * Stable catalog order for toast queue / coalesce.
 */
export function newlyUnlockedAchievements(
  snap: AchievementSnapshot,
  unlocked: OwnedAchievements,
): AchievementId[] {
  return metAchievementIds(snap).filter((id) => unlocked[id] !== true);
}

/** Merge newly unlocked ids into the owned map. */
export function mergeUnlockedAchievements(
  unlocked: OwnedAchievements,
  newly: readonly AchievementId[],
): OwnedAchievements {
  if (newly.length === 0) {
    return unlocked;
  }
  const next: OwnedAchievements = { ...unlocked };
  for (const id of newly) {
    next[id] = true;
  }
  return next;
}

/** Short locked progress label (English). */
export function achievementProgressLabel(
  def: AchievementDef,
  snap: AchievementSnapshot,
): string {
  const { current, threshold } = achievementProgress(def.goal, snap);
  const capped = Math.min(current, threshold);
  switch (def.goal.kind) {
    case 'lifetimeTokens':
      return `${formatCount(capped)} / ${formatCount(threshold)} tokens earned`;
    case 'lifetimeClicks':
      return `${formatCount(capped)} / ${formatCount(threshold)} clicks`;
    case 'lifetimePurchases':
      return `${formatCount(capped)} / ${formatCount(threshold)} purchases`;
    case 'owned':
      return `${formatCount(capped)} / ${formatCount(threshold)} owned`;
    case 'rewrites':
      return `${formatCount(capped)} / ${formatCount(threshold)} Rewrites`;
    default: {
      const _exhaustive: never = def.goal;
      return _exhaustive;
    }
  }
}

function formatCount(n: number): string {
  if (!Number.isFinite(n)) {
    return '0';
  }
  if (n >= 1_000_000) {
    return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  }
  if (n >= 10_000) {
    return `${Math.floor(n / 1_000)}k`;
  }
  return String(Math.floor(n));
}
