/**
 * Upcoming achievement stubs for the Achievements page.
 * Real unlock predicates land with the Achievements / incidents roadmap item (#33).
 * Entries use `createEnum` so unlock logic can attach to the same objects later.
 */

import { createEnum } from '../lib/createEnum';

export const UpcomingAchievements = createEnum({
  'first-ship': {
    title: 'First ship',
    blurb: 'Click Ship It once. The journey of a thousand deploys.',
  },
  'espresso-drip': {
    title: 'Espresso drip',
    blurb: 'Own an Espresso machine. Automation smells like progress.',
  },
  'crowd-control': {
    title: 'Crowd control',
    blurb: 'Fill the office with Devs. LOD will remember this.',
  },
  'incident-adjacent': {
    title: 'Incident-adjacent',
    blurb: 'Survive a SEV-flavored mini-event (coming later).',
  },
  'rewrite-ready': {
    title: 'Rewrite ready',
    blurb: 'Bank your first Rewrite when prestige ships.',
  },
});

export type UpcomingAchievementId = keyof typeof UpcomingAchievements;

export type UpcomingAchievement =
  (typeof UpcomingAchievements)[UpcomingAchievementId];

/** Ordered list for the Achievements gallery (insertion order). */
export const upcomingAchievements: readonly UpcomingAchievement[] =
  Object.values(UpcomingAchievements).sort((a, b) => a.index - b.index);
