import { beansFromDelta, beansPerSecond } from './economy';
import type { Beans, GameState, OwnedUpgrades } from './types';

/** Injectable clock — default is `Date.now`. */
export type Clock = () => number;

export type TickResult = {
  beans: Beans;
  lastTickAt: number;
  /** Beans granted this tick (0 when skipping accrual). */
  earned: Beans;
};

/**
 * Advance production from `lastTickAt` to `nowMs`.
 * Pure: does not mutate; caller applies the result to the store.
 */
export function applyProductionTick(
  state: Pick<GameState, 'beans' | 'owned' | 'lastTickAt'>,
  nowMs: number,
): TickResult {
  const deltaMs = nowMs - state.lastTickAt;
  if (deltaMs <= 0) {
    return { beans: state.beans, lastTickAt: state.lastTickAt, earned: 0 };
  }

  const earned = beansFromDelta(beansPerSecond(state.owned), deltaMs);
  return {
    beans: state.beans + earned,
    lastTickAt: nowMs,
    earned,
  };
}

/**
 * Resume after the tab was hidden / unloaded: move the tick cursor forward
 * without granting away-time beans (v1: no offline accrual).
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
