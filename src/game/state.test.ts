import { beforeEach, describe, expect, it } from 'vitest';
import { ESPRESSO_MACHINE, ESPRESSO_MACHINE_ID } from '../data/upgrades';
import { espressoMachineCost } from './economy';
import { initialGameState, useGameStore } from './state';

describe('useGameStore', () => {
  beforeEach(() => {
    useGameStore.setState({ ...initialGameState, owned: {} });
  });

  it('starts with an empty token bank and no upgrades', () => {
    const state = useGameStore.getState();
    expect(state.tokens).toBe(0);
    expect(state.owned).toEqual({});
  });

  it('shipIt adds clickPower tokens and returns the amount earned', () => {
    const first = useGameStore.getState().shipIt();
    expect(first).toBe(1);
    expect(useGameStore.getState().tokens).toBe(1);

    useGameStore.getState().shipIt();
    useGameStore.getState().shipIt();
    expect(useGameStore.getState().tokens).toBe(3);
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

  it('tick accrues tokens/s with an injectable clock', () => {
    useGameStore.setState({
      tokens: 0,
      owned: { [ESPRESSO_MACHINE_ID]: 1 },
      lastTickAt: 0,
    });
    const earned = useGameStore.getState().tick(10_000);
    expect(earned).toBeCloseTo(1);
    expect(useGameStore.getState().tokens).toBeCloseTo(1);
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
});
