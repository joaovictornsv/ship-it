import { create } from 'zustand';
import type { AchievementId } from '../data/achievements';
import {
  getBuildingUpgrade,
  type BuildingUpgradeId,
} from '../data/buildingUpgrades';
import {
  getPrestigeUpgrade,
  type PrestigeUpgradeId,
} from '../data/prestigeUpgrades';
import { DEFAULT_ROOM_ID, type RoomId } from '../data/rooms';
import {
  type ShipUpgradeId,
  getShipUpgrade,
  shipUpgradeLadderIndex,
} from '../data/shipUpgrades';
import { ESPRESSO_MACHINE_ID, type UpgradeId } from '../data/upgrades';
import {
  achievementSnapshotFromState,
  mergeUnlockedAchievements,
  newlyUnlockedAchievements,
} from './achievements';
import {
  buildingUpgradeCost,
  canBuyBuildingUpgrade,
  canBuyPrestigeUpgrade,
  clickPower,
  hasBuildingUpgrade,
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
import {
  activeRoomAfterUnlocks,
  ensureOfficeUnlocked,
  mergeUnlockedRooms,
  newlyUnlockedRooms,
  resolveActiveRoom,
  roomSnapshotFromState,
} from './rooms';
import { applyProductionTick, resumeWithoutAccrual } from './tick';
import type { GameState, OwnedAchievements, OwnedRooms, Tokens } from './types';

export const initialGameState: GameState = {
  tokens: 0,
  owned: {},
  shipOwned: {},
  buildingOwned: {},
  tokensEarnedThisRun: 0,
  rewrites: 0,
  prestigeOwned: {},
  lifetimeTokensEarned: 0,
  lifetimeClicks: 0,
  lifetimePurchases: 0,
  achievementsUnlocked: {},
  roomsUnlocked: { [DEFAULT_ROOM_ID]: true },
  activeRoom: DEFAULT_ROOM_ID,
  lastTickAt: 0,
};

/** Ephemeral HUD toast queue — not persisted. */
const MAX_TOAST_QUEUE = 5;

type ProgressPatch = {
  achievementsUnlocked: OwnedAchievements;
  roomsUnlocked: OwnedRooms;
  activeRoom: RoomId;
  achievementToastQueue: AchievementId[];
};

function withProgressUnlocks(
  state: GameState & { achievementToastQueue: AchievementId[] },
  patch: Partial<GameState>,
): Partial<GameState> & ProgressPatch {
  const next: GameState = { ...state, ...patch };
  const newlyAchievements = newlyUnlockedAchievements(
    achievementSnapshotFromState(next),
    next.achievementsUnlocked,
  );
  const newlyRooms = newlyUnlockedRooms(
    roomSnapshotFromState(next),
    next.roomsUnlocked,
  );
  const roomsUnlocked = ensureOfficeUnlocked(
    mergeUnlockedRooms(next.roomsUnlocked, newlyRooms),
  );
  const activeRoom = activeRoomAfterUnlocks(
    next.activeRoom,
    newlyRooms,
    roomsUnlocked,
  );

  let achievementToastQueue = state.achievementToastQueue;
  let achievementsUnlocked = next.achievementsUnlocked;
  if (newlyAchievements.length > 0) {
    achievementsUnlocked = mergeUnlockedAchievements(
      next.achievementsUnlocked,
      newlyAchievements,
    );
    achievementToastQueue = [
      ...state.achievementToastQueue,
      ...newlyAchievements,
    ].slice(0, MAX_TOAST_QUEUE);
  }

  return {
    ...patch,
    achievementsUnlocked,
    roomsUnlocked,
    activeRoom,
    achievementToastQueue,
  };
}

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
   * Buy a one-shot building upgrade if unlocked and affordable.
   * Returns true when the purchase succeeded.
   */
  buyBuildingUpgrade: (id: BuildingUpgradeId) => boolean;
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
  /** Pop the front achievement toast after it auto-dismisses. */
  dismissAchievementToast: () => void;
  /** Switch the viewed room (must already be unlocked). */
  setActiveRoom: (id: RoomId) => boolean;
};

export type GameStore = GameState &
  GameActions & {
    /** True when the loaded save failed checksum (still playable). */
    saveUntrusted: boolean;
    /**
     * Pending achievement unlock toasts (FIFO). Ephemeral — not in SaveFile.
     * Capped so multi-unlocks coalesce instead of spamming the HUD.
     */
    achievementToastQueue: AchievementId[];
  };

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialGameState,
  saveUntrusted: false,
  achievementToastQueue: [],
  shipIt: () => {
    const state = get();
    const earned = clickPower(state.shipOwned, state.prestigeOwned);
    set(
      withProgressUnlocks(state, {
        tokens: state.tokens + earned,
        tokensEarnedThisRun: state.tokensEarnedThisRun + earned,
        lifetimeTokensEarned: state.lifetimeTokensEarned + earned,
        lifetimeClicks: state.lifetimeClicks + 1,
      }),
    );
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
    set(
      withProgressUnlocks(state, {
        tokens: state.tokens - cost,
        owned: { ...state.owned, [id]: ownedCount + quantity },
        lifetimePurchases: state.lifetimePurchases + quantity,
      }),
    );
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
    set(
      withProgressUnlocks(state, {
        tokens: state.tokens - cost,
        shipOwned: { ...state.shipOwned, [id]: true },
        lifetimePurchases: state.lifetimePurchases + 1,
      }),
    );
    return true;
  },
  buyBuildingUpgrade: (id) => {
    const state = get();
    // Touch catalog so a typo id throws before mutating state.
    getBuildingUpgrade(id);
    if (
      !canBuyBuildingUpgrade(id, state.owned, state.buildingOwned, state.tokens)
    ) {
      return false;
    }
    if (hasBuildingUpgrade(state.buildingOwned, id)) {
      return false;
    }
    const cost = buildingUpgradeCost(id);
    set(
      withProgressUnlocks(state, {
        tokens: state.tokens - cost,
        buildingOwned: { ...state.buildingOwned, [id]: true },
        lifetimePurchases: state.lifetimePurchases + 1,
      }),
    );
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
    set(
      withProgressUnlocks(state, {
        tokens: 0,
        owned: ownedAfterRewrite(state.prestigeOwned),
        shipOwned: {},
        buildingOwned: {},
        tokensEarnedThisRun: 0,
        rewrites: state.rewrites + gained,
        // prestigeOwned, lifetime*, achievementsUnlocked, rooms* kept via base
      }),
    );
    return gained;
  },
  setActiveRoom: (id) => {
    const state = get();
    const unlocked = ensureOfficeUnlocked(state.roomsUnlocked);
    if (unlocked[id] !== true) {
      return false;
    }
    set({
      roomsUnlocked: unlocked,
      activeRoom: resolveActiveRoom(id, unlocked),
    });
    return true;
  },
  tick: (nowMs) => {
    const state = get();
    const result = applyProductionTick(state, nowMs);
    if (result.lastTickAt === state.lastTickAt) {
      return 0;
    }
    const earned = result.earned > 0 ? result.earned : 0;
    set(
      withProgressUnlocks(state, {
        tokens: result.tokens,
        lastTickAt: result.lastTickAt,
        tokensEarnedThisRun: state.tokensEarnedThisRun + earned,
        lifetimeTokensEarned: state.lifetimeTokensEarned + earned,
      }),
    );
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
    // Catch up unlocks from current counters silently (no HUD toast spam on load).
    const newlyAchievements = newlyUnlockedAchievements(
      achievementSnapshotFromState(saved),
      saved.achievementsUnlocked,
    );
    const roomsBase = ensureOfficeUnlocked(saved.roomsUnlocked ?? {});
    const newlyRooms = newlyUnlockedRooms(
      roomSnapshotFromState(saved),
      roomsBase,
    );
    const roomsUnlocked = mergeUnlockedRooms(roomsBase, newlyRooms);
    set({
      tokens: saved.tokens,
      owned: { ...saved.owned },
      shipOwned: { ...saved.shipOwned },
      buildingOwned: { ...saved.buildingOwned },
      tokensEarnedThisRun: saved.tokensEarnedThisRun,
      rewrites: saved.rewrites,
      prestigeOwned: { ...saved.prestigeOwned },
      lifetimeTokensEarned: saved.lifetimeTokensEarned,
      lifetimeClicks: saved.lifetimeClicks,
      lifetimePurchases: saved.lifetimePurchases,
      achievementsUnlocked: mergeUnlockedAchievements(
        saved.achievementsUnlocked,
        newlyAchievements,
      ),
      roomsUnlocked,
      activeRoom: resolveActiveRoom(saved.activeRoom, roomsUnlocked),
      lastTickAt: nowMs,
      saveUntrusted: untrusted,
      achievementToastQueue: [],
    });
  },
  dismissSaveWarning: () => {
    set({ saveUntrusted: false });
  },
  dismissAchievementToast: () => {
    const queue = get().achievementToastQueue;
    if (queue.length === 0) {
      return;
    }
    set({ achievementToastQueue: queue.slice(1) });
  },
}));

/** Selector helpers used by UI. */
export function selectTokensPerSecond(state: GameState): number {
  return tokensPerSecond(
    state.owned,
    state.rewrites,
    state.prestigeOwned,
    state.buildingOwned,
  );
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
    buildingOwned: state.buildingOwned,
    tokensEarnedThisRun: state.tokensEarnedThisRun,
    rewrites: state.rewrites,
    prestigeOwned: state.prestigeOwned,
    lifetimeTokensEarned: state.lifetimeTokensEarned,
    lifetimeClicks: state.lifetimeClicks,
    lifetimePurchases: state.lifetimePurchases,
    achievementsUnlocked: state.achievementsUnlocked,
    roomsUnlocked: state.roomsUnlocked,
    activeRoom: state.activeRoom,
    lastTickAt: state.lastTickAt,
  };
}

/** DevTools cheat hook — same store instance the UI uses (DEV only). */
declare global {
  interface Window {
    __shipIt?: typeof useGameStore;
  }
}

if (import.meta.env.DEV && typeof window !== 'undefined') {
  window.__shipIt = useGameStore;
}
