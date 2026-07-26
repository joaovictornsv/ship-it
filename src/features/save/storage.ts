import { exportSaveBlob, parseSaveBlob } from './codec';
import { SAVE_STORAGE_KEY, type LoadResult } from './types';
import type { GameState } from '../../game/types';

export type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

/** Persist the current game state to the single localStorage slot. */
export async function writeSaveToStorage(
  state: GameState,
  storage: StorageLike,
  savedAt: number = Date.now(),
): Promise<void> {
  const blob = await exportSaveBlob(state, savedAt);
  storage.setItem(SAVE_STORAGE_KEY, blob);
}

/**
 * Load the single slot. Returns null when empty.
 * Checksum mismatch still yields a LoadResult (load anyway).
 */
export async function readSaveFromStorage(
  storage: StorageLike,
): Promise<LoadResult | null> {
  const blob = storage.getItem(SAVE_STORAGE_KEY);
  if (blob === null || blob.trim() === '') {
    return null;
  }
  const outcome = await parseSaveBlob(blob);
  if (!outcome.ok) {
    throw new Error(outcome.error);
  }
  return outcome.result;
}

export function clearSaveStorage(storage: StorageLike): void {
  storage.removeItem(SAVE_STORAGE_KEY);
}
