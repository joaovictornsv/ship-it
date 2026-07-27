/**
 * Static contributor skins — opt-in pool + paths for public avatar assets.
 * Avatars live under `public/contributors/avatars/` (bake with
 * `pnpm generate:contributors`). No private API keys; public metadata only.
 *
 * Missing / unloadable avatars fall back to generic Dev glyphs in the scene
 * (`devEmojiForIndex`) — the catalog itself never requires network at runtime.
 */

export type ContributorKind = 'human' | 'bot';

export type ContributorSkin = {
  /** Stable id (GitHub login slug, filesystem-safe). */
  id: string;
  /** Shown on hover and on the credits page. */
  displayName: string;
  /** Filename under `/contributors/avatars/`. */
  avatarFile: string;
  kind: ContributorKind;
};

/**
 * Opt-in tribute pool. Keep in sync with `public/contributors/opt-in.json`
 * (generate script reads that file and refreshes avatar PNGs).
 */
export const CONTRIBUTOR_SKINS: readonly ContributorSkin[] = [
  {
    id: 'joaovictornsv',
    displayName: 'joaovictornsv',
    avatarFile: 'joaovictornsv.png',
    kind: 'human',
  },
  {
    id: 'dependabot',
    displayName: 'dependabot',
    avatarFile: 'dependabot.png',
    kind: 'bot',
  },
] as const;

export type ResolvedDevSkin =
  | {
      mode: 'contributor';
      skin: ContributorSkin;
      avatarSrc: string;
      label: string;
    }
  | {
      mode: 'fallback';
      label: null;
    };

export function contributorAvatarSrc(skin: ContributorSkin): string {
  return `/contributors/avatars/${skin.avatarFile}`;
}

/**
 * Resolve a desk skin from an explicit pool (testable empty-pool path).
 */
export function resolveDevSkinFromPool(
  index: number,
  pool: readonly ContributorSkin[],
): ResolvedDevSkin {
  if (pool.length === 0) {
    return { mode: 'fallback', label: null };
  }
  const skin = pool[index % pool.length]!;
  return {
    mode: 'contributor',
    skin,
    avatarSrc: contributorAvatarSrc(skin),
    label: skin.displayName,
  };
}

/**
 * Pick a skin for desk index `i`. Cycles the opt-in pool; empty pool →
 * fallback mode (scene uses generic Dev glyphs).
 */
export function resolveDevSkin(index: number): ResolvedDevSkin {
  return resolveDevSkinFromPool(index, CONTRIBUTOR_SKINS);
}

/** Display names for rare office-talk name-drops (skins pool). */
export function contributorDisplayNames(): readonly string[] {
  return CONTRIBUTOR_SKINS.map((skin) => skin.displayName);
}

/** Talk allowlist — derived from the opt-in skins catalog. */
export const TALK_CONTRIBUTOR_NAMES = CONTRIBUTOR_SKINS.map(
  (skin) => skin.displayName,
);

export type TalkContributorName = (typeof TALK_CONTRIBUTOR_NAMES)[number];
