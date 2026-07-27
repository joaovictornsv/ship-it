import { describe, expect, it } from 'vitest';
import { appViewHash, parseAppView } from './appView';

describe('parseAppView', () => {
  it('maps save hashes to save', () => {
    expect(parseAppView('#/save')).toBe('save');
    expect(parseAppView('#save')).toBe('save');
    expect(parseAppView('/save')).toBe('save');
  });

  it('maps achievements hashes to achievements', () => {
    expect(parseAppView('#/achievements')).toBe('achievements');
    expect(parseAppView('#achievements')).toBe('achievements');
  });

  it('maps credits hashes to credits', () => {
    expect(parseAppView('#/credits')).toBe('credits');
    expect(parseAppView('#credits')).toBe('credits');
  });

  it('falls back to play for empty or unknown hashes', () => {
    expect(parseAppView('')).toBe('play');
    expect(parseAppView('#/')).toBe('play');
    expect(parseAppView('#')).toBe('play');
    expect(parseAppView('#/shop')).toBe('play');
  });
});

describe('appViewHash', () => {
  it('returns canonical hashes', () => {
    expect(appViewHash('play')).toBe('#/');
    expect(appViewHash('save')).toBe('#/save');
    expect(appViewHash('achievements')).toBe('#/achievements');
    expect(appViewHash('credits')).toBe('#/credits');
  });
});
