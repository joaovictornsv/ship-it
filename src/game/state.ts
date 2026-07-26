import { create } from 'zustand';
import { ESPRESSO_MACHINE_ID, type UpgradeId } from '../data/upgrades';
import { clickPower, nextUpgradeCost, tokensPerSecond } from './economy';
import { applyProductionTick, resumeWithoutAccrual } from './tick';
import type { GameState, Tokens } from './types';

export const initialGameState: GameState = {
  tokens: 0,
  owned: {},
  lastTickAt: 0,
};

type GameActions = {
  /** Earn tokens from a Ship It click; returns amount granted (for UI FX). */
  shipIt: () => Tokens;
  /**
   * Buy one unit of an upgrade if affordable.
   * Returns true when the purchase succeeded.
   */
  buyUpgrade: (id: UpgradeId) => boolean;
  /** Apply a production tick using `nowMs` (injectable clock). */
  tick: (nowMs: number) => Tokens;
  /**
   * Tab became visible again: reset tick cursor without offline tokens.
   */
  resumeFromHidden: (nowMs: number) => void;
  /** Seed `lastTickAt` on first mount / when still 0. */
  ensureTickClock: (nowMs: number) => void;
  /**
   * Replace persisted fields from a loaded save.
   * Sets `lastTickAt` to `nowMs` (no offline accrual).
   */
  hydrateFromSave: (
    saved: GameState,
    options: { untrusted: boolean; nowMs: number },
  ) => void;
  /** Clear the integrity-warning banner. */
  dismissSaveWarning: () => void;
};

export type GameStore = GameState &
  GameActions & {
    /** True when the loaded save failed checksum (still playable). */
    saveUntrusted: boolean;
  };

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialGameState,
  saveUntrusted: false,
  shipIt: () => {
    const earned = clickPower();
    set((state) => ({ tokens: state.tokens + earned }));
    return earned;
  },
  buyUpgrade: (id) => {
    const state = get();
    const ownedCount = state.owned[id] ?? 0;
    const cost = nextUpgradeCost(id, ownedCount);
    if (state.tokens < cost) {
      return false;
    }
    set({
      tokens: state.tokens - cost,
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
    set({ tokens: result.tokens, lastTickAt: result.lastTickAt });
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
  hydrateFromSave: (saved, { untrusted, nowMs }) => {
    set({
      tokens: saved.tokens,
      owned: { ...saved.owned },
      lastTickAt: nowMs,
      saveUntrusted: untrusted,
    });
  },
  dismissSaveWarning: () => {
    set({ saveUntrusted: false });
  },
}));

/** Selector helpers used by UI. */
export function selectTokensPerSecond(state: GameState): number {
  return tokensPerSecond(state.owned);
}

export function selectEspressoOwned(state: GameState): number {
  return state.owned[ESPRESSO_MACHINE_ID] ?? 0;
}

/** Slice of the store that belongs in SaveFile.state. */
export function selectPersistedState(state: GameState): GameState {
  return {
    tokens: state.tokens,
    owned: state.owned,
    lastTickAt: state.lastTickAt,
  };
}
