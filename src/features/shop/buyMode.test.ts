import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  BUY_MODE_STORAGE_KEY,
  DEFAULT_BUY_MODE,
  isBuyModeName,
  readBuyModeFromSession,
  writeBuyModeToSession,
} from './buyMode';

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
      map.set(key, value);
    },
  };
}

describe('buyMode session helpers', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'sessionStorage', {
      value: memoryStorage(),
      configurable: true,
      writable: true,
    });
  });

  afterEach(() => {
    Reflect.deleteProperty(globalThis, 'sessionStorage');
  });

  it('defaults to ×1 and rejects unknown names', () => {
    expect(readBuyModeFromSession()).toBe(DEFAULT_BUY_MODE);
    expect(isBuyModeName('x10')).toBe(true);
    expect(isBuyModeName('nope')).toBe(false);
  });

  it('round-trips the selected mode through sessionStorage', () => {
    writeBuyModeToSession('x100');
    expect(sessionStorage.getItem(BUY_MODE_STORAGE_KEY)).toBe('x100');
    expect(readBuyModeFromSession()).toBe('x100');

    writeBuyModeToSession('max');
    expect(readBuyModeFromSession()).toBe('max');
  });

  it('falls back when sessionStorage holds garbage', () => {
    sessionStorage.setItem(BUY_MODE_STORAGE_KEY, 'banana');
    expect(readBuyModeFromSession()).toBe(DEFAULT_BUY_MODE);
  });
});
