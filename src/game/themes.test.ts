import { describe, expect, it } from 'vitest';
import { DEFAULT_THEME_ID, OfficeThemes } from '../data/officeThemes';
import {
  buyableOfficeThemes,
  canBuyOfficeTheme,
  ensureDefaultThemeOwned,
  officeThemeCost,
  resolveActiveTheme,
  themeSceneClass,
} from './themes';

describe('ensureDefaultThemeOwned', () => {
  it('seeds classic default when missing', () => {
    expect(ensureDefaultThemeOwned({})).toEqual({ default: true });
    expect(ensureDefaultThemeOwned({ 'night-shift': true })).toEqual({
      'night-shift': true,
      default: true,
    });
  });
});

describe('resolveActiveTheme', () => {
  it('keeps owned theme and falls back to default', () => {
    const owned = { default: true as const, 'night-shift': true as const };
    expect(resolveActiveTheme('night-shift', owned)).toBe('night-shift');
    expect(resolveActiveTheme('hackathon', owned)).toBe(DEFAULT_THEME_ID);
    expect(resolveActiveTheme('bogus', owned)).toBe(DEFAULT_THEME_ID);
    expect(resolveActiveTheme(null, {})).toBe(DEFAULT_THEME_ID);
  });
});

describe('canBuyOfficeTheme / officeThemeCost', () => {
  it('uses flat catalog costs and refuses free / owned themes', () => {
    expect(officeThemeCost('default')).toBe(0);
    expect(officeThemeCost('night-shift')).toBe(
      OfficeThemes['night-shift'].cost,
    );
    expect(canBuyOfficeTheme('default', { default: true }, 999)).toBe(false);
    expect(canBuyOfficeTheme('night-shift', { default: true }, 499)).toBe(
      false,
    );
    expect(canBuyOfficeTheme('night-shift', { default: true }, 500)).toBe(true);
    expect(
      canBuyOfficeTheme(
        'night-shift',
        { default: true, 'night-shift': true },
        500,
      ),
    ).toBe(false);
  });
});

describe('themeSceneClass / buyableOfficeThemes', () => {
  it('builds CSS class names and lists unpaid themes', () => {
    expect(themeSceneClass('night-shift')).toBe('office-theme-night-shift');
    expect(buyableOfficeThemes({ default: true })).toEqual([
      'night-shift',
      'hackathon',
    ]);
    expect(buyableOfficeThemes({ default: true, 'night-shift': true })).toEqual(
      ['hackathon'],
    );
  });
});
