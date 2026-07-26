import { describe, expect, it } from 'vitest';
import { ESPRESSO_MACHINE, ESPRESSO_MACHINE_ID } from '../data/upgrades';
import {
  beansFromDelta,
  beansPerSecond,
  clickPower,
  COST_GROWTH,
  espressoMachineCost,
  upgradeCost,
} from './economy';

describe('clickPower', () => {
  it('returns base click power of 1 bean', () => {
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

describe('beansPerSecond', () => {
  it('is 0 with nothing owned', () => {
    expect(beansPerSecond({})).toBe(0);
  });

  it('scales linearly with Espresso machines owned', () => {
    expect(beansPerSecond({ [ESPRESSO_MACHINE_ID]: 1 })).toBeCloseTo(
      ESPRESSO_MACHINE.beansPerSecond,
    );
    expect(beansPerSecond({ [ESPRESSO_MACHINE_ID]: 3 })).toBeCloseTo(
      ESPRESSO_MACHINE.beansPerSecond * 3,
    );
  });
});

describe('beansFromDelta', () => {
  it('accrues bps * seconds', () => {
    expect(beansFromDelta(0.1, 1000)).toBeCloseTo(0.1);
    expect(beansFromDelta(0.1, 10_000)).toBeCloseTo(1);
    expect(beansFromDelta(1, 500)).toBeCloseTo(0.5);
  });

  it('returns 0 for non-positive delta or rate', () => {
    expect(beansFromDelta(0.1, 0)).toBe(0);
    expect(beansFromDelta(0.1, -100)).toBe(0);
    expect(beansFromDelta(0, 1000)).toBe(0);
  });
});
