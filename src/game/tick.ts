import { tokensFromDelta, tokensPerSecond } from './economy';
import type { GameState, OwnedUpgrades, Tokens } from './types';

/** Injectable clock — default is `Date.now`. */
export type Clock = () => number;

export type TickResult = {
  tokens: Tokens;
  lastTickAt: number;
  /** Tokens granted this tick (0 when skipping accrual). */
  earned: Tokens;
};

/**
 * Advance production from `lastTickAt` to `nowMs`.
 * Pure: does not mutate; caller applies the result to the store.
 */
export function applyProductionTick(
  state: Pick<
    GameState,
    | 'tokens'
    | 'owned'
    | 'lastTickAt'
    | 'rewrites'
    | 'prestigeOwned'
    | 'buildingOwned'
  >,
  nowMs: number,
): TickResult {
  const deltaMs = nowMs - state.lastTickAt;
  if (deltaMs <= 0) {
    return { tokens: state.tokens, lastTickAt: state.lastTickAt, earned: 0 };
  }

  const earned = tokensFromDelta(
    tokensPerSecond(
      state.owned,
      state.rewrites,
      state.prestigeOwned,
      state.buildingOwned,
    ),
    deltaMs,
  );
  return {
    tokens: state.tokens + earned,
    lastTickAt: nowMs,
    earned,
  };
}

/**
 * Resume after the tab was hidden / unloaded: move the tick cursor forward
 * without granting away-time tokens (v1: no offline accrual).
 */
export function resumeWithoutAccrual(
  nowMs: number,
): Pick<GameState, 'lastTickAt'> {
  return { lastTickAt: nowMs };
}

/** Owned helper for tests / callers that need a zeroed map. */
export function emptyOwned(): OwnedUpgrades {
  return {};
}
