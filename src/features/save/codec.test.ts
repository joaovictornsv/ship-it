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
    shipOwned: {},
    tokensEarnedThisRun: 100,
    rewrites: 0,
    prestigeOwned: {},
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

  it('loads a v1 blob (no shipOwned) with matching checksum then migrates', async () => {
    const v1State = {
      tokens: 12,
      owned: { [ESPRESSO_MACHINE_ID]: 1 },
      lastTickAt: 50,
    };
    const checksum = await checksumState(v1State as GameState);
    const blob = encodeSaveBlob({
      v: 1,
      savedAt: 7,
      state: v1State as GameState,
      checksum,
    });
    const outcome = await parseSaveBlob(blob);
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) {
      return;
    }
    expect(outcome.result.checksumOk).toBe(true);
    expect(outcome.result.file.v).toBe(3);
    expect(outcome.result.file.state.shipOwned).toEqual({});
    expect(outcome.result.file.state.tokensEarnedThisRun).toBe(0);
    expect(outcome.result.file.state.rewrites).toBe(0);
    expect(outcome.result.file.state.prestigeOwned).toEqual({});
    expect(outcome.result.file.state.tokens).toBe(12);
  });

  it('loads a v2 blob (no prestige) with matching checksum then migrates', async () => {
    const v2State = {
      tokens: 20,
      owned: { [ESPRESSO_MACHINE_ID]: 2 },
      shipOwned: {},
      lastTickAt: 60,
    };
    const checksum = await checksumState(v2State as GameState);
    const blob = encodeSaveBlob({
      v: 2,
      savedAt: 8,
      state: v2State as GameState,
      checksum,
    });
    const outcome = await parseSaveBlob(blob);
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) {
      return;
    }
    expect(outcome.result.checksumOk).toBe(true);
    expect(outcome.result.file.v).toBe(3);
    expect(outcome.result.file.state.tokensEarnedThisRun).toBe(0);
    expect(outcome.result.file.state.rewrites).toBe(0);
    expect(outcome.result.file.state.prestigeOwned).toEqual({});
  });

  it('checksum is stable across key order in owned', async () => {
    const a = await checksumState({
      tokens: 1,
      lastTickAt: 0,
      owned: { [ESPRESSO_MACHINE_ID]: 1 },
      shipOwned: {},
      tokensEarnedThisRun: 0,
      rewrites: 0,
      prestigeOwned: {},
    });
    const b = await checksumState(
      JSON.parse(
        `{"lastTickAt":0,"owned":{"${ESPRESSO_MACHINE_ID}":1},"prestigeOwned":{},"rewrites":0,"shipOwned":{},"tokens":1,"tokensEarnedThisRun":0}`,
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

  it('migrates v1 saves through v2 shipOwned then v3 prestige defaults', () => {
    const v1State = {
      tokens: 10,
      owned: { [ESPRESSO_MACHINE_ID]: 1 },
      lastTickAt: 99,
    } as GameState;
    const migrated = migrateSaveFile({
      v: 1,
      savedAt: 1,
      state: v1State,
      checksum: 'abc',
    });
    expect(migrated.v).toBe(3);
    expect(migrated.state.shipOwned).toEqual({});
    expect(migrated.state.tokensEarnedThisRun).toBe(0);
    expect(migrated.state.rewrites).toBe(0);
    expect(migrated.state.prestigeOwned).toEqual({});
    expect(migrated.state.tokens).toBe(10);
    expect(migrated.state.owned[ESPRESSO_MACHINE_ID]).toBe(1);
  });

  it('migrates v2 saves by adding prestige fields', () => {
    const v2State = {
      tokens: 10,
      owned: { [ESPRESSO_MACHINE_ID]: 1 },
      shipOwned: {},
      lastTickAt: 99,
    } as GameState;
    const migrated = migrateSaveFile({
      v: 2,
      savedAt: 1,
      state: v2State,
      checksum: 'abc',
    });
    expect(migrated.v).toBe(3);
    expect(migrated.state.tokensEarnedThisRun).toBe(0);
    expect(migrated.state.rewrites).toBe(0);
    expect(migrated.state.prestigeOwned).toEqual({});
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
