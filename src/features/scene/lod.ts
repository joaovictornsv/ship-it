/**
 * Scene LOD: cap rendered Dev sprites; show ×N badge above the cap.
 * Desktop cap sits mid-range of the product lean (24–48); mobile uses a leaner budget.
 */

/** Max Dev DOM sprites on desktop (`lg` / 1024px+). */
export const SCENE_SPRITE_CAP = 32;

/** Max Dev DOM sprites below `lg` — leaner mobile budget. */
export const SCENE_SPRITE_CAP_MOBILE = 16;

/**
 * Sprite budget for the current layout breakpoint.
 * `isDesktop` matches Tailwind `lg` (`min-width: 1024px`).
 */
export function sceneSpriteCap(isDesktop: boolean): number {
  return isDesktop ? SCENE_SPRITE_CAP : SCENE_SPRITE_CAP_MOBILE;
}

/**
 * How many Dev sprites to mount for the given owned count.
 * Clamped to `[0, cap]` (default: desktop `SCENE_SPRITE_CAP`).
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
