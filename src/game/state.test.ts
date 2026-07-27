import { beforeEach, describe, expect, it } from 'vitest';
import {
  MUSCLE_MEMORY_ID,
  POSTMORTEM_ID,
  STUB_REPO_ID,
} from '../data/prestigeUpgrades';
import { RUBBER_DUCK, RUBBER_DUCK_ID } from '../data/shipUpgrades';
import { ESPRESSO_MACHINE, ESPRESSO_MACHINE_ID } from '../data/upgrades';
import { espressoMachineCost, REWRITE_K } from './economy';
import { initialGameState, useGameStore } from './state';

describe('useGameStore', () => {
  beforeEach(() => {
    useGameStore.setState({
      ...initialGameState,
      owned: {},
      shipOwned: {},
      prestigeOwned: {},
      tokensEarnedThisRun: 0,
      rewrites: 0,
      lifetimeTokensEarned: 0,
      lifetimeClicks: 0,
      lifetimePurchases: 0,
      achievementsUnlocked: {},
      achievementToastQueue: [],
      saveUntrusted: false,
    });
  });

  it('starts with an empty token bank and no upgrades', () => {
    const state = useGameStore.getState();
    expect(state.tokens).toBe(0);
    expect(state.owned).toEqual({});
    expect(state.shipOwned).toEqual({});
    expect(state.tokensEarnedThisRun).toBe(0);
    expect(state.rewrites).toBe(0);
    expect(state.prestigeOwned).toEqual({});
    expect(state.lifetimeTokensEarned).toBe(0);
    expect(state.lifetimeClicks).toBe(0);
    expect(state.lifetimePurchases).toBe(0);
    expect(state.achievementsUnlocked).toEqual({});
  });

  it('shipIt adds clickPower tokens and returns the amount earned', () => {
    const first = useGameStore.getState().shipIt();
    expect(first).toBe(1);
    expect(useGameStore.getState().tokens).toBe(1);
    expect(useGameStore.getState().tokensEarnedThisRun).toBe(1);
    expect(useGameStore.getState().lifetimeTokensEarned).toBe(1);
    expect(useGameStore.getState().lifetimeClicks).toBe(1);
    expect(useGameStore.getState().achievementsUnlocked['first-ship']).toBe(
      true,
    );
    expect(useGameStore.getState().achievementToastQueue).toContain(
      'first-ship',
    );

    useGameStore.getState().shipIt();
    useGameStore.getState().shipIt();
    expect(useGameStore.getState().tokens).toBe(3);
    expect(useGameStore.getState().tokensEarnedThisRun).toBe(3);
    expect(useGameStore.getState().lifetimeClicks).toBe(3);
  });

  it('shipIt scales with owned Ship upgrades', () => {
    useGameStore.setState({
      tokens: 0,
      owned: { [ESPRESSO_MACHINE_ID]: 1 },
      shipOwned: { [RUBBER_DUCK_ID]: true },
    });
    expect(useGameStore.getState().shipIt()).toBe(2);
    expect(useGameStore.getState().tokens).toBe(2);
  });

  it('shipIt scales with Muscle memory; spending does not reduce earn tracking', () => {
    useGameStore.setState({
      tokens: 0,
      prestigeOwned: { [MUSCLE_MEMORY_ID]: 1 },
    });
    expect(useGameStore.getState().shipIt()).toBeCloseTo(1.1);
    const earned = useGameStore.getState().tokensEarnedThisRun;
    useGameStore.setState({ tokens: 100 });
    expect(useGameStore.getState().buyUpgrade(ESPRESSO_MACHINE_ID)).toBe(true);
    expect(useGameStore.getState().tokensEarnedThisRun).toBeCloseTo(earned);
  });

  it('buyUpgrade spends tokens and increments owned Espresso machines', () => {
    useGameStore.setState({ tokens: 100 });
    const ok = useGameStore.getState().buyUpgrade(ESPRESSO_MACHINE_ID);
    expect(ok).toBe(true);
    expect(useGameStore.getState().tokens).toBe(
      100 - ESPRESSO_MACHINE.baseCost,
    );
    expect(useGameStore.getState().owned[ESPRESSO_MACHINE_ID]).toBe(1);

    const secondCost = espressoMachineCost(1);
    const ok2 = useGameStore.getState().buyUpgrade(ESPRESSO_MACHINE_ID);
    expect(ok2).toBe(true);
    expect(useGameStore.getState().owned[ESPRESSO_MACHINE_ID]).toBe(2);
    expect(useGameStore.getState().tokens).toBe(
      100 - ESPRESSO_MACHINE.baseCost - secondCost,
    );
  });

  it('buyUpgrade fails when the player cannot afford the cost', () => {
    useGameStore.setState({ tokens: 5 });
    expect(useGameStore.getState().buyUpgrade(ESPRESSO_MACHINE_ID)).toBe(false);
    expect(useGameStore.getState().owned[ESPRESSO_MACHINE_ID]).toBeUndefined();
    expect(useGameStore.getState().tokens).toBe(5);
  });

  it('buyUpgrade buys quantity units for the rising-cost sum', () => {
    const quantity = 5;
    const cost = espressoMachineCost(0);
    let total = 0;
    for (let i = 0; i < quantity; i++) {
      total += espressoMachineCost(i);
    }
    useGameStore.setState({ tokens: total });
    expect(
      useGameStore.getState().buyUpgrade(ESPRESSO_MACHINE_ID, quantity),
    ).toBe(true);
    expect(useGameStore.getState().owned[ESPRESSO_MACHINE_ID]).toBe(quantity);
    expect(useGameStore.getState().tokens).toBe(0);

    useGameStore.setState({ tokens: total - 1, owned: {} });
    expect(
      useGameStore.getState().buyUpgrade(ESPRESSO_MACHINE_ID, quantity),
    ).toBe(false);
    expect(useGameStore.getState().owned[ESPRESSO_MACHINE_ID]).toBeUndefined();

    useGameStore.setState({ tokens: 1_000, owned: {} });
    expect(useGameStore.getState().buyUpgrade(ESPRESSO_MACHINE_ID, 0)).toBe(
      false,
    );
    expect(useGameStore.getState().buyUpgrade(ESPRESSO_MACHINE_ID, 1.5)).toBe(
      false,
    );
    expect(useGameStore.getState().tokens).toBe(1_000);
    expect(useGameStore.getState().buyUpgrade(ESPRESSO_MACHINE_ID)).toBe(true);
    expect(useGameStore.getState().owned[ESPRESSO_MACHINE_ID]).toBe(1);
    expect(useGameStore.getState().tokens).toBe(1_000 - cost);
  });

  it('buyShipUpgrade requires a producer and ladder order', () => {
    useGameStore.setState({ tokens: 1_000 });
    expect(useGameStore.getState().buyShipUpgrade(RUBBER_DUCK_ID)).toBe(false);

    useGameStore.setState({
      tokens: 1_000,
      owned: { [ESPRESSO_MACHINE_ID]: 1 },
    });
    expect(useGameStore.getState().buyShipUpgrade(RUBBER_DUCK_ID)).toBe(true);
    expect(useGameStore.getState().shipOwned[RUBBER_DUCK_ID]).toBe(true);
    expect(useGameStore.getState().tokens).toBe(1_000 - RUBBER_DUCK.cost);

    expect(useGameStore.getState().buyShipUpgrade(RUBBER_DUCK_ID)).toBe(false);
  });

  it('buyPrestigeUpgrade spends Rewrites never tokens', () => {
    useGameStore.setState({ tokens: 50, rewrites: 3 });
    expect(useGameStore.getState().buyPrestigeUpgrade(POSTMORTEM_ID)).toBe(
      true,
    );
    expect(useGameStore.getState().tokens).toBe(50);
    expect(useGameStore.getState().rewrites).toBe(2);
    expect(useGameStore.getState().prestigeOwned[POSTMORTEM_ID]).toBe(1);

    expect(useGameStore.getState().buyPrestigeUpgrade(STUB_REPO_ID)).toBe(true);
    expect(useGameStore.getState().rewrites).toBe(0);
    expect(useGameStore.getState().prestigeOwned[STUB_REPO_ID]).toBe(1);
    expect(useGameStore.getState().buyPrestigeUpgrade(STUB_REPO_ID)).toBe(
      false,
    );
  });

  it('tick accrues tokens/s with an injectable clock and tracks earn', () => {
    useGameStore.setState({
      tokens: 0,
      owned: { [ESPRESSO_MACHINE_ID]: 1 },
      lastTickAt: 0,
    });
    const earned = useGameStore.getState().tick(10_000);
    expect(earned).toBeCloseTo(1);
    expect(useGameStore.getState().tokens).toBeCloseTo(1);
    expect(useGameStore.getState().tokensEarnedThisRun).toBeCloseTo(1);
    expect(useGameStore.getState().lastTickAt).toBe(10_000);
  });

  it('resumeFromHidden advances lastTickAt without granting offline tokens', () => {
    useGameStore.setState({
      tokens: 2,
      owned: { [ESPRESSO_MACHINE_ID]: 5 },
      lastTickAt: 1_000,
    });
    useGameStore.getState().resumeFromHidden(60_000);
    expect(useGameStore.getState().tokens).toBe(2);
    expect(useGameStore.getState().lastTickAt).toBe(60_000);
  });

  it('rewrite soft-resets run economy and banks Rewrites', () => {
    useGameStore.setState({
      tokens: 500,
      owned: { [ESPRESSO_MACHINE_ID]: 4 },
      shipOwned: { [RUBBER_DUCK_ID]: true },
      tokensEarnedThisRun: REWRITE_K,
      rewrites: 1,
      prestigeOwned: { [POSTMORTEM_ID]: 1, [STUB_REPO_ID]: 1 },
      lifetimeTokensEarned: 50_000,
      lifetimeClicks: 40,
      lifetimePurchases: 12,
      achievementsUnlocked: { 'espresso-drip': true, 'first-ship': true },
      lastTickAt: 99,
    });
    expect(useGameStore.getState().rewrite()).toBe(1);
    const state = useGameStore.getState();
    expect(state.tokens).toBe(0);
    expect(state.owned).toEqual({ [ESPRESSO_MACHINE_ID]: 1 });
    expect(state.shipOwned).toEqual({});
    expect(state.tokensEarnedThisRun).toBe(0);
    expect(state.rewrites).toBe(2);
    expect(state.prestigeOwned).toEqual({
      [POSTMORTEM_ID]: 1,
      [STUB_REPO_ID]: 1,
    });
    expect(state.lifetimeTokensEarned).toBe(50_000);
    expect(state.lifetimeClicks).toBe(40);
    expect(state.lifetimePurchases).toBe(12);
    expect(state.achievementsUnlocked['espresso-drip']).toBe(true);
    expect(state.achievementsUnlocked['first-ship']).toBe(true);
    expect(state.achievementsUnlocked['rewrite-ready']).toBe(true);
  });

  it('rewrite refuses when projected gain is below 1', () => {
    useGameStore.setState({
      tokens: 10,
      tokensEarnedThisRun: REWRITE_K - 1,
      rewrites: 0,
    });
    expect(useGameStore.getState().rewrite()).toBe(0);
    expect(useGameStore.getState().tokens).toBe(10);
  });

  it('buyUpgrade unlocks owned + purchase achievements and queues toasts', () => {
    useGameStore.setState({ tokens: 100 });
    expect(useGameStore.getState().buyUpgrade(ESPRESSO_MACHINE_ID)).toBe(true);
    const state = useGameStore.getState();
    expect(state.lifetimePurchases).toBe(1);
    expect(state.achievementsUnlocked['espresso-drip']).toBe(true);
    expect(state.achievementsUnlocked['window-shopper']).toBe(true);
    expect(state.achievementToastQueue.length).toBeGreaterThan(0);
    state.dismissAchievementToast();
    expect(useGameStore.getState().achievementToastQueue.length).toBe(
      state.achievementToastQueue.length - 1,
    );
  });

  it('hydrateFromSave restores bank/owned/shipOwned/prestige and marks untrusted when asked', () => {
    useGameStore.getState().hydrateFromSave(
      {
        tokens: 50,
        owned: { [ESPRESSO_MACHINE_ID]: 3 },
        shipOwned: { [RUBBER_DUCK_ID]: true },
        tokensEarnedThisRun: 80,
        rewrites: 4,
        prestigeOwned: { [MUSCLE_MEMORY_ID]: 2 },
        lifetimeTokensEarned: 200,
        lifetimeClicks: 5,
        lifetimePurchases: 3,
        achievementsUnlocked: { 'first-ship': true },
        lastTickAt: 1,
      },
      { untrusted: true, nowMs: 9_000 },
    );
    const state = useGameStore.getState();
    expect(state.tokens).toBe(50);
    expect(state.owned[ESPRESSO_MACHINE_ID]).toBe(3);
    expect(state.shipOwned[RUBBER_DUCK_ID]).toBe(true);
    expect(state.tokensEarnedThisRun).toBe(80);
    expect(state.rewrites).toBe(4);
    expect(state.prestigeOwned[MUSCLE_MEMORY_ID]).toBe(2);
    expect(state.lifetimeTokensEarned).toBe(200);
    expect(state.lifetimeClicks).toBe(5);
    expect(state.lifetimePurchases).toBe(3);
    expect(state.achievementsUnlocked['first-ship']).toBe(true);
    expect(state.achievementsUnlocked['espresso-drip']).toBe(true);
    expect(state.achievementsUnlocked['pocket-change']).toBe(true);
    expect(state.achievementsUnlocked['rewrite-ready']).toBe(true);
    expect(state.achievementToastQueue).toEqual([]);
    expect(state.lastTickAt).toBe(9_000);
    expect(state.saveUntrusted).toBe(true);
    state.dismissSaveWarning();
    expect(useGameStore.getState().saveUntrusted).toBe(false);
  });
});
