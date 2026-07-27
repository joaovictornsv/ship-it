/**
 * Shell / scene layout breakpoints.
 * Keep in sync with Tailwind `lg` and docs in shop.md / scene.md.
 */

/** Tailwind `lg` — desktop shop rail + full scene sprite budget + 8-col desk farm. */
export const DESKTOP_MIN_WIDTH_PX = 1024;

/** `matchMedia` query for desktop layout. */
export const DESKTOP_MEDIA_QUERY = `(min-width: ${DESKTOP_MIN_WIDTH_PX}px)`;
