import { describe, expect, it } from 'vitest';
import { DOUBLE_SHOT_ID } from '../../data/buildingUpgrades';
import { ESPRESSO_MACHINE_ID } from '../../data/upgrades';
import { RUBBER_DUCK_ID } from '../../data/shipUpgrades';
import { nextUpgradeCostForN, shipUpgradeCost } from '../../game/economy';
import {
  canAffordBuildingPurchase,
  hasAffordableShopPurchase,
} from './shopAffordability';

describe('canAffordBuildingPurchase', () => {
  it('matches ×1 affordability', () => {
    const cost = nextUpgradeCostForN(ESPRESSO_MACHINE_ID, 0, 1);
    expect(canAffordBuildingPurchase(ESPRESSO_MACHINE_ID, 0, cost, 'x1')).toBe(
      true,
    );
    expect(
      canAffordBuildingPurchase(ESPRESSO_MACHINE_ID, 0, cost - 1, 'x1'),
    ).toBe(false);
  });

  it('requires the full ×10 sum when in ×10 mode', () => {
    const cost10 = nextUpgradeCostForN(ESPRESSO_MACHINE_ID, 0, 10);
    expect(
      canAffordBuildingPurchase(ESPRESSO_MACHINE_ID, 0, cost10, 'x10'),
    ).toBe(true);
    expect(
      canAffordBuildingPurchase(ESPRESSO_MACHINE_ID, 0, cost10 - 1, 'x10'),
    ).toBe(false);
  });

  it('Max is affordable only when at least one unit fits', () => {
    const cost = nextUpgradeCostForN(ESPRESSO_MACHINE_ID, 0, 1);
    expect(canAffordBuildingPurchase(ESPRESSO_MACHINE_ID, 0, cost, 'max')).toBe(
      true,
    );
    expect(
      canAffordBuildingPurchase(ESPRESSO_MACHINE_ID, 0, cost - 1, 'max'),
    ).toBe(false);
  });
});

describe('hasAffordableShopPurchase', () => {
  it('is false with an empty bank and no catalog buys', () => {
    expect(
      hasAffordableShopPurchase({
        tokens: 0,
        owned: {},
        shipOwned: {},
        buildingOwned: {},
        themesOwned: { default: true },
        buyMode: 'x1',
      }),
    ).toBe(false);
  });

  it('detects an affordable building', () => {
    const cost = nextUpgradeCostForN(ESPRESSO_MACHINE_ID, 0, 1);
    expect(
      hasAffordableShopPurchase({
        tokens: cost,
        owned: {},
        shipOwned: {},
        buildingOwned: {},
        themesOwned: { default: true },
        buyMode: 'x1',
      }),
    ).toBe(true);
  });

  it('respects bulk mode for buildings (×10 unaffordable while ×1 is)', () => {
    const cost1 = nextUpgradeCostForN(ESPRESSO_MACHINE_ID, 0, 1);
    const cost10 = nextUpgradeCostForN(ESPRESSO_MACHINE_ID, 0, 10);
    expect(cost1).toBeLessThan(cost10);
    expect(
      hasAffordableShopPurchase({
        tokens: cost1,
        owned: {},
        shipOwned: {},
        buildingOwned: {},
        themesOwned: { default: true },
        buyMode: 'x10',
      }),
    ).toBe(false);
    expect(
      hasAffordableShopPurchase({
        tokens: cost1,
        owned: {},
        shipOwned: {},
        buildingOwned: {},
        themesOwned: { default: true },
        buyMode: 'x1',
      }),
    ).toBe(true);
  });

  it('detects an affordable Ship upgrade in the visible queue', () => {
    const cost = shipUpgradeCost(RUBBER_DUCK_ID);
    expect(
      hasAffordableShopPurchase({
        tokens: cost,
        owned: { [ESPRESSO_MACHINE_ID]: 1 },
        shipOwned: {},
        buildingOwned: {},
        themesOwned: { default: true },
        // ×100 so buildings stay unaffordable on this bank
        buyMode: 'x100',
      }),
    ).toBe(true);
  });

  it('detects an affordable building upgrade in the visible queue', () => {
    // Double Shot unlocks at Espresso ×1 (cost 500). Own Rubber duck so the
    // next Ship step (750) stays above this bank; ×100 keeps buildings out.
    expect(
      hasAffordableShopPurchase({
        tokens: 500,
        owned: { [ESPRESSO_MACHINE_ID]: 1 },
        shipOwned: { [RUBBER_DUCK_ID]: true },
        buildingOwned: {},
        themesOwned: { default: true },
        buyMode: 'x100',
      }),
    ).toBe(true);
    expect(
      hasAffordableShopPurchase({
        tokens: 500,
        owned: { [ESPRESSO_MACHINE_ID]: 1 },
        shipOwned: { [RUBBER_DUCK_ID]: true },
        buildingOwned: { [DOUBLE_SHOT_ID]: true },
        themesOwned: {
          default: true,
          'night-shift': true,
          hackathon: true,
        },
        buyMode: 'x100',
      }),
    ).toBe(false);
  });

  it('detects an affordable office theme when buildings stay out of reach', () => {
    expect(
      hasAffordableShopPurchase({
        tokens: 500,
        owned: {},
        shipOwned: {},
        buildingOwned: {},
        themesOwned: { default: true },
        buyMode: 'x100',
      }),
    ).toBe(true);
    expect(
      hasAffordableShopPurchase({
        tokens: 500,
        owned: {},
        shipOwned: {},
        buildingOwned: {},
        themesOwned: {
          default: true,
          'night-shift': true,
          hackathon: true,
        },
        buyMode: 'x100',
      }),
    ).toBe(false);
  });
});
