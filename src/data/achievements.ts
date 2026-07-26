/**
 * Upcoming achievement stubs for the Achievements page.
 * Real unlock logic lands with the Achievements / incidents roadmap item.
 */

export type UpcomingAchievement = {
  id: string;
  name: string;
  blurb: string;
};

/** Placeholder list — not persisted, not unlockable yet. */
export const upcomingAchievements: UpcomingAchievement[] = [
  {
    id: 'first-ship',
    name: 'First ship',
    blurb: 'Click Ship It once. The journey of a thousand deploys.',
  },
  {
    id: 'espresso-drip',
    name: 'Espresso drip',
    blurb: 'Own an Espresso machine. Automation smells like progress.',
  },
  {
    id: 'crowd-control',
    name: 'Crowd control',
    blurb: 'Fill the office with Devs. LOD will remember this.',
  },
  {
    id: 'incident-adjacent',
    name: 'Incident-adjacent',
    blurb: 'Survive a SEV-flavored mini-event (coming later).',
  },
  {
    id: 'rewrite-ready',
    name: 'Rewrite ready',
    blurb: 'Bank your first Rewrite when prestige ships.',
  },
];
