import type { GameState } from '../../game/types';
import { CURRENT_SAVE_VERSION, type SaveFile } from './types';

type Migrator = (state: GameState) => GameState;

/**
 * Ordered migrators: key `n` migrates a save at version `n` to `n + 1`.
 */
const migrators: Record<number, Migrator> = {
  /** v1 → v2: add this-run Ship upgrades map (click-power track). */
  1: (state) => {
    const legacy = state as GameState & { shipOwned?: GameState['shipOwned'] };
    return {
      tokens: legacy.tokens,
      owned: legacy.owned,
      lastTickAt: legacy.lastTickAt,
      shipOwned: legacy.shipOwned ?? {},
    } as GameState;
  },
  /**
   * v2 → v3: prestige fields (tokens earned this run, Rewrites bank, prestige shop).
   * Mid-run v2 saves get `tokensEarnedThisRun: 0` (no retroactive credit).
   */
  2: (state) => {
    const legacy = state as GameState & {
      tokensEarnedThisRun?: GameState['tokensEarnedThisRun'];
      rewrites?: GameState['rewrites'];
      prestigeOwned?: GameState['prestigeOwned'];
    };
    return {
      tokens: legacy.tokens,
      owned: legacy.owned,
      shipOwned: legacy.shipOwned ?? {},
      lastTickAt: legacy.lastTickAt,
      tokensEarnedThisRun: legacy.tokensEarnedThisRun ?? 0,
      rewrites: legacy.rewrites ?? 0,
      prestigeOwned: legacy.prestigeOwned ?? {},
    } as GameState;
  },
  /**
   * v3 → v4: achievement counters + unlock map.
   * Seed lifetime tokens from this-run earnings only (no deeper retroactive credit).
   */
  3: (state) => {
    const legacy = state as GameState & {
      lifetimeTokensEarned?: GameState['lifetimeTokensEarned'];
      lifetimeClicks?: GameState['lifetimeClicks'];
      lifetimePurchases?: GameState['lifetimePurchases'];
      achievementsUnlocked?: GameState['achievementsUnlocked'];
    };
    return {
      tokens: legacy.tokens,
      owned: legacy.owned,
      shipOwned: legacy.shipOwned ?? {},
      lastTickAt: legacy.lastTickAt,
      tokensEarnedThisRun: legacy.tokensEarnedThisRun ?? 0,
      rewrites: legacy.rewrites ?? 0,
      prestigeOwned: legacy.prestigeOwned ?? {},
      lifetimeTokensEarned:
        legacy.lifetimeTokensEarned ?? legacy.tokensEarnedThisRun ?? 0,
      lifetimeClicks: legacy.lifetimeClicks ?? 0,
      lifetimePurchases: legacy.lifetimePurchases ?? 0,
      achievementsUnlocked: legacy.achievementsUnlocked ?? {},
    } as GameState;
  },
  /** v4 → v5: add this-run building upgrades map (per-producer tokens/s mults). */
  4: (state) => {
    const legacy = state as GameState & {
      buildingOwned?: GameState['buildingOwned'];
    };
    return {
      ...legacy,
      buildingOwned: legacy.buildingOwned ?? {},
    };
  },
  /**
   * v5 → v6: unlockable rooms (sticky map cosmetics).
   * Always seed office; no retroactive mid-ladder unlock credit beyond what
   * hydrate/live play will catch up from current owned / Rewrites.
   */
  5: (state) => {
    const legacy = state as GameState & {
      roomsUnlocked?: GameState['roomsUnlocked'];
      activeRoom?: GameState['activeRoom'];
    };
    return {
      ...legacy,
      roomsUnlocked: legacy.roomsUnlocked ?? { office: true },
      activeRoom: legacy.activeRoom ?? 'office',
    };
  },
};

/**
 * Bring a parsed save up to {@link CURRENT_SAVE_VERSION}.
 * Throws when a required migrator is missing or `v` is newer than supported.
 */
export function migrateSaveFile(file: SaveFile): SaveFile {
  if (file.v > CURRENT_SAVE_VERSION) {
    throw new Error(
      `Save version ${file.v} is newer than supported (${CURRENT_SAVE_VERSION})`,
    );
  }

  let v = file.v;
  let state = file.state;

  while (v < CURRENT_SAVE_VERSION) {
    const migrate = migrators[v];
    if (!migrate) {
      throw new Error(`Missing save migrator for version ${v}`);
    }
    state = migrate(state);
    v += 1;
  }

  return {
    ...file,
    v: CURRENT_SAVE_VERSION,
    state,
  };
}
