import { describe, expect, it } from 'vitest';
import { DOUBLE_SHOT_ID } from '../data/buildingUpgrades';
import { ESPRESSO_MACHINE_ID } from '../data/upgrades';
import { applyProductionTick, resumeWithoutAccrual } from './tick';

describe('applyProductionTick', () => {
  it('grants tokens from owned producers over elapsed time', () => {
    const result = applyProductionTick(
      {
        tokens: 0,
        owned: { [ESPRESSO_MACHINE_ID]: 1 },
        rewrites: 0,
        prestigeOwned: {},
        buildingOwned: {},
        lastTickAt: 1_000,
      },
      2_000,
    );

    expect(result.earned).toBeCloseTo(0.1);
    expect(result.tokens).toBeCloseTo(0.1);
    expect(result.lastTickAt).toBe(2_000);
  });

  it('grants nothing when nothing is owned', () => {
    const result = applyProductionTick(
      {
        tokens: 5,
        owned: {},
        rewrites: 0,
        prestigeOwned: {},
        buildingOwned: {},
        lastTickAt: 0,
      },
      5_000,
    );
    expect(result.earned).toBe(0);
    expect(result.tokens).toBe(5);
    expect(result.lastTickAt).toBe(5_000);
  });

  it('is a no-op when now is not after lastTickAt', () => {
    const result = applyProductionTick(
      {
        tokens: 1,
        owned: { [ESPRESSO_MACHINE_ID]: 10 },
        rewrites: 0,
        prestigeOwned: {},
        buildingOwned: {},
        lastTickAt: 100,
      },
      100,
    );
    expect(result.earned).toBe(0);
    expect(result.tokens).toBe(1);
    expect(result.lastTickAt).toBe(100);
  });

  it('applies banked Rewrites mult to accrual', () => {
    const result = applyProductionTick(
      {
        tokens: 0,
        owned: { [ESPRESSO_MACHINE_ID]: 1 },
        rewrites: 2,
        prestigeOwned: {},
        buildingOwned: {},
        lastTickAt: 0,
      },
      1_000,
    );
    expect(result.earned).toBeCloseTo(0.1 * 1.1);
  });

  it('applies building upgrades to accrual', () => {
    const result = applyProductionTick(
      {
        tokens: 0,
        owned: { [ESPRESSO_MACHINE_ID]: 1 },
        rewrites: 0,
        prestigeOwned: {},
        buildingOwned: { [DOUBLE_SHOT_ID]: true },
        lastTickAt: 0,
      },
      1_000,
    );
    expect(result.earned).toBeCloseTo(0.2);
  });
});

describe('resumeWithoutAccrual', () => {
  it('moves lastTickAt forward without implying a token grant', () => {
    expect(resumeWithoutAccrual(42_000)).toEqual({ lastTickAt: 42_000 });
  });
});
