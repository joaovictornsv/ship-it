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

export type GameState = {
  /** Spendable token bank. */
  tokens: Tokens;
  /** How many of each producer upgrade the player owns. */
  owned: OwnedUpgrades;
  /**
   * Purchased Ship upgrades (click-power track) for this run.
   * Resets on Rewrite when prestige ships (#9).
   */
  shipOwned: OwnedShipUpgrades;
  /**
   * Epoch ms of the last applied production tick.
   * On tab resume, set to now without granting away-time tokens (no offline accrual).
   */
  lastTickAt: number;
};
