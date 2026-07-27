import type { AchievementId } from '../data/achievements';
import type { BuildingUpgradeId } from '../data/buildingUpgrades';
import type { ThemeId } from '../data/officeThemes';
import type { PrestigeUpgradeId } from '../data/prestigeUpgrades';
import type { RoomId } from '../data/rooms';
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

/**
 * One-shot building upgrades owned this run (missing key = not owned).
 * Value is always `true` when present — count is never > 1.
 */
export type OwnedBuildingUpgrades = Partial<Record<BuildingUpgradeId, true>>;

/** Prestige shop owned counts (missing key = 0). Persist across Rewrite. */
export type OwnedPrestigeUpgrades = Partial<Record<PrestigeUpgradeId, number>>;

/**
 * Unlocked achievement badges (missing key = locked).
 * Value is always `true` when present — cosmetics kept across Rewrite.
 */
export type OwnedAchievements = Partial<Record<AchievementId, true>>;

/**
 * Unlocked scene rooms (missing key = locked).
 * Value is always `true` when present — kept across Rewrite (PRODUCT).
 */
export type OwnedRooms = Partial<Record<RoomId, true>>;

/**
 * Owned office themes (missing key = locked).
 * Value is always `true` when present — cosmetics kept across Rewrite.
 */
export type OwnedThemes = Partial<Record<ThemeId, true>>;

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
   * Purchased building upgrades (per-producer tokens/s mults) for this run.
   * Resets on Rewrite.
   */
  buildingOwned: OwnedBuildingUpgrades;
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
   * All-time shop purchases (producer units + Ship / building upgrades).
   * Kept across Rewrite.
   */
  lifetimePurchases: number;
  /** Unlocked achievement ids — cosmetics kept across Rewrite. */
  achievementsUnlocked: OwnedAchievements;
  /**
   * Unlocked room ids — map cosmetics kept across Rewrite.
   * Office is always present after normalize / hydrate.
   */
  roomsUnlocked: OwnedRooms;
  /** Currently viewed room (must be in `roomsUnlocked`). Kept across Rewrite. */
  activeRoom: RoomId;
  /**
   * Owned office theme ids — scene cosmetics kept across Rewrite.
   * Classic (`default`) is always present after normalize / hydrate.
   */
  themesOwned: OwnedThemes;
  /** Equipped office theme (must be in `themesOwned`). Kept across Rewrite. */
  activeTheme: ThemeId;
  /**
   * Epoch ms of the last applied production tick.
   * On tab resume, set to now without granting away-time tokens (no offline accrual).
   */
  lastTickAt: number;
};
