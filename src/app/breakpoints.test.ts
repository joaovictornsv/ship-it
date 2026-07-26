import { describe, expect, it } from 'vitest';
import { DESKTOP_MEDIA_QUERY, DESKTOP_MIN_WIDTH_PX } from './breakpoints';

describe('breakpoints', () => {
  it('matches Tailwind lg (1024px)', () => {
    expect(DESKTOP_MIN_WIDTH_PX).toBe(1024);
    expect(DESKTOP_MEDIA_QUERY).toBe('(min-width: 1024px)');
  });
});
