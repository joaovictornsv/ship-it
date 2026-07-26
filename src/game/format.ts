/**
 * Compact token amounts for main UI: plain integers below 1K, then K / M / B.
 * Never uses scientific notation. Truncates (does not round up into the next tier).
 */
export function formatTokensCompact(value: number): string {
  if (!Number.isFinite(value)) {
    return '0';
  }

  const sign = value < 0 ? '-' : '';
  const n = Math.floor(Math.abs(value));

  if (n < 1_000) {
    return `${sign}${n}`;
  }

  const tiers: { threshold: number; suffix: string }[] = [
    { threshold: 1_000_000_000, suffix: 'B' },
    { threshold: 1_000_000, suffix: 'M' },
    { threshold: 1_000, suffix: 'K' },
  ];

  for (const { threshold, suffix } of tiers) {
    if (n >= threshold) {
      const scaled = n / threshold;
      const digits = scaled >= 100 ? 0 : scaled >= 10 ? 1 : 2;
      const factor = 10 ** digits;
      const truncated = Math.floor(scaled * factor) / factor;
      const trimmed = truncated
        .toFixed(digits)
        .replace(/(\.\d*?[1-9])0+$/, '$1')
        .replace(/\.0+$/, '');
      return `${sign}${trimmed}${suffix}`;
    }
  }

  return `${sign}${n}`;
}
