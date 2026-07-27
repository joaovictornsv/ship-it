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

/**
 * Stable fake names for overflow / emoji desks (English-only, ordinary + joke).
 * Indexed by desk index so the same slot keeps the same name across renders.
 * Sized past the desktop LOD cap so visible desks stay unique under the cap.
 */
export const FAKE_DEV_NAMES = [
  'Alex',
  'Sam',
  'Jordan',
  'Casey',
  'Riley',
  'Morgan',
  'Quinn',
  'Avery',
  'Jamie',
  'Taylor',
  'Cameron',
  'Drew',
  'Skyler',
  'Reese',
  'Harper',
  'Logan',
  'Null Pointer',
  '404 Not Found',
  'Merge Conflict',
  'LGTM Bot',
  'Coffee Overflow',
  'Tabs vs Spaces',
  'Off-by-One',
  'Rubber Duck',
  'Staging Only',
  'Works On My Machine',
  'Flaky Spec',
  'Hotfix Friday',
  'Force Push Fred',
  'TODO Later',
  'Silent Observer',
  'Ping Me Later',
] as const;

export type ResolvedDevSkin =
  | {
      mode: 'contributor';
      skin: ContributorSkin;
      avatarSrc: string;
      /** GitHub username (`id` / login) for hover. */
      label: string;
      /** Profile URL for human skins; `null` for bots. */
      profileUrl: string | null;
    }
  | {
      mode: 'fallback';
      /** Stable fake name from `FAKE_DEV_NAMES`. */
      label: string;
    };

export function contributorAvatarSrc(skin: ContributorSkin): string {
  return `/contributors/avatars/${skin.avatarFile}`;
}

/** GitHub profile URL for human skins; bots return `null`. */
export function contributorProfileUrl(skin: ContributorSkin): string | null {
  if (skin.kind === 'bot') {
    return null;
  }
  return `https://github.com/${skin.id}`;
}

/** Stable fake name for desk index `i` (modulo the pool). */
export function fakeDevNameForIndex(index: number): string {
  const i =
    ((index % FAKE_DEV_NAMES.length) + FAKE_DEV_NAMES.length) %
    FAKE_DEV_NAMES.length;
  return FAKE_DEV_NAMES[i]!;
}

/**
 * Resolve a desk skin from an explicit pool (testable empty-pool path).
 * Each contributor appears at most once on screen — index maps 1:1 into the
 * pool; desks beyond the pool size use generic emoji fallbacks with a fake name.
 */
export function resolveDevSkinFromPool(
  index: number,
  pool: readonly ContributorSkin[],
): ResolvedDevSkin {
  if (index < 0 || index >= pool.length) {
    return { mode: 'fallback', label: fakeDevNameForIndex(index) };
  }
  const skin = pool[index]!;
  return {
    mode: 'contributor',
    skin,
    avatarSrc: contributorAvatarSrc(skin),
    label: skin.id,
    profileUrl: contributorProfileUrl(skin),
  };
}

/**
 * Pick a skin for desk index `i`. Unique per visible contributor; overflow
 * desks (and empty pool) → fallback mode (scene uses generic Dev glyphs).
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
