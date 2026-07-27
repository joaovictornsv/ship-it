import { describe, expect, it } from 'vitest';
import { deskSnackForIndex, DESK_SNACK_EMOJIS } from './deskClutter';

describe('deskSnackForIndex', () => {
  it('returns stable snack by index', () => {
    expect(deskSnackForIndex(0)).toBe(DESK_SNACK_EMOJIS[0]);
    expect(deskSnackForIndex(DESK_SNACK_EMOJIS.length)).toBe(
      DESK_SNACK_EMOJIS[0],
    );
  });
});
