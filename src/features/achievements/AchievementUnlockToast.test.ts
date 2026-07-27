import { describe, expect, it } from 'vitest';
import { TOAST_EXIT_MS, TOAST_LINGER_MS } from './AchievementUnlockToast';

describe('AchievementUnlockToast timings', () => {
  it('lingers long enough to read title + blurb before exit', () => {
    expect(TOAST_LINGER_MS).toBe(5500);
    expect(TOAST_EXIT_MS).toBe(280);
    expect(TOAST_LINGER_MS).toBeGreaterThan(3200);
  });
});
