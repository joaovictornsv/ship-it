import type {
  GameState,
  OwnedPrestigeUpgrades,
  OwnedShipUpgrades,
  OwnedUpgrades,
} from '../../game/types';
import type { PrestigeUpgradeId } from '../../data/prestigeUpgrades';
import { prestigeUpgrades } from '../../data/prestigeUpgrades';
import type { ShipUpgradeId } from '../../data/shipUpgrades';
import { shipUpgrades } from '../../data/shipUpgrades';
import type { UpgradeId } from '../../data/upgrades';
import { upgrades } from '../../data/upgrades';

const knownUpgradeIds = new Set<string>(upgrades.map((u) => u.id));
const knownShipUpgradeIds = new Set<string>(shipUpgrades.map((u) => u.id));
const knownPrestigeUpgradeIds = new Set<string>(
  prestigeUpgrades.map((u) => u.id),
);

/**
 * Soft-normalize a game state for play.
 * Soft issues become warnings; never throws for plausibility alone.
 */
export function normalizeGameState(state: GameState): {
  state: GameState;
  warnings: string[];
} {
  const warnings: string[] = [];

  if (state.tokens < 0) {
    warnings.push('tokens is negative; playing anyway');
  }
  if (state.tokensEarnedThisRun < 0) {
    warnings.push('tokensEarnedThisRun is negative; clamped to 0');
  }
  if (state.rewrites < 0) {
    warnings.push('rewrites is negative; clamped to 0');
  }

  const owned: OwnedUpgrades = {};
  for (const [id, count] of Object.entries(state.owned ?? {})) {
    if (typeof count !== 'number' || !Number.isFinite(count)) {
      warnings.push(`owned.${id} is not a finite number; skipped`);
      continue;
    }
    if (count < 0) {
      warnings.push(`owned.${id} is negative; clamped to 0`);
    }
    if (!knownUpgradeIds.has(id)) {
      warnings.push(`unknown upgrade id "${id}"; kept for forward-compat`);
    }
    const safeCount = Math.max(0, Math.floor(count));
    if (safeCount > 0) {
      owned[id as UpgradeId] = safeCount;
    }
  }

  const shipOwned: OwnedShipUpgrades = {};
  const rawShip = state.shipOwned ?? {};
  for (const [id, flag] of Object.entries(rawShip)) {
    if (flag !== true && flag !== 1) {
      warnings.push(`shipOwned.${id} is not owned-true; skipped`);
      continue;
    }
    if (!knownShipUpgradeIds.has(id)) {
      warnings.push(`unknown ship upgrade id "${id}"; kept for forward-compat`);
    }
    shipOwned[id as ShipUpgradeId] = true;
  }

  const prestigeOwned: OwnedPrestigeUpgrades = {};
  const rawPrestige = state.prestigeOwned ?? {};
  for (const [id, count] of Object.entries(rawPrestige)) {
    if (typeof count !== 'number' || !Number.isFinite(count)) {
      warnings.push(`prestigeOwned.${id} is not a finite number; skipped`);
      continue;
    }
    if (count < 0) {
      warnings.push(`prestigeOwned.${id} is negative; clamped to 0`);
    }
    if (!knownPrestigeUpgradeIds.has(id)) {
      warnings.push(
        `unknown prestige upgrade id "${id}"; kept for forward-compat`,
      );
    }
    const safeCount = Math.max(0, Math.floor(count));
    if (safeCount > 0) {
      prestigeOwned[id as PrestigeUpgradeId] = safeCount;
    }
  }

  return {
    state: {
      tokens: state.tokens,
      owned,
      shipOwned,
      tokensEarnedThisRun: Math.max(0, state.tokensEarnedThisRun ?? 0),
      rewrites: Math.max(0, state.rewrites ?? 0),
      prestigeOwned,
      lastTickAt: state.lastTickAt,
    },
    warnings,
  };
}
