import { beforeEach, describe, expect, it } from 'vitest';
import { initialGameState, useGameStore } from './state';

describe('useGameStore', () => {
  beforeEach(() => {
    useGameStore.setState({ ...initialGameState });
  });

  it('starts with an empty bean bank', () => {
    expect(useGameStore.getState().beans).toBe(0);
  });

  it('shipIt adds clickPower beans and returns the amount earned', () => {
    const first = useGameStore.getState().shipIt();
    expect(first).toBe(1);
    expect(useGameStore.getState().beans).toBe(1);

    useGameStore.getState().shipIt();
    useGameStore.getState().shipIt();
    expect(useGameStore.getState().beans).toBe(3);
  });
});
