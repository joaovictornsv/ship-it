import { describe, expect, it } from 'vitest';
import { applyShipUpgradeEffect, shipUpgradeEffectLabel } from './shipUpgrades';

describe('shipUpgradeEffectLabel', () => {
  it('labels flat and mult effects', () => {
    expect(shipUpgradeEffectLabel({ kind: 'flat', amount: 5 })).toBe(
      '+5 tokens per click',
    );
    expect(shipUpgradeEffectLabel({ kind: 'mult', factor: 2 })).toBe(
      '×2 click power',
    );
  });
});

describe('applyShipUpgradeEffect', () => {
  it('accumulates flats and mults', () => {
    const acc = { flat: 0, mult: 1 };
    applyShipUpgradeEffect(acc, { kind: 'flat', amount: 3 });
    applyShipUpgradeEffect(acc, { kind: 'mult', factor: 2 });
    expect(acc).toEqual({ flat: 3, mult: 2 });
  });
});
