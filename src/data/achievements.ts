/**
 * Achievement catalog — durable milestone badges (PRODUCT Later / issue #33).
 * IDs are stable; do not rename without a save migrator.
 */

import { createEnum } from '../lib/createEnum';
import { DEV_ID, ESPRESSO_MACHINE_ID, type UpgradeId } from './upgrades';

/** Counter / owned predicates for unlock checks. */
export type AchievementGoal =
  | { kind: 'lifetimeTokens'; threshold: number }
  | { kind: 'lifetimeClicks'; threshold: number }
  | { kind: 'lifetimePurchases'; threshold: number }
  | { kind: 'owned'; upgradeId: UpgradeId; threshold: number }
  | { kind: 'rewrites'; threshold: number };

export type AchievementFamily =
  'tokens' | 'clicks' | 'owned' | 'purchases' | 'rewrites';

export type AchievementFields = {
  title: string;
  /** Locked tease / unlocked joke — English only. */
  blurb: string;
  family: AchievementFamily;
  goal: AchievementGoal;
};

export const Achievements = createEnum({
  'first-ship': {
    title: 'First ship',
    blurb: 'Click Ship It once. The journey of a thousand deploys.',
    family: 'clicks',
    goal: { kind: 'lifetimeClicks', threshold: 1 },
  },
  'click-habit': {
    title: 'Click habit',
    blurb: 'One hundred Ship Its. Muscle memory is forming.',
    family: 'clicks',
    goal: { kind: 'lifetimeClicks', threshold: 100 },
  },
  'deploy-spam': {
    title: 'Deploy spam',
    blurb: 'A thousand clicks. CI is politely concerned.',
    family: 'clicks',
    goal: { kind: 'lifetimeClicks', threshold: 1_000 },
  },
  'pocket-change': {
    title: 'Pocket change',
    blurb: 'Earn 100 lifetime tokens. Enough for a sad vending-machine coffee.',
    family: 'tokens',
    goal: { kind: 'lifetimeTokens', threshold: 100 },
  },
  'coffee-budget': {
    title: 'Coffee budget',
    blurb: 'Earn 10,000 lifetime tokens. Finance asks for receipts.',
    family: 'tokens',
    goal: { kind: 'lifetimeTokens', threshold: 10_000 },
  },
  'funding-round': {
    title: 'Funding round',
    blurb: 'Earn 1,000,000 lifetime tokens. Someone updates the pitch deck.',
    family: 'tokens',
    goal: { kind: 'lifetimeTokens', threshold: 1_000_000 },
  },
  'espresso-drip': {
    title: 'Espresso drip',
    blurb: 'Own an Espresso machine. Automation smells like progress.',
    family: 'owned',
    goal: { kind: 'owned', upgradeId: ESPRESSO_MACHINE_ID, threshold: 1 },
  },
  'barista-squad': {
    title: 'Barista squad',
    blurb: 'Own 10 Espresso machines. The office hums in C♯ minor.',
    family: 'owned',
    goal: { kind: 'owned', upgradeId: ESPRESSO_MACHINE_ID, threshold: 10 },
  },
  'first-hire': {
    title: 'First hire',
    blurb: 'Own a Dev. Onboarding starts with finding the mug shelf.',
    family: 'owned',
    goal: { kind: 'owned', upgradeId: DEV_ID, threshold: 1 },
  },
  'crowd-control': {
    title: 'Crowd control',
    blurb: 'Own 10 Devs. LOD will remember this.',
    family: 'owned',
    goal: { kind: 'owned', upgradeId: DEV_ID, threshold: 10 },
  },
  'window-shopper': {
    title: 'Window shopper',
    blurb: 'Buy something once. The shop notices you.',
    family: 'purchases',
    goal: { kind: 'lifetimePurchases', threshold: 1 },
  },
  'shopping-spree': {
    title: 'Shopping spree',
    blurb: '25 lifetime purchases. Procurement would like a word.',
    family: 'purchases',
    goal: { kind: 'lifetimePurchases', threshold: 25 },
  },
  'rewrite-ready': {
    title: 'Rewrite ready',
    blurb: 'Bank your first Rewrite. Greenfield energy, brownfield guilt.',
    family: 'rewrites',
    goal: { kind: 'rewrites', threshold: 1 },
  },
} satisfies Record<string, AchievementFields>);

export type AchievementId = keyof typeof Achievements;

export type AchievementDef = (typeof Achievements)[AchievementId];

/** Ordered catalog for the Achievements gallery (insertion order). */
export const achievements: readonly AchievementDef[] = Object.values(
  Achievements,
).sort((a, b) => a.index - b.index);

const byId = new Map(achievements.map((def) => [def.name, def] as const));

export function getAchievement(id: AchievementId): AchievementDef {
  const def = byId.get(id);
  if (!def) {
    throw new Error(`Unknown achievement id: ${id}`);
  }
  return def;
}

export function isAchievementId(id: string): id is AchievementId {
  return byId.has(id as AchievementId);
}
