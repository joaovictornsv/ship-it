import { describe, expect, it } from 'vitest';
import { clickPower } from './economy';

describe('clickPower', () => {
  it('returns base click power of 1 bean', () => {
    expect(clickPower()).toBe(1);
  });
});
