/**
 * Buyable office themes — scene-wide cosmetics (PRODUCT / issue #34).
 * IDs are stable; do not rename without a save migrator.
 * Catalog can stay thin (placeholders OK); expand once art direction lands.
 */

import { createEnum, getEnumByName } from '../lib/createEnum';

export type OfficeThemeFields = {
  /** Short English label for shop / a11y. */
  label: string;
  /** One-line tease for shop details. */
  blurb: string;
  /** Stage glyph (emoji) — scene warmth, not shell chrome. */
  emoji: string;
  /**
   * Flat token cost to unlock. `0` = free starter (always owned).
   * Currency is tokens only unless a later product decision says otherwise.
   */
  cost: number;
};

export const OfficeThemes = createEnum({
  default: {
    label: 'Classic office',
    blurb: 'Cool slate wash — the default deploy desk.',
    emoji: '🏢',
    cost: 0,
  },
  'night-shift': {
    label: 'Night shift',
    blurb: 'Dimmer walls for after-hours deploys.',
    emoji: '🌙',
    cost: 500,
  },
  hackathon: {
    label: 'Hackathon haze',
    blurb: 'Warm chaos — pizza boxes optional.',
    emoji: '🍕',
    cost: 2_500,
  },
});

export type ThemeId = keyof typeof OfficeThemes;

export type OfficeThemeDef = (typeof OfficeThemes)[ThemeId];

/** Ordered ascending by catalog index (default → placeholders). */
export const officeThemes: readonly OfficeThemeDef[] = Object.values(
  OfficeThemes,
).sort((a, b) => a.index - b.index);

export function getOfficeTheme(id: ThemeId): OfficeThemeDef {
  return OfficeThemes[id];
}

export function getOfficeThemeByName(
  name: string | null | undefined,
): OfficeThemeDef | null {
  return getEnumByName(OfficeThemes, name);
}

/** Starting theme — always owned. */
export const DEFAULT_THEME_ID: ThemeId = OfficeThemes.default.name;
