/**
 * Scene LOD: cap rendered Dev sprites; show ×N Dev count above the cap.
 * Caps equal columns × rows so a full farm is never padded with vacant desks
 * when the player owns enough Devs (desktop lean still within 24–48).
 */

/** Desk-farm columns below `lg` (must match CSS). */
export const SCENE_DESK_COLUMNS_NARROW = 6;

/** Desk-farm columns at `lg`+ (must match CSS). */
export const SCENE_DESK_COLUMNS_WIDE = 9;

/** Filled desk-farm rows at the LOD cap (must stay in sync with caps below). */
export const SCENE_DESK_ROWS = 4;

/** Max Dev DOM sprites on desktop (`lg` / 1024px+) — fills 9×4. */
export const SCENE_SPRITE_CAP = SCENE_DESK_COLUMNS_WIDE * SCENE_DESK_ROWS;

/** Max Dev DOM sprites below `lg` — fills 5×4. */
export const SCENE_SPRITE_CAP_MOBILE =
  SCENE_DESK_COLUMNS_NARROW * SCENE_DESK_ROWS;

/** Fixed desk-cell width (must match CSS `--office-desk-cell-w`). */
export const SCENE_DESK_CELL_WIDTH = '3rem';

/**
 * Sprite budget for the current layout breakpoint.
 * `isDesktop` matches Tailwind `lg` (`min-width: 1024px`).
 */
export function sceneSpriteCap(isDesktop: boolean): number {
  return isDesktop ? SCENE_SPRITE_CAP : SCENE_SPRITE_CAP_MOBILE;
}

/**
 * Desk-farm column count — tied to sprite budget breakpoint (`lg`).
 * Cap = columns × `SCENE_DESK_ROWS`, so capped offices fill every seat.
 */
export function sceneDeskColumns(isDesktop: boolean): number {
  return isDesktop ? SCENE_DESK_COLUMNS_WIDE : SCENE_DESK_COLUMNS_NARROW;
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
 * Total owned Dev count for the LOD badge, or `null` when every Dev is rendered.
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

/**
 * Desk cells to mount so the farm fills complete rows.
 * Uses `max(visible, emptyDesks)`, then rounds up to a multiple of `columns`.
 */
export function deskFarmCount(
  visibleDevs: number,
  emptyDesks: number,
  columns: number,
): number {
  const visible =
    Number.isFinite(visibleDevs) && visibleDevs > 0
      ? Math.floor(visibleDevs)
      : 0;
  const empty =
    Number.isFinite(emptyDesks) && emptyDesks > 0 ? Math.floor(emptyDesks) : 0;
  const needed = Math.max(visible, empty);
  if (needed <= 0) {
    return 0;
  }
  const cols =
    Number.isFinite(columns) && columns > 0 ? Math.floor(columns) : 1;
  return Math.ceil(needed / cols) * cols;
}
