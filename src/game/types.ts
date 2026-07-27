import type { AchievementId } from '../data/achievements';
import type { PrestigeUpgradeId } from '../data/prestigeUpgrades';
import type { ShipUpgradeId } from '../data/shipUpgrades';
import type { UpgradeId } from '../data/upgrades';

/** Shared game types — filled as features land. */
export type Tokens = number;

/** Owned count per upgrade id (missing key = 0). */
export type OwnedUpgrades = Partial<Record<UpgradeId, number>>;

/**
 * One-shot Ship upgrades owned this run (missing key = not owned).
 * Value is always `true` when present — count is never > 1.
 */
export type OwnedShipUpgrades = Partial<Record<ShipUpgradeId, true>>;

/** Prestige shop owned counts (missing key = 0). Persist across Rewrite. */
export type OwnedPrestigeUpgrades = Partial<Record<PrestigeUpgradeId, number>>;

/**
 * Unlocked achievement badges (missing key = locked).
 * Value is always `true` when present — cosmetics kept across Rewrite.
 */
export type OwnedAchievements = Partial<Record<AchievementId, true>>;

export type GameState = {
  /** Spendable token bank. */
  tokens: Tokens;
  /** How many of each producer upgrade the player owns. */
  owned: OwnedUpgrades;
  /**
   * Purchased Ship upgrades (click-power track) for this run.
   * Resets on Rewrite.
   */
  shipOwned: OwnedShipUpgrades;
  /**
   * Lifetime tokens earned this run (clicks + passive). Not the bank —
   * spending must not delay Rewrite unlock.
   */
  tokensEarnedThisRun: Tokens;
  /** Lifetime banked Rewrites (prestige currency). */
  rewrites: Tokens;
  /** Prestige shop owned counts — kept across Rewrite. */
  prestigeOwned: OwnedPrestigeUpgrades;
  /**
   * All-time tokens earned (clicks + passive across Rewrites).
   * Kept across Rewrite — achievement counter.
   */
  lifetimeTokensEarned: Tokens;
  /** All-time Ship It presses. Kept across Rewrite. */
  lifetimeClicks: number;
  /**
   * All-time shop purchases (producer units + Ship upgrades).
   * Kept across Rewrite.
   */
  lifetimePurchases: number;
  /** Unlocked achievement ids — cosmetics kept across Rewrite. */
  achievementsUnlocked: OwnedAchievements;
  /**
   * Epoch ms of the last applied production tick.
   * On tab resume, set to now without granting away-time tokens (no offline accrual).
   */
  lastTickAt: number;
};
