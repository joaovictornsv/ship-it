import { decodeBase64, encodeBase64 } from './base64';
import { checksumState } from './checksum';
import { migrateSaveFile } from './migrate';
import { normalizeGameState } from './parseState';
import {
  CURRENT_SAVE_VERSION,
  type LoadResult,
  type ParseOutcome,
  type SaveFile,
} from './types';
import type { GameState } from '../../game/types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Minimal structural read of `state` before checksum (no clamping).
 * Omits `shipOwned` when absent so v1 checksums still match pre-migration blobs.
 */
function readRawGameState(raw: unknown): GameState {
  if (!isRecord(raw)) {
    throw new Error('Save state must be an object');
  }
  const { tokens, owned, lastTickAt, shipOwned } = raw;
  if (typeof tokens !== 'number' || !Number.isFinite(tokens)) {
    throw new Error('Save state.tokens must be a finite number');
  }
  if (typeof lastTickAt !== 'number' || !Number.isFinite(lastTickAt)) {
    throw new Error('Save state.lastTickAt must be a finite number');
  }
  if (!isRecord(owned)) {
    throw new Error('Save state.owned must be an object');
  }
  const ownedCounts: GameState['owned'] = {};
  for (const [id, count] of Object.entries(owned)) {
    if (typeof count === 'number' && Number.isFinite(count)) {
      ownedCounts[id as keyof GameState['owned']] = count;
    }
  }

  // Preserve wire shape for checksum: only include shipOwned when present.
  if (shipOwned === undefined) {
    return { tokens, owned: ownedCounts, lastTickAt } as GameState;
  }
  if (!isRecord(shipOwned)) {
    throw new Error('Save state.shipOwned must be an object');
  }
  const shipFlags: GameState['shipOwned'] = {};
  for (const [id, flag] of Object.entries(shipOwned)) {
    if (flag === true || flag === 1) {
      shipFlags[id as keyof GameState['shipOwned']] = true;
    }
  }
  return { tokens, owned: ownedCounts, shipOwned: shipFlags, lastTickAt };
}

/** Build a versioned SaveFile for the given state (fresh checksum). */
export async function buildSaveFile(
  state: GameState,
  savedAt: number = Date.now(),
): Promise<SaveFile> {
  const checksum = await checksumState(state);
  return {
    v: CURRENT_SAVE_VERSION,
    savedAt,
    state,
    checksum,
  };
}

/** Encode a SaveFile as the wire/storage base64 blob. */
export function encodeSaveBlob(file: SaveFile): string {
  return encodeBase64(JSON.stringify(file));
}

/** Build + encode in one step (autosave / export). */
export async function exportSaveBlob(
  state: GameState,
  savedAt: number = Date.now(),
): Promise<string> {
  const file = await buildSaveFile(state, savedAt);
  return encodeSaveBlob(file);
}

/**
 * Decode base64 → parse JSON → verify checksum → migrate → normalize.
 * Checksum mismatch still returns ok:true with checksumOk:false (load anyway).
 */
export async function parseSaveBlob(blob: string): Promise<ParseOutcome> {
  let jsonText: string;
  try {
    jsonText = decodeBase64(blob);
  } catch {
    return { ok: false, error: 'Save is not valid base64' };
  }

  let raw: unknown;
  try {
    raw = JSON.parse(jsonText);
  } catch {
    return { ok: false, error: 'Save JSON could not be parsed' };
  }

  if (!isRecord(raw)) {
    return { ok: false, error: 'Save envelope must be an object' };
  }

  const v = raw.v;
  const savedAt = raw.savedAt;
  const checksum = raw.checksum;
  if (typeof v !== 'number' || !Number.isInteger(v) || v < 1) {
    return { ok: false, error: 'Save version (v) is missing or invalid' };
  }
  if (typeof savedAt !== 'number' || !Number.isFinite(savedAt)) {
    return { ok: false, error: 'Save savedAt is missing or invalid' };
  }
  if (typeof checksum !== 'string' || checksum.length === 0) {
    return { ok: false, error: 'Save checksum is missing or invalid' };
  }

  let rawState: GameState;
  try {
    rawState = readRawGameState(raw.state);
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Save state is invalid',
    };
  }

  const expected = await checksumState(rawState);
  const checksumOk = expected === checksum;

  let migrated: SaveFile;
  try {
    migrated = migrateSaveFile({
      v,
      savedAt,
      state: rawState,
      checksum,
    });
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Save migration failed',
    };
  }

  const { state, warnings } = normalizeGameState(migrated.state);
  const freshChecksum = await checksumState(state);

  const result: LoadResult = {
    file: {
      v: CURRENT_SAVE_VERSION,
      savedAt: migrated.savedAt,
      state,
      checksum: freshChecksum,
    },
    checksumOk,
    warnings,
  };

  return { ok: true, result };
}

/** Convenience: parse and throw on hard failure. */
export async function parseSaveBlobOrThrow(blob: string): Promise<LoadResult> {
  const outcome = await parseSaveBlob(blob);
  if (!outcome.ok) {
    throw new Error(outcome.error);
  }
  return outcome.result;
}
