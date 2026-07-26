import { describe, expect, it } from 'vitest';
import { ESPRESSO_MACHINE_ID } from '../../data/upgrades';
import type { GameState } from '../../game/types';
import { decodeBase64, encodeBase64 } from './base64';
import { stableStringify } from './canonical';
import { checksumState } from './checksum';
import {
  buildSaveFile,
  encodeSaveBlob,
  exportSaveBlob,
  parseSaveBlob,
} from './codec';
import { migrateSaveFile } from './migrate';
import {
  clearSaveStorage,
  readSaveFromStorage,
  writeSaveToStorage,
} from './storage';
import { CURRENT_SAVE_VERSION, type SaveFile } from './types';

function sampleState(overrides: Partial<GameState> = {}): GameState {
  return {
    tokens: 42,
    owned: { [ESPRESSO_MACHINE_ID]: 2 },
    lastTickAt: 1_700_000_000_000,
    ...overrides,
  };
}

function memoryStorage(initial: Record<string, string> = {}): Storage {
  const map = new Map(Object.entries(initial));
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (key) => (map.has(key) ? map.get(key)! : null),
    key: (index) => [...map.keys()][index] ?? null,
    removeItem: (key) => {
      map.delete(key);
    },
    setItem: (key, value) => {
      map.set(key, String(value));
    },
  };
}

describe('stableStringify', () => {
  it('sorts object keys recursively', () => {
    expect(stableStringify({ b: 1, a: { d: 2, c: 3 } })).toBe(
      '{"a":{"c":3,"d":2},"b":1}',
    );
  });
});

describe('base64', () => {
  it('round-trips unicode text', () => {
    const text = '{"tokens":1,"note":"café"}';
    expect(decodeBase64(encodeBase64(text))).toBe(text);
  });
});

describe('checksum + codec', () => {
  it('round-trips export → parse with matching checksum', async () => {
    const state = sampleState();
    const blob = await exportSaveBlob(state, 123);
    const outcome = await parseSaveBlob(blob);
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) {
      return;
    }
    expect(outcome.result.checksumOk).toBe(true);
    expect(outcome.result.file.v).toBe(CURRENT_SAVE_VERSION);
    expect(outcome.result.file.savedAt).toBe(123);
    expect(outcome.result.file.state.tokens).toBe(42);
    expect(outcome.result.file.state.owned[ESPRESSO_MACHINE_ID]).toBe(2);
    expect(outcome.result.warnings).toEqual([]);
  });

  it('loads anyway when checksum mismatches', async () => {
    const file = await buildSaveFile(sampleState({ tokens: 99 }), 456);
    const tampered: SaveFile = {
      ...file,
      state: { ...file.state, tokens: 9_999_999 },
    };
    const blob = encodeSaveBlob(tampered);
    const outcome = await parseSaveBlob(blob);
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) {
      return;
    }
    expect(outcome.result.checksumOk).toBe(false);
    expect(outcome.result.file.state.tokens).toBe(9_999_999);
  });

  it('rejects invalid base64 / JSON hard failures', async () => {
    await expect(parseSaveBlob('%%%not-base64%%%')).resolves.toMatchObject({
      ok: false,
    });
    const junk = encodeBase64('not-json');
    await expect(parseSaveBlob(junk)).resolves.toMatchObject({ ok: false });
  });

  it('checksum is stable across key order in owned', async () => {
    const a = await checksumState({
      tokens: 1,
      lastTickAt: 0,
      owned: { [ESPRESSO_MACHINE_ID]: 1 },
    });
    const b = await checksumState(
      JSON.parse(
        `{"lastTickAt":0,"owned":{"${ESPRESSO_MACHINE_ID}":1},"tokens":1}`,
      ) as GameState,
    );
    expect(a).toBe(b);
  });
});

describe('migrateSaveFile', () => {
  it('passes through current version unchanged', () => {
    const file: SaveFile = {
      v: CURRENT_SAVE_VERSION,
      savedAt: 1,
      state: sampleState(),
      checksum: 'abc',
    };
    expect(migrateSaveFile(file)).toEqual(file);
  });

  it('rejects newer-than-supported versions', () => {
    expect(() =>
      migrateSaveFile({
        v: CURRENT_SAVE_VERSION + 1,
        savedAt: 1,
        state: sampleState(),
        checksum: 'abc',
      }),
    ).toThrow(/newer than supported/);
  });
});

describe('storage', () => {
  it('writes and reads a single slot', async () => {
    const storage = memoryStorage();
    const state = sampleState({ tokens: 7 });
    await writeSaveToStorage(state, storage, 999);
    const loaded = await readSaveFromStorage(storage);
    expect(loaded).not.toBeNull();
    expect(loaded!.checksumOk).toBe(true);
    expect(loaded!.file.state.tokens).toBe(7);
    expect(loaded!.file.savedAt).toBe(999);
    clearSaveStorage(storage);
    expect(await readSaveFromStorage(storage)).toBeNull();
  });
});

describe('reload restore contract', () => {
  it('empty boot snapshot must not replace a good slot once hydrated state is written', async () => {
    const storage = memoryStorage();
    const good = sampleState({
      tokens: 88,
      owned: { [ESPRESSO_MACHINE_ID]: 3 },
    });
    await writeSaveToStorage(good, storage, 1);

    // Simulate a buggy boot flush of the pre-hydrate store.
    const emptyBoot = sampleState({
      tokens: 0,
      owned: {},
      lastTickAt: Date.now(),
    });
    await writeSaveToStorage(emptyBoot, storage, 2);
    const wiped = await readSaveFromStorage(storage);
    expect(wiped!.file.state.tokens).toBe(0);

    // After hydrate, persisting the restored slice must bring progress back.
    await writeSaveToStorage(good, storage, 3);
    const restored = await readSaveFromStorage(storage);
    expect(restored!.file.state.tokens).toBe(88);
    expect(restored!.file.state.owned[ESPRESSO_MACHINE_ID]).toBe(3);
  });
});
