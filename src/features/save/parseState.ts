import type { GameState, OwnedUpgrades } from '../../game/types';
import type { UpgradeId } from '../../data/upgrades';
import { upgrades } from '../../data/upgrades';

const knownUpgradeIds = new Set<string>(upgrades.map((u) => u.id));

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

  const owned: OwnedUpgrades = {};
  for (const [id, count] of Object.entries(state.owned)) {
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

  return {
    state: {
      tokens: state.tokens,
      owned,
      lastTickAt: state.lastTickAt,
    },
    warnings,
  };
}
