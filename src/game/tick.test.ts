import { describe, expect, it } from 'vitest';
import { ESPRESSO_MACHINE_ID } from '../data/upgrades';
import { applyProductionTick, resumeWithoutAccrual } from './tick';

describe('applyProductionTick', () => {
  it('grants tokens from owned producers over elapsed time', () => {
    const result = applyProductionTick(
      {
        tokens: 0,
        owned: { [ESPRESSO_MACHINE_ID]: 1 },
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
      { tokens: 5, owned: {}, lastTickAt: 0 },
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
        lastTickAt: 100,
      },
      100,
    );
    expect(result.earned).toBe(0);
    expect(result.tokens).toBe(1);
    expect(result.lastTickAt).toBe(100);
  });
});

describe('resumeWithoutAccrual', () => {
  it('moves lastTickAt forward without implying a token grant', () => {
    expect(resumeWithoutAccrual(42_000)).toEqual({ lastTickAt: 42_000 });
  });
});
