export type AppView = 'play' | 'save';

/**
 * Map `location.hash` to an app view. Unknown hashes fall back to play.
 */
export function parseAppView(hash: string): AppView {
  const path = hash.replace(/^#/, '').replace(/^\//, '');
  if (path === 'save') {
    return 'save';
  }
  return 'play';
}

/** Canonical hash for a view (`#/` play, `#/save` save). */
export function appViewHash(view: AppView): string {
  return view === 'save' ? '#/save' : '#/';
}
