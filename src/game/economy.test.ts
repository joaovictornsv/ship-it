import { describe, expect, it } from 'vitest';
import { clickPowerPlaceholder } from './economy';

describe('economy scaffold', () => {
  it('exposes a placeholder click power of 1', () => {
    expect(clickPowerPlaceholder()).toBe(1);
  });
});
