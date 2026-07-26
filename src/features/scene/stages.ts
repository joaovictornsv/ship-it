/**
 * Discrete office stages keyed off Dev owned count.
 * Crossing a threshold shifts layout / props / density — not only +1 sprite.
 */

export type SceneStageId =
  'empty' | 'solo' | 'small-team' | 'open-plan' | 'crowded';

export type SceneStage = {
  id: SceneStageId;
  /** Inclusive minimum Dev owned count for this stage. */
  minOwned: number;
  /** Short English label for docs / a11y. */
  label: string;
};

/**
 * Ordered ascending by `minOwned`. Highest matching threshold wins.
 * Thresholds: 0 / 1 / 10 / 25 / 50+ (see `docs/modules/scene.md`).
 */
export const SCENE_STAGES: readonly SceneStage[] = [
  { id: 'empty', minOwned: 0, label: 'Empty office' },
  { id: 'solo', minOwned: 1, label: 'Solo hacker' },
  { id: 'small-team', minOwned: 10, label: 'Small team' },
  { id: 'open-plan', minOwned: 25, label: 'Open-plan densification' },
  { id: 'crowded', minOwned: 50, label: 'Crowded office' },
] as const;

/** Resolve the active scene stage from Dev owned count. */
export function sceneStageForOwned(devOwned: number): SceneStage {
  const owned = Number.isFinite(devOwned)
    ? Math.max(0, Math.floor(devOwned))
    : 0;
  let stage = SCENE_STAGES[0]!;
  for (const candidate of SCENE_STAGES) {
    if (owned >= candidate.minOwned) {
      stage = candidate;
    }
  }
  return stage;
}
