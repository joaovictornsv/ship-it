import { describe, expect, it } from 'vitest';
import {
  DARK_MODE_ID,
  LGTM_STAMP_ID,
  MECHANICAL_KEYBOARD_ID,
  RUBBER_DUCK_ID,
  STACK_OVERFLOW_TAB_ID,
} from '../data/shipUpgrades';
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
  hasShipUpgrade,
  highestShipUpgrade,
  nextShipUpgradeId,
  shipUpgradesUnlocked,
  tokensFromDelta,
  tokensPerSecond,
  upgradeCost,
} from './economy';

describe('clickPower', () => {
  it('returns base click power of 1 token with no Ship upgrades', () => {
    expect(clickPower()).toBe(1);
    expect(clickPower({})).toBe(1);
  });

  it('adds flat Ship upgrades before multiplying', () => {
    expect(clickPower({ [RUBBER_DUCK_ID]: true })).toBe(2);
    expect(
      clickPower({
        [RUBBER_DUCK_ID]: true,
        [MECHANICAL_KEYBOARD_ID]: true,
      }),
    ).toBe(4);
    expect(
      clickPower({
        [RUBBER_DUCK_ID]: true,
        [MECHANICAL_KEYBOARD_ID]: true,
        [STACK_OVERFLOW_TAB_ID]: true,
      }),
    ).toBe(9);
  });

  it('applies mult Ship upgrades after flats', () => {
    expect(
      clickPower({
        [RUBBER_DUCK_ID]: true,
        [MECHANICAL_KEYBOARD_ID]: true,
        [STACK_OVERFLOW_TAB_ID]: true,
        [DARK_MODE_ID]: true,
      }),
    ).toBe(18);
    expect(
      clickPower({
        [RUBBER_DUCK_ID]: true,
        [MECHANICAL_KEYBOARD_ID]: true,
        [STACK_OVERFLOW_TAB_ID]: true,
        [DARK_MODE_ID]: true,
        [LGTM_STAMP_ID]: true,
      }),
    ).toBe(36);
  });
});

describe('ship upgrade ladder helpers', () => {
  it('unlocks after the first producer is owned', () => {
    expect(shipUpgradesUnlocked({})).toBe(false);
    expect(shipUpgradesUnlocked({ [ESPRESSO_MACHINE_ID]: 1 })).toBe(true);
  });

  it('walks the one-shot ladder in catalog order', () => {
    expect(nextShipUpgradeId({})).toBe(RUBBER_DUCK_ID);
    expect(nextShipUpgradeId({ [RUBBER_DUCK_ID]: true })).toBe(
      MECHANICAL_KEYBOARD_ID,
    );
    expect(
      nextShipUpgradeId({
        [RUBBER_DUCK_ID]: true,
        [MECHANICAL_KEYBOARD_ID]: true,
        [STACK_OVERFLOW_TAB_ID]: true,
        [DARK_MODE_ID]: true,
        [LGTM_STAMP_ID]: true,
      }),
    ).toBeNull();
  });

  it('reports the highest owned Ship upgrade for CTA evolution', () => {
    expect(highestShipUpgrade({})).toBeNull();
    expect(
      highestShipUpgrade({
        [RUBBER_DUCK_ID]: true,
        [MECHANICAL_KEYBOARD_ID]: true,
      })?.id,
    ).toBe(MECHANICAL_KEYBOARD_ID);
    expect(hasShipUpgrade({ [RUBBER_DUCK_ID]: true }, RUBBER_DUCK_ID)).toBe(
      true,
    );
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

  it('never gains click side-effects from producers', () => {
    // Espresso / buildings only affect tokens/s — clickPower stays base without shipOwned.
    expect(tokensPerSecond({ [ESPRESSO_MACHINE_ID]: 10 })).toBeCloseTo(1);
    expect(clickPower({})).toBe(1);
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
