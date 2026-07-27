import { describe, expect, it } from 'vitest';
import {
  CONTRIBUTOR_SKINS,
  FAKE_DEV_NAMES,
  TALK_CONTRIBUTOR_NAMES,
  contributorAvatarSrc,
  contributorDisplayNames,
  fakeDevNameForIndex,
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
      label: CONTRIBUTOR_SKINS[0]!.id,
      avatarSrc: contributorAvatarSrc(CONTRIBUTOR_SKINS[0]!),
    });
    expect(second).toMatchObject({
      mode: 'contributor',
      label: CONTRIBUTOR_SKINS[1]!.id,
    });
    expect(third).toEqual({
      mode: 'fallback',
      label: fakeDevNameForIndex(2),
    });
  });

  it('never repeats a contributor id across visible desks', () => {
    const ids = Array.from({ length: 16 }, (_, i) => resolveDevSkin(i))
      .filter((skin) => skin.mode === 'contributor')
      .map((skin) => (skin.mode === 'contributor' ? skin.skin.id : null));
    expect(ids).toEqual(CONTRIBUTOR_SKINS.map((s) => s.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('returns fallback mode with a fake name when the opt-in pool is empty', () => {
    expect(resolveDevSkinFromPool(0, [])).toEqual({
      mode: 'fallback',
      label: fakeDevNameForIndex(0),
    });
    expect(resolveDevSkinFromPool(5, [])).toEqual({
      mode: 'fallback',
      label: fakeDevNameForIndex(5),
    });
  });

  it('labels contributors with GitHub username (no profile link)', () => {
    const human = CONTRIBUTOR_SKINS.find((s) => s.kind === 'human')!;
    const bot = CONTRIBUTOR_SKINS.find((s) => s.kind === 'bot')!;
    const humanIndex = CONTRIBUTOR_SKINS.indexOf(human);
    const botIndex = CONTRIBUTOR_SKINS.indexOf(bot);

    const humanSkin = resolveDevSkinFromPool(humanIndex, CONTRIBUTOR_SKINS);
    const botSkin = resolveDevSkinFromPool(botIndex, CONTRIBUTOR_SKINS);

    expect(humanSkin).toMatchObject({
      mode: 'contributor',
      label: human.id,
    });
    expect(botSkin).toMatchObject({
      mode: 'contributor',
      label: bot.id,
    });
    expect(humanSkin).not.toHaveProperty('profileUrl');
    expect(botSkin).not.toHaveProperty('profileUrl');
  });
});

describe('fakeDevNameForIndex', () => {
  it('returns a stable name for the same desk index', () => {
    expect(fakeDevNameForIndex(3)).toBe(fakeDevNameForIndex(3));
    expect(fakeDevNameForIndex(3)).toBe(FAKE_DEV_NAMES[3]);
  });

  it('wraps past the pool length', () => {
    expect(fakeDevNameForIndex(FAKE_DEV_NAMES.length)).toBe(FAKE_DEV_NAMES[0]);
  });

  it('covers the desktop LOD cap without exhausting uniqueness early', () => {
    expect(FAKE_DEV_NAMES.length).toBeGreaterThanOrEqual(32);
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
