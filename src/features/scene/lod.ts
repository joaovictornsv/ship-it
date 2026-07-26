/**
 * Scene LOD: cap rendered Dev sprites; show ×N badge above the cap.
 * Cap sits mid-range of the product lean (24–48).
 */

/** Max Dev DOM sprites rendered at once. */
export const SCENE_SPRITE_CAP = 32;

/**
 * How many Dev sprites to mount for the given owned count.
 * Clamped to `[0, SCENE_SPRITE_CAP]`.
 */
export function visibleDevCount(
  devOwned: number,
  cap: number = SCENE_SPRITE_CAP,
): number {
  if (!Number.isFinite(devOwned) || devOwned <= 0) {
    return 0;
  }
  return Math.min(Math.floor(devOwned), cap);
}

/**
 * Total owned count for the LOD badge, or `null` when every Dev is rendered.
 * Badge shows `×{count}` so the scene stays readable at 100+.
 */
export function lodBadgeCount(
  devOwned: number,
  cap: number = SCENE_SPRITE_CAP,
): number | null {
  if (!Number.isFinite(devOwned) || devOwned <= cap) {
    return null;
  }
  return Math.floor(devOwned);
}
