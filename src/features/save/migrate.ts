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
