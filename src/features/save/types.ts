import type { GameState } from '../../game/types';

/** Current on-disk / export schema version. Bump with an explicit migrator. */
export const CURRENT_SAVE_VERSION = 6;

/** localStorage key for the single save slot. */
export const SAVE_STORAGE_KEY = 'ship-it.save';

/**
 * Versioned save envelope. Wire format is base64(JSON.stringify(SaveFile)).
 * Checksum covers canonical `state` JSON only (not `v` / `savedAt`).
 */
export type SaveFile = {
  v: number;
  /** Epoch ms when this blob was written. */
  savedAt: number;
  state: GameState;
  /** SHA-256 hex of canonical state JSON. */
  checksum: string;
};

export type LoadResult = {
  file: SaveFile;
  /** False when checksum does not match canonical state (still playable). */
  checksumOk: boolean;
  /** Soft warnings (plausibility); never block play. */
  warnings: string[];
};

export type ParseError = {
  ok: false;
  error: string;
};

export type ParseSuccess = {
  ok: true;
  result: LoadResult;
};

export type ParseOutcome = ParseError | ParseSuccess;
