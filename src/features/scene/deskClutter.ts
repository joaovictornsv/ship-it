/** Drink / snack glyphs for the desk right slot. */
export const DESK_SNACK_EMOJIS = ['☕', '🍵', '🥐', '🍪', '🧃', '🍩'] as const;

/** Center desk glyph — overflows upward from the desk bar. */
export const DESK_NOTEBOOK_EMOJI = '💻';

/** Right desk slot — drink or snack, index-stable. */
export function deskSnackForIndex(index: number): string {
  const i =
    ((index % DESK_SNACK_EMOJIS.length) + DESK_SNACK_EMOJIS.length) %
    DESK_SNACK_EMOJIS.length;
  return DESK_SNACK_EMOJIS[i]!;
}
