import { describe, expect, it } from 'vitest';
import {
  CONTRIBUTOR_SKINS,
  TALK_CONTRIBUTOR_NAMES,
  contributorAvatarSrc,
  contributorDisplayNames,
  resolveDevSkin,
  resolveDevSkinFromPool,
} from './contributors';

describe('resolveDevSkin', () => {
  it('assigns each opt-in skin at most once by desk index', () => {
    const first = resolveDevSkin(0);
    const second = resolveDevSkin(1);
    const third = resolveDevSkin(2);

    expect(first).toMatchObject({
      mode: 'contributor',
      label: CONTRIBUTOR_SKINS[0]!.displayName,
      avatarSrc: contributorAvatarSrc(CONTRIBUTOR_SKINS[0]!),
    });
    expect(second).toMatchObject({
      mode: 'contributor',
      label: CONTRIBUTOR_SKINS[1]!.displayName,
    });
    expect(third).toEqual({ mode: 'fallback', label: null });
  });

  it('never repeats a contributor id across visible desks', () => {
    const ids = Array.from({ length: 16 }, (_, i) => resolveDevSkin(i))
      .filter((skin) => skin.mode === 'contributor')
      .map((skin) => (skin.mode === 'contributor' ? skin.skin.id : null));
    expect(ids).toEqual(CONTRIBUTOR_SKINS.map((s) => s.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('returns fallback mode when the opt-in pool is empty', () => {
    expect(resolveDevSkinFromPool(0, [])).toEqual({
      mode: 'fallback',
      label: null,
    });
    expect(resolveDevSkinFromPool(5, [])).toEqual({
      mode: 'fallback',
      label: null,
    });
  });
});

describe('contributorDisplayNames / talk sync', () => {
  it('exposes every opt-in display name for talk bubbles', () => {
    expect(contributorDisplayNames()).toEqual(
      CONTRIBUTOR_SKINS.map((s) => s.displayName),
    );
    expect(TALK_CONTRIBUTOR_NAMES).toEqual([...contributorDisplayNames()]);
    expect(TALK_CONTRIBUTOR_NAMES).toContain('joaovictornsv');
    expect(TALK_CONTRIBUTOR_NAMES).toContain('dependabot');
  });
});

describe('contributorAvatarSrc', () => {
  it('builds a public static path under /contributors/avatars/', () => {
    expect(contributorAvatarSrc(CONTRIBUTOR_SKINS[0]!)).toBe(
      `/contributors/avatars/${CONTRIBUTOR_SKINS[0]!.avatarFile}`,
    );
  });
});
