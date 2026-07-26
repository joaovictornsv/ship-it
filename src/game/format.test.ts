import { describe, expect, it } from 'vitest';
import { formatTokensCompact } from './format';

describe('formatTokensCompact', () => {
  it('shows plain integers below 1K', () => {
    expect(formatTokensCompact(0)).toBe('0');
    expect(formatTokensCompact(1)).toBe('1');
    expect(formatTokensCompact(999)).toBe('999');
  });

  it('floors fractional values', () => {
    expect(formatTokensCompact(12.9)).toBe('12');
    expect(formatTokensCompact(1_500.7)).toBe('1.5K');
  });

  it('uses K / M / B without scientific notation', () => {
    expect(formatTokensCompact(1_000)).toBe('1K');
    expect(formatTokensCompact(1_500)).toBe('1.5K');
    expect(formatTokensCompact(12_000)).toBe('12K');
    expect(formatTokensCompact(999_999)).toBe('999K');
    expect(formatTokensCompact(1_000_000)).toBe('1M');
    expect(formatTokensCompact(2_500_000)).toBe('2.5M');
    expect(formatTokensCompact(1_000_000_000)).toBe('1B');
    expect(formatTokensCompact(3_140_000_000)).toBe('3.14B');
  });

  it('never emits scientific notation for large values', () => {
    expect(formatTokensCompact(1e12)).not.toMatch(/e/i);
    expect(formatTokensCompact(1e12)).toBe('1000B');
  });

  it('handles non-finite input as 0', () => {
    expect(formatTokensCompact(Number.NaN)).toBe('0');
    expect(formatTokensCompact(Number.POSITIVE_INFINITY)).toBe('0');
  });
});
