import { describe, expect, it } from 'vitest';
import { DEV_TITLES, devTitleForIndex } from './devTitles';

describe('devTitleForIndex', () => {
  it('returns stable titles by desk index', () => {
    expect(devTitleForIndex(0)).toBe(DEV_TITLES[0]);
    expect(devTitleForIndex(3)).toBe(DEV_TITLES[3]);
    expect(devTitleForIndex(0)).toBe(DEV_TITLES[0]);
  });

  it('wraps past pool length', () => {
    expect(devTitleForIndex(DEV_TITLES.length)).toBe(DEV_TITLES[0]);
    expect(devTitleForIndex(DEV_TITLES.length + 2)).toBe(DEV_TITLES[2]);
  });

  it('has enough titles for desktop LOD cap', () => {
    expect(DEV_TITLES.length).toBeGreaterThanOrEqual(32);
  });
});
