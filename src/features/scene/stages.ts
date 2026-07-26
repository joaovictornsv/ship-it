/**
 * Discrete office stages keyed off Dev owned count.
 * Crossing a threshold shifts layout / props / density — not only +1 sprite.
 *
 * Per-stage fields (label, empty desks, …) live on the enum entry so callers
 * do not keep parallel `Record<SceneStageId, …>` maps.
 */

import { createEnum } from '../../lib/createEnum';

export const SceneStages = createEnum({
  empty: {
    /** Inclusive minimum Dev owned count for this stage. */
    minOwned: 0,
    /** Short English label for docs / a11y. */
    label: 'Empty office',
    /** Empty desk chips when no Devs are rendered. */
    emptyDesks: 4,
  },
  solo: {
    minOwned: 1,
    label: 'Solo hacker',
    emptyDesks: 2,
  },
  'small-team': {
    minOwned: 10,
    label: 'Small team',
    emptyDesks: 6,
  },
  'open-plan': {
    minOwned: 25,
    label: 'Open-plan densification',
    emptyDesks: 10,
  },
  crowded: {
    minOwned: 50,
    label: 'Crowded office',
    emptyDesks: 12,
  },
});

export type SceneStageId = keyof typeof SceneStages;

export type SceneStage = (typeof SceneStages)[SceneStageId];

/**
 * Ordered ascending by `minOwned` (insertion order). Highest matching
 * threshold wins. Thresholds: 0 / 1 / 10 / 25 / 50+ (see `docs/modules/scene.md`).
 */
export const SCENE_STAGES: readonly SceneStage[] = Object.values(
  SceneStages,
).sort((a, b) => a.index - b.index);

/** Resolve the active scene stage from Dev owned count. */
export function sceneStageForOwned(devOwned: number): SceneStage {
  const owned = Number.isFinite(devOwned)
    ? Math.max(0, Math.floor(devOwned))
    : 0;
  let stage: SceneStage = SceneStages.empty;
  for (const candidate of SCENE_STAGES) {
    if (owned >= candidate.minOwned) {
      stage = candidate;
    }
  }
  return stage;
}
