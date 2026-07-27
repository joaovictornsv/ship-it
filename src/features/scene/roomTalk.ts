/**
 * Per-room office chatter + occasional emotional-peak lines.
 * Specialty GitHub / contributor jokes stay room-flavored in `specialtyTalk.ts`.
 */

import type { RoomId } from '../../data/rooms';
import type { OpenIssueSnapshot } from '../../data/openIssues';
import type { DevDialogue } from './devTalk';
import { DEV_DIALOGUES, DEV_LINES } from './devTalk';

/** Chance a spawn is an emotional peak (angry / happy) instead of normal talk. */
export const EMOTIONAL_PEAK_CHANCE = 0.1;

export type TalkMood = 'neutral' | 'angry' | 'happy';

export type TalkBubbleContent = {
  text: string;
  mood: TalkMood;
};

export type RoomTalkPools = {
  lines: readonly string[];
  dialogues: readonly DevDialogue[];
};

const OFFICE_EXTRA_LINES = [
  'Standup in the main bay?',
  'Who moved my sticky notes?',
  'Desk farm looking busy.',
] as const;

const BREAK_ROOM_LINES = [
  'Espresso first, then the bug.',
  'Snack run?',
  'Five more minutes on the couch.',
  'Who finished the last pod?',
  'Break-room Wi‑Fi is somehow faster.',
  'Refill, then back to the ticket.',
  'This mug has seen things.',
  'Quiet corner energy.',
] as const;

const BREAK_ROOM_DIALOGUES: readonly DevDialogue[] = [
  { a: 'Coffee?', b: 'Always.' },
  { a: 'Back to the desk?', b: 'After this sip.' },
  { a: 'Anyone leave snacks?', b: 'Gone already.' },
];

const REVIEW_LAB_LINES = [
  'Need another pair of eyes.',
  'Nit: naming.',
  'LGTM with a small ask.',
  'Can you leave a comment?',
  'Two reviewers, one timeline.',
  'That diff is spicy.',
  'Approve after tests.',
  'Who requested changes?',
] as const;

const REVIEW_LAB_DIALOGUES: readonly DevDialogue[] = [
  { a: 'Ready to review?', b: 'Send the link.' },
  { a: 'Any blockers?', b: 'Just one nit.' },
  { a: 'Approve?', b: 'After CI.' },
];

const OPS_BAY_LINES = [
  'Pager’s quiet. Suspicious.',
  'Green checks only, please.',
  'Who owns this alert?',
  'Rollback plan ready?',
  'Deploy window’s open.',
  'Latency spike — looking.',
  'Runbook says reboot faith.',
  'On-call swap?',
] as const;

const OPS_BAY_DIALOGUES: readonly DevDialogue[] = [
  { a: 'CI green?', b: 'For now.' },
  { a: 'Page or ticket?', b: 'Ticket first.' },
  { a: 'Ship the hotfix?', b: 'After the canary.' },
];

const DATACENTER_LINES = [
  'Racks hum louder after a Rewrite.',
  'Permanent floor energy.',
  'Which region is this again?',
  'Cable management is a myth.',
  'Cold aisle, hot opinions.',
  'Infra jokes hit different here.',
  'Did we keep the rooms?',
  'Tokens/s echoes in the racks.',
] as const;

const DATACENTER_DIALOGUES: readonly DevDialogue[] = [
  { a: 'Survived the Rewrite?', b: 'Rooms did.' },
  { a: 'Need more capacity?', b: 'Hire Devs first.' },
  { a: 'Quiet in here.', b: 'Until the next deploy.' },
];

function shortTitle(title: string, max = 32): string {
  const trimmed = title.trim().replace(/\s+/g, ' ');
  if (trimmed.length <= max) {
    return trimmed;
  }
  return `${trimmed.slice(0, max - 1).trimEnd()}…`;
}

/** Generic + room-flavored standalone lines for the active map tab. */
export function roomLines(roomId: RoomId): readonly string[] {
  switch (roomId) {
    case 'break-room':
      return [...BREAK_ROOM_LINES, ...DEV_LINES.slice(0, 12)];
    case 'review-lab':
      return [...REVIEW_LAB_LINES, ...DEV_LINES.slice(0, 12)];
    case 'ops-bay':
      return [...OPS_BAY_LINES, ...DEV_LINES.slice(0, 12)];
    case 'datacenter':
      return [...DATACENTER_LINES, ...DEV_LINES.slice(0, 12)];
    case 'office':
    default:
      return [...OFFICE_EXTRA_LINES, ...DEV_LINES];
  }
}

/** Two-person exchanges tuned to the active room (fallback: generic). */
export function roomDialogues(roomId: RoomId): readonly DevDialogue[] {
  switch (roomId) {
    case 'break-room':
      return [...BREAK_ROOM_DIALOGUES, ...DEV_DIALOGUES.slice(0, 4)];
    case 'review-lab':
      return [...REVIEW_LAB_DIALOGUES, ...DEV_DIALOGUES.slice(0, 4)];
    case 'ops-bay':
      return [...OPS_BAY_DIALOGUES, ...DEV_DIALOGUES.slice(0, 4)];
    case 'datacenter':
      return [...DATACENTER_DIALOGUES, ...DEV_DIALOGUES.slice(0, 4)];
    case 'office':
    default:
      return DEV_DIALOGUES;
  }
}

export function roomTalkPools(roomId: RoomId): RoomTalkPools {
  return { lines: roomLines(roomId), dialogues: roomDialogues(roomId) };
}

/**
 * Angry (critic / bug) and happy (ship / promo) peak lines.
 * Mixes static jokes with optional issue / contributor flavor.
 */
export function emotionalPeakCandidates(options: {
  openIssues?: readonly OpenIssueSnapshot[];
  contributorNames?: readonly string[];
}): readonly TalkBubbleContent[] {
  const issues = options.openIssues ?? [];
  const names = (options.contributorNames ?? []).filter(
    (name) => name.trim().length > 0,
  );

  const angry: TalkBubbleContent[] = [
    { mood: 'angry', text: 'This bug is personal now.' },
    { mood: 'angry', text: 'Who merged that?!' },
    { mood: 'angry', text: 'Critic review energy. Ouch.' },
    { mood: 'angry', text: 'That regression found me.' },
    { mood: 'angry', text: 'Production is judging us.' },
    { mood: 'angry', text: 'I refuse to reproduce this again.' },
  ];

  const happy: TalkBubbleContent[] = [
    { mood: 'happy', text: 'It works. It actually works.' },
    { mood: 'happy', text: 'Green build. Ship it!' },
    { mood: 'happy', text: 'Promotion energy unlocked.' },
    { mood: 'happy', text: 'Feature landed clean.' },
    { mood: 'happy', text: 'LGTM forever.' },
    { mood: 'happy', text: 'That deploy felt good.' },
  ];

  for (const issue of issues) {
    const title = shortTitle(issue.title);
    angry.push({
      mood: 'angry',
      text: `#${issue.number} is wrecking my day.`,
    });
    angry.push({
      mood: 'angry',
      text: `Critic mode: ${title}`,
    });
    happy.push({
      mood: 'happy',
      text: `#${issue.number} finally feels shippable.`,
    });
    happy.push({
      mood: 'happy',
      text: `Closed the loop on ${title}? Almost.`,
    });
  }

  for (const name of names) {
    const handle = name.trim();
    angry.push({
      mood: 'angry',
      text: `${handle} left a brutal review.`,
    });
    happy.push({
      mood: 'happy',
      text: `${handle} just shipped something great.`,
    });
  }

  return [...angry, ...happy];
}

function pickFrom<T>(items: readonly T[], random: () => number): T | undefined {
  if (items.length === 0) {
    return undefined;
  }
  return items[Math.floor(random() * items.length)];
}

/**
 * Occasional emotional peak, or `null` when the roll misses / pool empty.
 */
export function pickEmotionalPeak(options: {
  exclude?: ReadonlySet<string>;
  openIssues?: readonly OpenIssueSnapshot[];
  contributorNames?: readonly string[];
  /** Peak roll; inject for tests. Defaults to `Math.random`. */
  random?: () => number;
}): TalkBubbleContent | null {
  const random = options.random ?? Math.random;
  if (random() >= EMOTIONAL_PEAK_CHANCE) {
    return null;
  }

  const exclude = options.exclude ?? new Set<string>();
  const pool = emotionalPeakCandidates({
    openIssues: options.openIssues,
    contributorNames: options.contributorNames,
  }).filter((item) => !exclude.has(item.text));

  const source =
    pool.length > 0
      ? pool
      : emotionalPeakCandidates({
          openIssues: options.openIssues,
          contributorNames: options.contributorNames,
        });

  return pickFrom(source, random) ?? null;
}
