import { describe, expect, it } from 'vitest';
import {
  CODE_REVIEW,
  CODE_REVIEW_ID,
  DEV,
  DEV_ID,
  ESPRESSO_MACHINE,
  ESPRESSO_MACHINE_ID,
} from '../data/upgrades';
import {
  clickPower,
  COST_GROWTH,
  espressoMachineCost,
  tokensFromDelta,
  tokensPerSecond,
  upgradeCost,
} from './economy';

describe('clickPower', () => {
  it('returns base click power of 1 token', () => {
    expect(clickPower()).toBe(1);
  });
});

describe('upgradeCost', () => {
  it('returns base cost when owned is 0', () => {
    expect(upgradeCost(15, 0)).toBe(15);
  });

  it('grows Cookie-style by COST_GROWTH per owned unit', () => {
    expect(upgradeCost(15, 1)).toBe(Math.ceil(15 * COST_GROWTH));
    expect(upgradeCost(15, 2)).toBe(Math.ceil(15 * COST_GROWTH ** 2));
    expect(upgradeCost(15, 5)).toBe(Math.ceil(15 * COST_GROWTH ** 5));
  });

  it('rejects negative owned counts', () => {
    expect(() => upgradeCost(15, -1)).toThrow(/owned/);
  });
});

describe('espressoMachineCost', () => {
  it('matches catalog base cost for the first machine', () => {
    expect(espressoMachineCost(0)).toBe(ESPRESSO_MACHINE.baseCost);
  });
});

describe('tokensPerSecond', () => {
  it('is 0 with nothing owned', () => {
    expect(tokensPerSecond({})).toBe(0);
  });

  it('scales linearly with Espresso machines owned', () => {
    expect(tokensPerSecond({ [ESPRESSO_MACHINE_ID]: 1 })).toBeCloseTo(
      ESPRESSO_MACHINE.tokensPerSecond,
    );
    expect(tokensPerSecond({ [ESPRESSO_MACHINE_ID]: 3 })).toBeCloseTo(
      ESPRESSO_MACHINE.tokensPerSecond * 3,
    );
  });

  it('sums tokens/s across multiple upgrade types', () => {
    expect(
      tokensPerSecond({
        [ESPRESSO_MACHINE_ID]: 2,
        [DEV_ID]: 3,
        [CODE_REVIEW_ID]: 1,
      }),
    ).toBeCloseTo(
      ESPRESSO_MACHINE.tokensPerSecond * 2 +
        DEV.tokensPerSecond * 3 +
        CODE_REVIEW.tokensPerSecond,
    );
  });
});

describe('tokensFromDelta', () => {
  it('accrues tps * seconds', () => {
    expect(tokensFromDelta(0.1, 1000)).toBeCloseTo(0.1);
    expect(tokensFromDelta(0.1, 10_000)).toBeCloseTo(1);
    expect(tokensFromDelta(1, 500)).toBeCloseTo(0.5);
  });

  it('returns 0 for non-positive delta or rate', () => {
    expect(tokensFromDelta(0.1, 0)).toBe(0);
    expect(tokensFromDelta(0.1, -100)).toBe(0);
    expect(tokensFromDelta(0, 1000)).toBe(0);
  });
});
