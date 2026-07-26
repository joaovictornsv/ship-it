import { create } from 'zustand';
import { clickPower } from './economy';
import type { Beans, GameState } from './types';

export const initialGameState: GameState = {
  beans: 0,
};

type GameActions = {
  /** Earn beans from a Ship It click; returns amount granted (for UI FX). */
  shipIt: () => Beans;
};

export type GameStore = GameState & GameActions;

export const useGameStore = create<GameStore>((set) => ({
  ...initialGameState,
  shipIt: () => {
    const earned = clickPower();
    set((state) => ({ beans: state.beans + earned }));
    return earned;
  },
}));
