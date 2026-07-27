import { create } from 'zustand';
import {
  getPrestigeUpgrade,
  type PrestigeUpgradeId,
} from '../data/prestigeUpgrades';
import {
  type ShipUpgradeId,
  getShipUpgrade,
  shipUpgradeLadderIndex,
} from '../data/shipUpgrades';
import { ESPRESSO_MACHINE_ID, type UpgradeId } from '../data/upgrades';
import {
  canBuyPrestigeUpgrade,
  clickPower,
  hasShipUpgrade,
  isRewriteAvailable,
  nextPrestigeUpgradeCost,
  nextShipUpgradeId,
  nextUpgradeCostForN,
  ownedAfterRewrite,
  prestigeOwnedCount,
  rewritesGained,
  shipUpgradeCost,
  shipUpgradesUnlocked,
  tokensPerSecond,
} from './economy';
import { applyProductionTick, resumeWithoutAccrual } from './tick';
import type { GameState, Tokens } from './types';

export const initialGameState: GameState = {
  tokens: 0,
  owned: {},
  shipOwned: {},
  tokensEarnedThisRun: 0,
  rewrites: 0,
  prestigeOwned: {},
  lastTickAt: 0,
};

type GameActions = {
  /** Earn tokens from a Ship It click; returns amount granted (for UI FX). */
  shipIt: () => Tokens;
  /**
   * Buy `quantity` units of a producer if the rising-cost sum is affordable.
   * `quantity` defaults to 1. Returns true when the purchase succeeded.
   */
  buyUpgrade: (id: UpgradeId, quantity?: number) => boolean;
  /**
   * Buy the next one-shot Ship upgrade if unlocked and affordable.
   * Returns true when the purchase succeeded.
   */
  buyShipUpgrade: (id: ShipUpgradeId) => boolean;
  /**
   * Spend Rewrites on a prestige upgrade. Never spends tokens.
   * Returns true when the purchase succeeded.
   */
  buyPrestigeUpgrade: (id: PrestigeUpgradeId) => boolean;
  /**
   * Soft-reset: bank Rewrites, clear run economy, keep prestige / cosmetics.
   * Returns Rewrites gained, or `0` when Rewrite is not available.
   */
  rewrite: () => number;
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
    const state = get();
    const earned = clickPower(state.shipOwned, state.prestigeOwned);
    set({
      tokens: state.tokens + earned,
      tokensEarnedThisRun: state.tokensEarnedThisRun + earned,
    });
    return earned;
  },
  buyUpgrade: (id, quantity = 1) => {
    if (!Number.isInteger(quantity) || quantity < 1) {
      return false;
    }
    const state = get();
    const ownedCount = state.owned[id] ?? 0;
    const cost = nextUpgradeCostForN(id, ownedCount, quantity);
    if (state.tokens < cost) {
      return false;
    }
    set({
      tokens: state.tokens - cost,
      owned: { ...state.owned, [id]: ownedCount + quantity },
    });
    return true;
  },
  buyShipUpgrade: (id) => {
    const state = get();
    if (!shipUpgradesUnlocked(state.owned)) {
      return false;
    }
    if (hasShipUpgrade(state.shipOwned, id)) {
      return false;
    }
    const nextId = nextShipUpgradeId(state.shipOwned);
    if (nextId !== id) {
      return false;
    }
    // Ladder integrity: refuse unknown / out-of-order ids.
    if (shipUpgradeLadderIndex(id) < 0) {
      return false;
    }
    const cost = shipUpgradeCost(id);
    if (state.tokens < cost) {
      return false;
    }
    // Touch catalog so a typo id throws before mutating state.
    getShipUpgrade(id);
    set({
      tokens: state.tokens - cost,
      shipOwned: { ...state.shipOwned, [id]: true },
    });
    return true;
  },
  buyPrestigeUpgrade: (id) => {
    const state = get();
    // Touch catalog so a typo id throws before mutating state.
    getPrestigeUpgrade(id);
    if (!canBuyPrestigeUpgrade(id, state.prestigeOwned, state.rewrites)) {
      return false;
    }
    const owned = prestigeOwnedCount(state.prestigeOwned, id);
    const cost = nextPrestigeUpgradeCost(id, owned);
    set({
      rewrites: state.rewrites - cost,
      prestigeOwned: {
        ...state.prestigeOwned,
        [id]: owned + 1,
      },
    });
    return true;
  },
  rewrite: () => {
    const state = get();
    if (!isRewriteAvailable(state.tokensEarnedThisRun)) {
      return 0;
    }
    const gained = rewritesGained(state.tokensEarnedThisRun);
    set({
      tokens: 0,
      owned: ownedAfterRewrite(state.prestigeOwned),
      shipOwned: {},
      tokensEarnedThisRun: 0,
      rewrites: state.rewrites + gained,
      // prestigeOwned kept
    });
    return gained;
  },
  tick: (nowMs) => {
    const state = get();
    const result = applyProductionTick(state, nowMs);
    if (result.lastTickAt === state.lastTickAt) {
      return 0;
    }
    set({
      tokens: result.tokens,
      lastTickAt: result.lastTickAt,
      tokensEarnedThisRun:
        state.tokensEarnedThisRun + (result.earned > 0 ? result.earned : 0),
    });
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
      shipOwned: { ...saved.shipOwned },
      tokensEarnedThisRun: saved.tokensEarnedThisRun,
      rewrites: saved.rewrites,
      prestigeOwned: { ...saved.prestigeOwned },
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
  return tokensPerSecond(state.owned, state.rewrites, state.prestigeOwned);
}

export function selectEspressoOwned(state: GameState): number {
  return state.owned[ESPRESSO_MACHINE_ID] ?? 0;
}

/** Slice of the store that belongs in SaveFile.state. */
export function selectPersistedState(state: GameState): GameState {
  return {
    tokens: state.tokens,
    owned: state.owned,
    shipOwned: state.shipOwned,
    tokensEarnedThisRun: state.tokensEarnedThisRun,
    rewrites: state.rewrites,
    prestigeOwned: state.prestigeOwned,
    lastTickAt: state.lastTickAt,
  };
}
