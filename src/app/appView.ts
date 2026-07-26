export type AppView = 'play' | 'save' | 'achievements';

/**
 * Map `location.hash` to an app view. Unknown hashes fall back to play.
 */
export function parseAppView(hash: string): AppView {
  const path = hash.replace(/^#/, '').replace(/^\//, '');
  if (path === 'save') {
    return 'save';
  }
  if (path === 'achievements') {
    return 'achievements';
  }
  return 'play';
}

/** Canonical hash for a view (`#/` play, `#/save`, `#/achievements`). */
export function appViewHash(view: AppView): string {
  if (view === 'save') {
    return '#/save';
  }
  if (view === 'achievements') {
    return '#/achievements';
  }
  return '#/';
}
