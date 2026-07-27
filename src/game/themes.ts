/**
 * Pure office-theme helpers — no store / DOM.
 */

import {
  DEFAULT_THEME_ID,
  getOfficeTheme,
  getOfficeThemeByName,
  officeThemes,
  type ThemeId,
} from '../data/officeThemes';
import type { OwnedThemes, Tokens } from './types';

/** Ensure classic office is present; drop unknown ids for play (warnings in parse). */
export function ensureDefaultThemeOwned(owned: OwnedThemes): OwnedThemes {
  if (owned[DEFAULT_THEME_ID] === true) {
    return owned;
  }
  return { ...owned, [DEFAULT_THEME_ID]: true };
}

export function hasOfficeTheme(owned: OwnedThemes, id: ThemeId): boolean {
  return ensureDefaultThemeOwned(owned)[id] === true;
}

/** Flat token cost from the catalog (`0` for the free starter). */
export function officeThemeCost(id: ThemeId): Tokens {
  return getOfficeTheme(id).cost;
}

export function canBuyOfficeTheme(
  id: ThemeId,
  owned: OwnedThemes,
  tokens: Tokens,
): boolean {
  if (hasOfficeTheme(owned, id)) {
    return false;
  }
  const cost = officeThemeCost(id);
  return cost > 0 && tokens >= cost;
}

/**
 * Pick a valid active theme: keep current if owned, else default.
 */
export function resolveActiveTheme(
  activeTheme: string | null | undefined,
  owned: OwnedThemes,
): ThemeId {
  const safe = ensureDefaultThemeOwned(owned);
  const current = getOfficeThemeByName(activeTheme);
  if (current && safe[current.name] === true) {
    return current.name;
  }
  return DEFAULT_THEME_ID;
}

/** CSS modifier class for the active theme (`office-theme-night-shift`, …). */
export function themeSceneClass(id: ThemeId): string {
  return `office-theme-${id}`;
}

/** Themes that can still be purchased (excludes free default + already owned). */
export function buyableOfficeThemes(owned: OwnedThemes): ThemeId[] {
  const safe = ensureDefaultThemeOwned(owned);
  return officeThemes
    .filter((theme) => theme.cost > 0 && safe[theme.name] !== true)
    .map((theme) => theme.name);
}
