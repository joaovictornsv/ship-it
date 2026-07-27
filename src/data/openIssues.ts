/**
 * Build-time snapshot of open GitHub issues for office talk bubbles.
 * Regenerate with `pnpm snapshot:issues` (server/CI only — no client token).
 *
 * Fetched at: 2026-07-27T01:02:51.646Z
 * Source: joaovictornsv/ship-it open issues (public fields only).
 */

export type OpenIssueSnapshot = {
  number: number;
  title: string;
};

export const OPEN_ISSUES_FETCHED_AT = '2026-07-27T01:02:51.646Z' as const;

export const OPEN_ISSUES_SNAPSHOT: readonly OpenIssueSnapshot[] = [
  { number: 9, title: 'Rewrite prestige + Rewrites shop' },
  { number: 10, title: 'Contributor skins pipeline' },
  { number: 11, title: 'Unlockable rooms' },
  { number: 12, title: 'Quave Cloud staging deploy' },
  { number: 13, title: 'Agent delivery loop hardening' },
  {
    number: 31,
    title:
      'Richer office talk bubbles: rare GitHub, contributors, real-world flavor',
  },
  { number: 33, title: 'Achievements: milestone tracking across play stats' },
  { number: 34, title: 'Office themes shop: buyable scene cosmetics' },
  {
    number: 37,
    title:
      'Building upgrades: per-producer multipliers in the horizontal queue',
  },
];
