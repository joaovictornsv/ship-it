import { describe, expect, it } from 'vitest';
import {
  applyBuildingUpgradeEffect,
  buildingUpgradeEffectLabel,
} from './buildingUpgrades';
import { ESPRESSO_MACHINE_ID } from './upgrades';

describe('buildingUpgradeEffectLabel', () => {
  it('names the target building and mult', () => {
    expect(
      buildingUpgradeEffectLabel(
        { kind: 'mult', factor: 2 },
        ESPRESSO_MACHINE_ID,
      ),
    ).toBe('×2 Espresso machine tokens/s');
  });
});

describe('applyBuildingUpgradeEffect', () => {
  it('multiplies the accumulator', () => {
    const acc = { mult: 1 };
    applyBuildingUpgradeEffect(acc, { kind: 'mult', factor: 2 });
    applyBuildingUpgradeEffect(acc, { kind: 'mult', factor: 3 });
    expect(acc.mult).toBe(6);
  });
});
