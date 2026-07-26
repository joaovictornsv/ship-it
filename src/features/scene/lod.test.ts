import { describe, expect, it } from 'vitest';
import {
  lodBadgeCount,
  SCENE_SPRITE_CAP,
  SCENE_SPRITE_CAP_MOBILE,
  sceneSpriteCap,
  visibleDevCount,
} from './lod';
import { sceneStageForOwned, SCENE_STAGES } from './stages';

describe('sceneSpriteCap', () => {
  it('uses desktop budget at lg+', () => {
    expect(sceneSpriteCap(true)).toBe(SCENE_SPRITE_CAP);
  });

  it('uses leaner mobile budget below lg', () => {
    expect(sceneSpriteCap(false)).toBe(SCENE_SPRITE_CAP_MOBILE);
  });
});

describe('visibleDevCount', () => {
  it('is 0 when nothing owned', () => {
    expect(visibleDevCount(0)).toBe(0);
  });

  it('matches owned below the cap', () => {
    expect(visibleDevCount(1)).toBe(1);
    expect(visibleDevCount(10)).toBe(10);
    expect(visibleDevCount(SCENE_SPRITE_CAP)).toBe(SCENE_SPRITE_CAP);
  });

  it('caps at SCENE_SPRITE_CAP by default', () => {
    expect(visibleDevCount(SCENE_SPRITE_CAP + 1)).toBe(SCENE_SPRITE_CAP);
    expect(visibleDevCount(100)).toBe(SCENE_SPRITE_CAP);
  });

  it('respects an explicit mobile cap', () => {
    expect(visibleDevCount(20, SCENE_SPRITE_CAP_MOBILE)).toBe(
      SCENE_SPRITE_CAP_MOBILE,
    );
    expect(visibleDevCount(10, SCENE_SPRITE_CAP_MOBILE)).toBe(10);
  });

  it('rejects non-finite / negative as 0', () => {
    expect(visibleDevCount(-3)).toBe(0);
    expect(visibleDevCount(Number.NaN)).toBe(0);
  });
});

describe('lodBadgeCount', () => {
  it('is null at or below the cap', () => {
    expect(lodBadgeCount(0)).toBeNull();
    expect(lodBadgeCount(SCENE_SPRITE_CAP)).toBeNull();
  });

  it('returns total owned above the cap', () => {
    expect(lodBadgeCount(33)).toBe(33);
    expect(lodBadgeCount(100)).toBe(100);
  });

  it('badges earlier under the mobile cap', () => {
    expect(lodBadgeCount(16, SCENE_SPRITE_CAP_MOBILE)).toBeNull();
    expect(lodBadgeCount(17, SCENE_SPRITE_CAP_MOBILE)).toBe(17);
  });
});

describe('sceneStageForOwned', () => {
  it('maps milestone thresholds from SCENE_STAGES', () => {
    expect(sceneStageForOwned(0).name).toBe('empty');
    expect(sceneStageForOwned(1).name).toBe('solo');
    expect(sceneStageForOwned(9).name).toBe('solo');
    expect(sceneStageForOwned(10).name).toBe('small-team');
    expect(sceneStageForOwned(24).name).toBe('small-team');
    expect(sceneStageForOwned(25).name).toBe('open-plan');
    expect(sceneStageForOwned(49).name).toBe('open-plan');
    expect(sceneStageForOwned(50).name).toBe('crowded');
    expect(sceneStageForOwned(100).name).toBe('crowded');
  });

  it('keeps thresholds data-driven (0 / 1 / 10 / 25 / 50)', () => {
    expect(SCENE_STAGES.map((s) => s.minOwned)).toEqual([0, 1, 10, 25, 50]);
  });
});
