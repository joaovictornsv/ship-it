import { describe, expect, it } from 'vitest';
import { createEnum, getEnumByName } from './createEnum';

describe('createEnum', () => {
  it('assigns name and insertion index to each entry', () => {
    const Sample = createEnum({
      ALPHA: { label: 'A' },
      BETA: { label: 'B' },
    });

    expect(Sample.ALPHA).toEqual({ name: 'ALPHA', index: 0, label: 'A' });
    expect(Sample.BETA).toEqual({ name: 'BETA', index: 1, label: 'B' });
  });

  it('merges defaultFields under entry-specific fields', () => {
    const Sample = createEnum(
      {
        ONE: { label: 'one', flag: true },
        TWO: { label: 'two' },
      },
      { defaultFields: { flag: false, unit: 'x' } },
    );

    expect(Sample.ONE.flag).toBe(true);
    expect(Sample.TWO.flag).toBe(false);
    expect(Sample.ONE.unit).toBe('x');
  });

  it('preserves methods on entries for call-site resolution', () => {
    const Origins = createEnum({
      MESSAGE: {
        getTitle: (ctx: { body: string }) => `Msg: ${ctx.body}`,
      },
      POST: {
        getTitle: (ctx: { body: string }) => `Post: ${ctx.body}`,
      },
    });

    const stored = Origins.POST.name;
    expect(Origins[stored].getTitle({ body: 'hi' })).toBe('Post: hi');
  });
});

describe('getEnumByName', () => {
  const Sample = createEnum({
    FOO: { n: 1 },
    BAR: { n: 2 },
  });

  it('returns the entry for a known name', () => {
    expect(getEnumByName(Sample, 'FOO')?.n).toBe(1);
    expect(getEnumByName(Sample, Sample.BAR.name)?.n).toBe(2);
  });

  it('returns null for missing or empty names', () => {
    expect(getEnumByName(Sample, 'NOPE')).toBeNull();
    expect(getEnumByName(Sample, '')).toBeNull();
    expect(getEnumByName(Sample, null)).toBeNull();
    expect(getEnumByName(Sample, undefined)).toBeNull();
  });
});
