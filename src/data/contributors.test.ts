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
  it('cycles opt-in contributor skins by desk index', () => {
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
    expect(third).toMatchObject({
      mode: 'contributor',
      label: CONTRIBUTOR_SKINS[0]!.displayName,
    });
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
