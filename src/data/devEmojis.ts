/** People-only Dev face pool — no food / object glyphs as desk sprites. */
export const PEOPLE_DEV_EMOJIS = [
  '🧑‍💻',
  '👨‍💻',
  '👩‍💻',
  '🧑‍🔧',
  '🤓',
  '👩‍🔧',
  '👨‍🔧',
  '🧑‍🎓',
] as const;

/** Default office subset (first six). */
export const DEFAULT_DEV_EMOJIS = PEOPLE_DEV_EMOJIS.slice(0, 6);
