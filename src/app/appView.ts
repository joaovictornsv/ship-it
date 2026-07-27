import { createEnum, getEnumByName } from '../lib/createEnum';

/**
 * App shell views. Hash routing and labels live on the enum entry — avoid
 * parallel if-chains / maps keyed by the same view name.
 */
export const AppViews = createEnum({
  play: {
    /** Path after `#/` — empty means home play. */
    hashPath: '',
    getHash: () => '#/' as const,
  },
  save: {
    hashPath: 'save',
    getHash: () => '#/save' as const,
  },
  achievements: {
    hashPath: 'achievements',
    getHash: () => '#/achievements' as const,
  },
  credits: {
    hashPath: 'credits',
    getHash: () => '#/credits' as const,
  },
});

export type AppView = keyof typeof AppViews;

/**
 * Map `location.hash` to an app view. Unknown hashes fall back to play.
 */
export function parseAppView(hash: string): AppView {
  const path = hash.replace(/^#/, '').replace(/^\//, '');
  if (path === '' || path === AppViews.play.hashPath) {
    return AppViews.play.name;
  }
  return getEnumByName(AppViews, path)?.name ?? AppViews.play.name;
}

/** Canonical hash for a view (`#/` play, `#/save`, `#/achievements`, `#/credits`). */
export function appViewHash(view: AppView): string {
  return AppViews[view].getHash();
}
