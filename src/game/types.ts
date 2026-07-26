import type { UpgradeId } from '../data/upgrades';

/** Shared game types — filled as features land. */
export type Beans = number;

/** Owned count per upgrade id (missing key = 0). */
export type OwnedUpgrades = Partial<Record<UpgradeId, number>>;

export type GameState = {
  /** Spendable coffee-bean bank. */
  beans: Beans;
  /** How many of each upgrade the player owns. */
  owned: OwnedUpgrades;
  /**
   * Epoch ms of the last applied production tick.
   * On tab resume, set to now without granting away-time beans (no offline accrual).
   */
  lastTickAt: number;
};
