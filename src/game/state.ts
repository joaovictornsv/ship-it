import { create } from 'zustand';
import { ESPRESSO_MACHINE_ID, type UpgradeId } from '../data/upgrades';
import { beansPerSecond, clickPower, nextUpgradeCost } from './economy';
import { applyProductionTick, resumeWithoutAccrual } from './tick';
import type { Beans, GameState } from './types';

export const initialGameState: GameState = {
  beans: 0,
  owned: {},
  lastTickAt: 0,
};

type GameActions = {
  /** Earn beans from a Ship It click; returns amount granted (for UI FX). */
  shipIt: () => Beans;
  /**
   * Buy one unit of an upgrade if affordable.
   * Returns true when the purchase succeeded.
   */
  buyUpgrade: (id: UpgradeId) => boolean;
  /** Apply a production tick using `nowMs` (injectable clock). */
  tick: (nowMs: number) => Beans;
  /**
   * Tab became visible again: reset tick cursor without offline beans.
   */
  resumeFromHidden: (nowMs: number) => void;
  /** Seed `lastTickAt` on first mount / when still 0. */
  ensureTickClock: (nowMs: number) => void;
};

export type GameStore = GameState & GameActions;

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialGameState,
  shipIt: () => {
    const earned = clickPower();
    set((state) => ({ beans: state.beans + earned }));
    return earned;
  },
  buyUpgrade: (id) => {
    const state = get();
    const ownedCount = state.owned[id] ?? 0;
    const cost = nextUpgradeCost(id, ownedCount);
    if (state.beans < cost) {
      return false;
    }
    set({
      beans: state.beans - cost,
      owned: { ...state.owned, [id]: ownedCount + 1 },
    });
    return true;
  },
  tick: (nowMs) => {
    const state = get();
    const result = applyProductionTick(state, nowMs);
    if (result.lastTickAt === state.lastTickAt) {
      return 0;
    }
    set({ beans: result.beans, lastTickAt: result.lastTickAt });
    return result.earned;
  },
  resumeFromHidden: (nowMs) => {
    set(resumeWithoutAccrual(nowMs));
  },
  ensureTickClock: (nowMs) => {
    if (get().lastTickAt === 0) {
      set({ lastTickAt: nowMs });
    }
  },
}));

/** Selector helpers used by UI. */
export function selectBeansPerSecond(state: GameState): number {
  return beansPerSecond(state.owned);
}

export function selectEspressoOwned(state: GameState): number {
  return state.owned[ESPRESSO_MACHINE_ID] ?? 0;
}
