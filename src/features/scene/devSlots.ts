import { SCENE_SPRITE_CAP } from './lod';

export type DevSlot = {
  /** Horizontal position as % of the floor. */
  left: number;
  /** Vertical position as % of the floor (lower = farther back). */
  top: number;
};

/**
 * Deterministic floor slots for up to `SCENE_SPRITE_CAP` Devs.
 * Slight column stagger so the crowd reads as an office, not a grid.
 */
function buildDevSlots(cap: number): readonly DevSlot[] {
  const slots: DevSlot[] = [];
  const cols = 8;
  const rows = Math.ceil(cap / cols);
  for (let i = 0; i < cap; i += 1) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const jitterX = ((i * 17) % 7) - 3;
    const jitterY = ((i * 13) % 5) - 2;
    const left = 8 + (col / (cols - 1)) * 84 + jitterX * 0.35;
    const top = 18 + (row / Math.max(rows - 1, 1)) * 62 + jitterY * 0.4;
    slots.push({
      left: Math.min(94, Math.max(4, left)),
      top: Math.min(88, Math.max(12, top)),
    });
  }
  return slots;
}

export const DEV_SLOTS: readonly DevSlot[] = buildDevSlots(SCENE_SPRITE_CAP);
