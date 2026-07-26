import { createEnum } from '../lib/createEnum';
import type { Tokens } from '../game/types';

/** Stable Ship upgrade IDs — do not rename without a save migrator. */
export const RUBBER_DUCK_ID = 'rubber-duck' as const;
export const MECHANICAL_KEYBOARD_ID = 'mechanical-keyboard' as const;
export const STANDUP_ID = 'standup' as const;
export const STACK_OVERFLOW_TAB_ID = 'stack-overflow-tab' as const;
export const STICKY_NOTES_ID = 'sticky-notes' as const;
export const DARK_MODE_ID = 'dark-mode' as const;
export const PAIR_PROGRAMMING_ID = 'pair-programming' as const;
export const LGTM_STAMP_ID = 'lgtm-stamp' as const;
export const POMODORO_ID = 'pomodoro' as const;
export const GREEN_BUILD_ID = 'green-build' as const;
export const README_DRIVEN_ID = 'readme-driven' as const;
export const SHIP_IT_FRIDAY_ID = 'ship-it-friday' as const;

export type ShipUpgradeId =
  | typeof RUBBER_DUCK_ID
  | typeof MECHANICAL_KEYBOARD_ID
  | typeof STANDUP_ID
  | typeof STACK_OVERFLOW_TAB_ID
  | typeof STICKY_NOTES_ID
  | typeof DARK_MODE_ID
  | typeof PAIR_PROGRAMMING_ID
  | typeof LGTM_STAMP_ID
  | typeof POMODORO_ID
  | typeof GREEN_BUILD_ID
  | typeof README_DRIVEN_ID
  | typeof SHIP_IT_FRIDAY_ID;

/** Free-license emoji keys for Ship upgrade shop tiles / CTA glyph. */
export type ShipUpgradeIconId =
  | 'rubber-duck'
  | 'mechanical-keyboard'
  | 'standup'
  | 'stack-overflow-tab'
  | 'sticky-notes'
  | 'dark-mode'
  | 'pair-programming'
  | 'lgtm-stamp'
  | 'pomodoro'
  | 'green-build'
  | 'readme-driven'
  | 'ship-it-friday';

/** CSS custom-property name for a Ship upgrade accent. */
export type ShipUpgradeColorVar =
  | '--ship-upgrade-rubber-duck'
  | '--ship-upgrade-keyboard'
  | '--ship-upgrade-standup'
  | '--ship-upgrade-stack-overflow'
  | '--ship-upgrade-sticky-notes'
  | '--ship-upgrade-dark-mode'
  | '--ship-upgrade-pair'
  | '--ship-upgrade-lgtm'
  | '--ship-upgrade-pomodoro'
  | '--ship-upgrade-green-build'
  | '--ship-upgrade-readme'
  | '--ship-upgrade-friday';

/** Flat add to base click power, or multiply after flats. */
export type ShipUpgradeEffect =
  { kind: 'flat'; amount: number } | { kind: 'mult'; factor: number };

/**
 * Effect kinds own label / accumulate behavior so shop / achievements /
 * economy do not duplicate `effect.kind === 'flat'` chains.
 */
export const ShipUpgradeEffectKinds = createEnum({
  flat: {
    getLabel: (effect: { amount: number }) =>
      `+${effect.amount} tokens per click`,
    accumulate: (
      acc: { flat: number; mult: number },
      effect: { amount: number },
    ) => {
      acc.flat += effect.amount;
    },
  },
  mult: {
    getLabel: (effect: { factor: number }) => `×${effect.factor} click power`,
    accumulate: (
      acc: { flat: number; mult: number },
      effect: { factor: number },
    ) => {
      acc.mult *= effect.factor;
    },
  },
});

export type ShipUpgradeEffectKind = keyof typeof ShipUpgradeEffectKinds;

/** Player-facing effect line for a Ship upgrade. */
export function shipUpgradeEffectLabel(effect: ShipUpgradeEffect): string {
  if (effect.kind === ShipUpgradeEffectKinds.flat.name) {
    return ShipUpgradeEffectKinds.flat.getLabel(effect);
  }
  return ShipUpgradeEffectKinds.mult.getLabel(effect);
}

/** Fold one owned effect into click-power accumulators. */
export function applyShipUpgradeEffect(
  acc: { flat: number; mult: number },
  effect: ShipUpgradeEffect,
): void {
  if (effect.kind === ShipUpgradeEffectKinds.flat.name) {
    ShipUpgradeEffectKinds.flat.accumulate(acc, effect);
    return;
  }
  ShipUpgradeEffectKinds.mult.accumulate(acc, effect);
}

export type ShipUpgradeDef = {
  id: ShipUpgradeId;
  name: string;
  /** Short joke blurb for tiles / achievements. */
  blurb: string;
  /** Fixed one-shot cost (not Cookie-style rising). */
  cost: Tokens;
  effect: ShipUpgradeEffect;
  icon: ShipUpgradeIconId;
  /** Shop / CTA glyph — owned by the catalog entry. */
  emoji: string;
  /** Accent CSS var — owned by the catalog entry. */
  colorVar: ShipUpgradeColorVar;
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
  emoji: '🦆',
  colorVar: '--ship-upgrade-rubber-duck',
  ctaLabel: 'Duck ship',
};

export const MECHANICAL_KEYBOARD: ShipUpgradeDef = {
  id: MECHANICAL_KEYBOARD_ID,
  name: 'Mechanical keyboard',
  blurb: 'Clickier clicks. Neighbors included free.',
  cost: 750,
  effect: { kind: 'flat', amount: 2 },
  icon: 'mechanical-keyboard',
  emoji: '⌨️',
  colorVar: '--ship-upgrade-keyboard',
  ctaLabel: 'Type & ship',
};

export const STANDUP: ShipUpgradeDef = {
  id: STANDUP_ID,
  name: 'Standup',
  blurb: 'Fifteen minutes. Three updates. Zero decisions.',
  cost: 2_000,
  effect: { kind: 'flat', amount: 3 },
  icon: 'standup',
  emoji: '🗣️',
  colorVar: '--ship-upgrade-standup',
  ctaLabel: 'Stand & ship',
};

export const STACK_OVERFLOW_TAB: ShipUpgradeDef = {
  id: STACK_OVERFLOW_TAB_ID,
  name: 'Stack Overflow tab',
  blurb: 'Copy, paste, pray, ship. Ancient ritual.',
  cost: 5_000,
  effect: { kind: 'flat', amount: 5 },
  icon: 'stack-overflow-tab',
  emoji: '📚',
  colorVar: '--ship-upgrade-stack-overflow',
  ctaLabel: 'Ship from SO',
};

export const STICKY_NOTES: ShipUpgradeDef = {
  id: STICKY_NOTES_ID,
  name: 'Sticky notes',
  blurb: 'The kanban that lives on your monitor bezel.',
  cost: 12_000,
  effect: { kind: 'flat', amount: 8 },
  icon: 'sticky-notes',
  emoji: '🗒️',
  colorVar: '--ship-upgrade-sticky-notes',
  ctaLabel: 'Note & ship',
};

export const DARK_MODE: ShipUpgradeDef = {
  id: DARK_MODE_ID,
  name: 'Dark mode',
  blurb: 'Same code. Twice the confidence.',
  cost: 35_000,
  effect: { kind: 'mult', factor: 2 },
  icon: 'dark-mode',
  emoji: '🌙',
  colorVar: '--ship-upgrade-dark-mode',
  ctaLabel: 'Ship after dark',
};

export const PAIR_PROGRAMMING: ShipUpgradeDef = {
  id: PAIR_PROGRAMMING_ID,
  name: 'Pair programming',
  blurb: 'Two keyboards. One brain cell. Somehow faster.',
  cost: 90_000,
  effect: { kind: 'flat', amount: 15 },
  icon: 'pair-programming',
  emoji: '👯',
  colorVar: '--ship-upgrade-pair',
  ctaLabel: 'Pair & ship',
};

export const LGTM_STAMP: ShipUpgradeDef = {
  id: LGTM_STAMP_ID,
  name: 'LGTM stamp',
  blurb: 'Looks good to merge. Tests optional.',
  cost: 220_000,
  effect: { kind: 'mult', factor: 2 },
  icon: 'lgtm-stamp',
  emoji: '✅',
  colorVar: '--ship-upgrade-lgtm',
  ctaLabel: 'LGTM ship',
};

export const POMODORO: ShipUpgradeDef = {
  id: POMODORO_ID,
  name: 'Pomodoro',
  blurb: 'Twenty-five minutes of focus. Five of snacks.',
  cost: 600_000,
  effect: { kind: 'flat', amount: 25 },
  icon: 'pomodoro',
  emoji: '🍅',
  colorVar: '--ship-upgrade-pomodoro',
  ctaLabel: 'Focus ship',
};

export const GREEN_BUILD: ShipUpgradeDef = {
  id: GREEN_BUILD_ID,
  name: 'Green build',
  blurb: 'All checks passed. Nobody knows why.',
  cost: 1_800_000,
  effect: { kind: 'mult', factor: 2 },
  icon: 'green-build',
  emoji: '🟢',
  colorVar: '--ship-upgrade-green-build',
  ctaLabel: 'Green ship',
};

export const README_DRIVEN: ShipUpgradeDef = {
  id: README_DRIVEN_ID,
  name: 'README-driven',
  blurb: 'Document it first. Implement never. Ship anyway.',
  cost: 5_000_000,
  effect: { kind: 'flat', amount: 50 },
  icon: 'readme-driven',
  emoji: '📄',
  colorVar: '--ship-upgrade-readme',
  ctaLabel: 'Docs & ship',
};

export const SHIP_IT_FRIDAY: ShipUpgradeDef = {
  id: SHIP_IT_FRIDAY_ID,
  name: 'Ship-it Friday',
  blurb: 'No review Friday. Weekend on-call included.',
  cost: 15_000_000,
  effect: { kind: 'mult', factor: 3 },
  icon: 'ship-it-friday',
  emoji: '🚀',
  colorVar: '--ship-upgrade-friday',
  ctaLabel: 'Friday ship',
};

/** Shop order: early → late (one-shot ladder). */
export const shipUpgrades = [
  RUBBER_DUCK,
  MECHANICAL_KEYBOARD,
  STANDUP,
  STACK_OVERFLOW_TAB,
  STICKY_NOTES,
  DARK_MODE,
  PAIR_PROGRAMMING,
  LGTM_STAMP,
  POMODORO,
  GREEN_BUILD,
  README_DRIVEN,
  SHIP_IT_FRIDAY,
] as const;

export function getShipUpgrade(id: ShipUpgradeId): ShipUpgradeDef {
  const found = shipUpgrades.find((u) => u.id === id);
  if (!found) {
    throw new Error(`Unknown ship upgrade id: ${id}`);
  }
  return found;
}

/** Lookup Ship upgrade by icon key. */
export function getShipUpgradeByIcon(icon: ShipUpgradeIconId): ShipUpgradeDef {
  const found = shipUpgrades.find((u) => u.icon === icon);
  if (!found) {
    throw new Error(`Unknown ship upgrade icon: ${icon}`);
  }
  return found;
}

/** Index in the ladder, or -1 if unknown. */
export function shipUpgradeLadderIndex(id: ShipUpgradeId): number {
  return shipUpgrades.findIndex((u) => u.id === id);
}

/**
 * Shop queue: only the next buyable (available, not owned) upgrade.
 * Owned and locked future steps stay hidden. Empty when the track is done.
 */
export function visibleShipUpgradeQueue(
  shipOwned: Partial<Record<ShipUpgradeId, true>>,
): ShipUpgradeDef[] {
  for (const def of shipUpgrades) {
    if (shipOwned[def.id] !== true) {
      return [def];
    }
  }
  return [];
}
