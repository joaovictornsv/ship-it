import { describe, expect, it } from 'vitest';
import { lodBadgeCount, SCENE_SPRITE_CAP, visibleDevCount } from './lod';
import { sceneStageForOwned, SCENE_STAGES } from './stages';

describe('visibleDevCount', () => {
  it('is 0 when nothing owned', () => {
    expect(visibleDevCount(0)).toBe(0);
  });

  it('matches owned below the cap', () => {
    expect(visibleDevCount(1)).toBe(1);
    expect(visibleDevCount(10)).toBe(10);
    expect(visibleDevCount(SCENE_SPRITE_CAP)).toBe(SCENE_SPRITE_CAP);
  });

  it('caps at SCENE_SPRITE_CAP', () => {
    expect(visibleDevCount(SCENE_SPRITE_CAP + 1)).toBe(SCENE_SPRITE_CAP);
    expect(visibleDevCount(100)).toBe(SCENE_SPRITE_CAP);
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
});

describe('sceneStageForOwned', () => {
  it('maps milestone thresholds from SCENE_STAGES', () => {
    expect(sceneStageForOwned(0).id).toBe('empty');
    expect(sceneStageForOwned(1).id).toBe('solo');
    expect(sceneStageForOwned(9).id).toBe('solo');
    expect(sceneStageForOwned(10).id).toBe('small-team');
    expect(sceneStageForOwned(24).id).toBe('small-team');
    expect(sceneStageForOwned(25).id).toBe('open-plan');
    expect(sceneStageForOwned(49).id).toBe('open-plan');
    expect(sceneStageForOwned(50).id).toBe('crowded');
    expect(sceneStageForOwned(100).id).toBe('crowded');
  });

  it('keeps thresholds data-driven (0 / 1 / 10 / 25 / 50)', () => {
    expect(SCENE_STAGES.map((s) => s.minOwned)).toEqual([0, 1, 10, 25, 50]);
  });
});
