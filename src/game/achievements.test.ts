import { describe, expect, it } from 'vitest';
import { Achievements, achievements } from '../data/achievements';
import { DEV_ID, ESPRESSO_MACHINE_ID } from '../data/upgrades';
import {
  achievementProgress,
  isGoalMet,
  mergeUnlockedAchievements,
  metAchievementIds,
  newlyUnlockedAchievements,
} from './achievements';

const emptySnap = {
  lifetimeTokensEarned: 0,
  lifetimeClicks: 0,
  lifetimePurchases: 0,
  owned: {},
  rewrites: 0,
};

describe('achievement catalog', () => {
  it('ships at least one achievement per starter family', () => {
    const families = new Set(achievements.map((a) => a.family));
    expect(families.has('tokens')).toBe(true);
    expect(families.has('clicks')).toBe(true);
    expect(families.has('owned')).toBe(true);
    expect(families.has('purchases')).toBe(true);
  });

  it('keeps stable createEnum names as ids', () => {
    expect(Achievements['first-ship'].name).toBe('first-ship');
    expect(Achievements['espresso-drip'].goal).toEqual({
      kind: 'owned',
      upgradeId: ESPRESSO_MACHINE_ID,
      threshold: 1,
    });
  });
});

describe('isGoalMet / metAchievementIds', () => {
  it('unlocks first-ship on one lifetime click', () => {
    expect(
      isGoalMet(Achievements['first-ship'].goal, {
        ...emptySnap,
        lifetimeClicks: 1,
      }),
    ).toBe(true);
    expect(isGoalMet(Achievements['first-ship'].goal, emptySnap)).toBe(false);
  });

  it('unlocks token and owned thresholds', () => {
    const snap = {
      ...emptySnap,
      lifetimeTokensEarned: 100,
      owned: { [ESPRESSO_MACHINE_ID]: 1, [DEV_ID]: 10 },
    };
    const met = new Set(metAchievementIds(snap));
    expect(met.has('pocket-change')).toBe(true);
    expect(met.has('espresso-drip')).toBe(true);
    expect(met.has('crowd-control')).toBe(true);
    expect(met.has('first-hire')).toBe(true);
    expect(met.has('funding-round')).toBe(false);
  });

  it('unlocks purchases and Rewrites goals', () => {
    const snap = {
      ...emptySnap,
      lifetimePurchases: 25,
      rewrites: 1,
    };
    const met = new Set(metAchievementIds(snap));
    expect(met.has('window-shopper')).toBe(true);
    expect(met.has('shopping-spree')).toBe(true);
    expect(met.has('rewrite-ready')).toBe(true);
  });
});

describe('newlyUnlockedAchievements', () => {
  it('returns only unmet→met ids in catalog order', () => {
    const snap = {
      ...emptySnap,
      lifetimeClicks: 1,
      lifetimeTokensEarned: 100,
    };
    const newly = newlyUnlockedAchievements(snap, {
      'first-ship': true,
    });
    expect(newly).toEqual(['pocket-change']);
  });

  it('mergeUnlockedAchievements is a no-op for empty newly', () => {
    const unlocked = { 'first-ship': true } as const;
    expect(mergeUnlockedAchievements(unlocked, [])).toBe(unlocked);
  });
});

describe('achievementProgress', () => {
  it('reports current vs threshold for owned goals', () => {
    expect(
      achievementProgress(Achievements['barista-squad'].goal, {
        ...emptySnap,
        owned: { [ESPRESSO_MACHINE_ID]: 4 },
      }),
    ).toEqual({ current: 4, threshold: 10 });
  });
});
