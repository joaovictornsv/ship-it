import type { Tokens } from '../game/types';

/** Stable Ship upgrade IDs — do not rename without a save migrator. */
export const RUBBER_DUCK_ID = 'rubber-duck' as const;
export const MECHANICAL_KEYBOARD_ID = 'mechanical-keyboard' as const;
export const STACK_OVERFLOW_TAB_ID = 'stack-overflow-tab' as const;
export const DARK_MODE_ID = 'dark-mode' as const;
export const LGTM_STAMP_ID = 'lgtm-stamp' as const;

export type ShipUpgradeId =
  | typeof RUBBER_DUCK_ID
  | typeof MECHANICAL_KEYBOARD_ID
  | typeof STACK_OVERFLOW_TAB_ID
  | typeof DARK_MODE_ID
  | typeof LGTM_STAMP_ID;

/** Free-license emoji keys for Ship upgrade shop rows / CTA glyph. */
export type ShipUpgradeIconId =
  | 'rubber-duck'
  | 'mechanical-keyboard'
  | 'stack-overflow-tab'
  | 'dark-mode'
  | 'lgtm-stamp';

/** Flat add to base click power, or multiply after flats. */
export type ShipUpgradeEffect =
  { kind: 'flat'; amount: number } | { kind: 'mult'; factor: number };

export type ShipUpgradeDef = {
  id: ShipUpgradeId;
  name: string;
  /** Short joke blurb for shop rows. */
  blurb: string;
  /** Fixed one-shot cost (not Cookie-style rising). */
  cost: Tokens;
  effect: ShipUpgradeEffect;
  icon: ShipUpgradeIconId;
  /**
   * Ship It CTA label when this is the highest owned upgrade.
   * English only; no emoji (glyph is separate).
   */
  ctaLabel: string;
};

/**
 * One-shot click-power ladder (Cookie flavor analog).
 * Buy once → unlock next. Not tokens/s; Espresso stays a producer only.
 */
export const RUBBER_DUCK: ShipUpgradeDef = {
  id: RUBBER_DUCK_ID,
  name: 'Rubber duck',
  blurb: 'Explain the bug out loud. The duck ships anyway.',
  cost: 100,
  effect: { kind: 'flat', amount: 1 },
  icon: 'rubber-duck',
  ctaLabel: 'Ship It',
};

export const MECHANICAL_KEYBOARD: ShipUpgradeDef = {
  id: MECHANICAL_KEYBOARD_ID,
  name: 'Mechanical keyboard',
  blurb: 'Clickier clicks. Neighbors included free.',
  cost: 750,
  effect: { kind: 'flat', amount: 2 },
  icon: 'mechanical-keyboard',
  ctaLabel: 'Type & ship',
};

export const STACK_OVERFLOW_TAB: ShipUpgradeDef = {
  id: STACK_OVERFLOW_TAB_ID,
  name: 'Stack Overflow tab',
  blurb: 'Copy, paste, pray, ship. Ancient ritual.',
  cost: 4_000,
  effect: { kind: 'flat', amount: 5 },
  icon: 'stack-overflow-tab',
  ctaLabel: 'Ship from SO',
};

export const DARK_MODE: ShipUpgradeDef = {
  id: DARK_MODE_ID,
  name: 'Dark mode',
  blurb: 'Same code. Twice the confidence.',
  cost: 25_000,
  effect: { kind: 'mult', factor: 2 },
  icon: 'dark-mode',
  ctaLabel: 'Ship after dark',
};

export const LGTM_STAMP: ShipUpgradeDef = {
  id: LGTM_STAMP_ID,
  name: 'LGTM stamp',
  blurb: 'Looks good to merge. Tests optional.',
  cost: 150_000,
  effect: { kind: 'mult', factor: 2 },
  icon: 'lgtm-stamp',
  ctaLabel: 'LGTM ship',
};

/** Shop order: early → late (one-shot ladder). */
export const shipUpgrades = [
  RUBBER_DUCK,
  MECHANICAL_KEYBOARD,
  STACK_OVERFLOW_TAB,
  DARK_MODE,
  LGTM_STAMP,
] as const;

export function getShipUpgrade(id: ShipUpgradeId): ShipUpgradeDef {
  const found = shipUpgrades.find((u) => u.id === id);
  if (!found) {
    throw new Error(`Unknown ship upgrade id: ${id}`);
  }
  return found;
}

/** Index in the ladder, or -1 if unknown. */
export function shipUpgradeLadderIndex(id: ShipUpgradeId): number {
  return shipUpgrades.findIndex((u) => u.id === id);
}
