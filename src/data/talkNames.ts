/**
 * Display names for rare office-talk name-drops.
 * Until contributor skins (#10) fill `contributors`, keep a tiny public allowlist
 * (repo owner). Skins can merge into this list later.
 */
export const TALK_CONTRIBUTOR_NAMES = ['joaovictornsv'] as const;

export type TalkContributorName = (typeof TALK_CONTRIBUTOR_NAMES)[number];
