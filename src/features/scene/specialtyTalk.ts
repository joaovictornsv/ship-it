/**
 * Rare specialty office talk — GitHub issues, contributors, calendar, owned props.
 * Generic majority still lives in `devTalk.ts` / `roomTalk.ts`.
 */

import { TALK_CONTRIBUTOR_NAMES } from '../../data/talkNames';
import {
  OPEN_ISSUES_SNAPSHOT,
  type OpenIssueSnapshot,
} from '../../data/openIssues';
import type { RoomId } from '../../data/rooms';
import type { SceneStageId } from './stages';
import {
  pickEmotionalPeak,
  roomLines,
  type TalkBubbleContent,
  type TalkMood,
} from './roomTalk';

/** Chance a non-dialogue spawn uses a specialty line instead of room lines. */
export const SPECIALTY_LINE_CHANCE = 0.14;

export type TalkOwnedProps = {
  espresso: number;
  codeReview: number;
  ci: number;
  onCall: number;
};

export type TalkContext = {
  /** Injectable clock for calendar flavor + tests. */
  now: Date;
  stageId: SceneStageId;
  tokensPerSecond: number;
  owned: TalkOwnedProps;
  /** Active unlockable room — flavors specialty + generic pools. */
  roomId: RoomId;
};

export type SpecialtyCategory =
  | 'github'
  | 'contributor'
  | 'calendar'
  | 'owned-upgrade'
  | 'stage'
  | 'rate'
  | 'room';

type PickOptions = {
  exclude?: ReadonlySet<string>;
  context: TalkContext;
  openIssues?: readonly OpenIssueSnapshot[];
  contributorNames?: readonly string[];
  /** Specialty / peak roll; inject for tests. Defaults to `Math.random`. */
  random?: () => number;
};

function pickFrom<T>(items: readonly T[], random: () => number): T | undefined {
  if (items.length === 0) {
    return undefined;
  }
  return items[Math.floor(random() * items.length)];
}

function shortTitle(title: string, max = 36): string {
  const trimmed = title.trim().replace(/\s+/g, ' ');
  if (trimmed.length <= max) {
    return trimmed;
  }
  return `${trimmed.slice(0, max - 1).trimEnd()}…`;
}

/** Room-flavored jokes over open GitHub issues (build-time snapshot). */
export function githubIssueLines(
  issues: readonly OpenIssueSnapshot[],
  roomId: RoomId = 'office',
): string[] {
  const lines: string[] = [];
  for (const issue of issues) {
    const n = issue.number;
    const title = shortTitle(issue.title);
    switch (roomId) {
      case 'break-room':
        lines.push(`#${n} can wait until after espresso.`);
        lines.push(`Talking about ${title} over coffee.`);
        lines.push(`Snack first, then poke #${n}.`);
        break;
      case 'review-lab':
        lines.push(`#${n} needs another LGTM.`);
        lines.push(`Reviewing “${title}” — thoughts?`);
        lines.push(`Leave a nit on #${n}?`);
        break;
      case 'ops-bay':
        lines.push(`#${n} is paging the bay.`);
        lines.push(`Is ${title} an incident yet?`);
        lines.push(`Runbook for #${n}, anyone?`);
        break;
      case 'datacenter':
        lines.push(`#${n} survived the last Rewrite.`);
        lines.push(`Racks still whisper about ${title}.`);
        lines.push(`Infra ticket energy: #${n}.`);
        break;
      case 'office':
      default:
        lines.push(`Anyone looking at #${n}?`);
        lines.push(`#${n} keeps popping up in standup.`);
        lines.push(`Should we poke #${n} next?`);
        lines.push(`That open issue about ${title} is haunting me.`);
        break;
    }
  }
  return lines;
}

/** Room-flavored contributor name-drops. */
export function contributorLines(
  names: readonly string[],
  roomId: RoomId = 'office',
): string[] {
  const lines: string[] = [];
  for (const name of names) {
    const handle = name.trim();
    if (!handle) {
      continue;
    }
    switch (roomId) {
      case 'break-room':
        lines.push(`Is ${handle} AFK in the break room?`);
        lines.push(`${handle} took the last espresso.`);
        break;
      case 'review-lab':
        lines.push(`Did ${handle} review this yet?`);
        lines.push(`${handle} leaves the kindest nits.`);
        break;
      case 'ops-bay':
        lines.push(`Ping ${handle} before we page.`);
        lines.push(`${handle} knows this alert.`);
        break;
      case 'datacenter':
        lines.push(`${handle} is a Rewrite ghost in the racks.`);
        lines.push(`Was this ${handle}’s infra idea?`);
        break;
      case 'office':
      default:
        lines.push(`Did ${handle} review this yet?`);
        lines.push(`${handle} would ship this already.`);
        lines.push(`Ping ${handle} when you’re free.`);
        lines.push(`Was this ${handle}’s idea?`);
        break;
    }
  }
  return lines;
}

export function calendarLines(now: Date): string[] {
  const day = now.getDay(); // 0 Sun … 6 Sat
  const hour = now.getHours();
  const lines: string[] = [];

  if (day === 1) {
    lines.push('Monday standup energy…');
    lines.push('New week, same backlog.');
  }
  if (day === 5) {
    lines.push('Friday — ship it?');
    lines.push('Don’t merge right before the weekend.');
  }
  if (hour >= 22 || hour < 5) {
    lines.push('Late-night build club.');
    lines.push('Why is this still compiling?');
  }
  if (hour >= 11 && hour < 14) {
    lines.push('Lunch soon, or is that optimistic?');
  }
  if (day === 0 || day === 6) {
    lines.push('Weekend deploy? Bold.');
  }

  // Always-available light calendar flavor so the bucket is never empty.
  if (hour >= 9 && hour < 11) {
    lines.push('Morning coffee first.');
  }
  if (hour >= 15 && hour < 18) {
    lines.push('Afternoon focus block — hush.');
  }

  return lines;
}

export function ownedUpgradeLines(owned: TalkOwnedProps): string[] {
  const lines: string[] = [];
  if (owned.espresso > 0) {
    lines.push('Espresso machine is carrying us.');
    lines.push('Who emptied the espresso again?');
  }
  if (owned.ci > 0) {
    lines.push('CI is green… for now.');
    lines.push('Waiting on the pipeline.');
  }
  if (owned.onCall > 0) {
    lines.push('Pager’s quiet. Suspicious.');
    lines.push('On-call rotation starts soon.');
  }
  if (owned.codeReview > 0) {
    lines.push('Need another pair of review eyes.');
  }
  return lines;
}

export function stageLines(stageId: SceneStageId): string[] {
  switch (stageId) {
    case 'solo':
      return ['Just me and the backlog.', 'Quiet office today.'];
    case 'small-team':
      return ['Small team, big tickets.', 'We’re starting to fill desks.'];
    case 'open-plan':
      return [
        'Open-plan vibes intensifying.',
        'Anyone else hear three standups?',
      ];
    case 'crowded':
      return ['Crowded already?', 'Can barely see the floor from here.'];
    case 'empty':
    default:
      return [];
  }
}

/** Light tokens/s band jokes — only when production is noticeably moving. */
export function rateLines(tokensPerSecond: number): string[] {
  if (!Number.isFinite(tokensPerSecond) || tokensPerSecond < 1) {
    return [];
  }
  if (tokensPerSecond < 10) {
    return ['Tokens are trickling in.', 'Slow and steady ship.'];
  }
  if (tokensPerSecond < 100) {
    return ['Tokens/s looking healthy.', 'Automation is earning its keep.'];
  }
  return ['Tokens/s is spicy today.', 'We’re printing tokens now.'];
}

/** Place-specific one-liners beyond the shared room line pool. */
export function roomFlavorLines(roomId: RoomId): string[] {
  switch (roomId) {
    case 'break-room':
      return ['Break room diplomacy underway.', 'Mug council is in session.'];
    case 'review-lab':
      return ['Diff theater tonight.', 'Approve with kindness.'];
    case 'ops-bay':
      return ['Bay is watching the graphs.', 'Canary looks calm.'];
    case 'datacenter':
      return ['Cold aisle banter.', 'Permanent map flex.'];
    case 'office':
    default:
      return [];
  }
}

/**
 * Prefer room-relevant specialty buckets first (still random among available).
 * Ops / review / break bias github+contributor; office stays balanced.
 */
function preferredCategories(roomId: RoomId): readonly SpecialtyCategory[] {
  switch (roomId) {
    case 'break-room':
      return ['room', 'contributor', 'calendar', 'owned-upgrade', 'github'];
    case 'review-lab':
      return ['github', 'contributor', 'room', 'owned-upgrade', 'stage'];
    case 'ops-bay':
      return ['github', 'owned-upgrade', 'room', 'rate', 'contributor'];
    case 'datacenter':
      return ['contributor', 'github', 'room', 'rate', 'stage'];
    case 'office':
    default:
      return [
        'github',
        'contributor',
        'calendar',
        'owned-upgrade',
        'stage',
        'rate',
        'room',
      ];
  }
}

function availableCategories(
  context: TalkContext,
  openIssues: readonly OpenIssueSnapshot[],
  contributorNames: readonly string[],
): SpecialtyCategory[] {
  const cats: SpecialtyCategory[] = [];
  if (openIssues.length > 0) {
    cats.push('github');
  }
  if (contributorNames.some((name) => name.trim().length > 0)) {
    cats.push('contributor');
  }
  if (calendarLines(context.now).length > 0) {
    cats.push('calendar');
  }
  if (ownedUpgradeLines(context.owned).length > 0) {
    cats.push('owned-upgrade');
  }
  if (stageLines(context.stageId).length > 0) {
    cats.push('stage');
  }
  if (rateLines(context.tokensPerSecond).length > 0) {
    cats.push('rate');
  }
  if (roomFlavorLines(context.roomId).length > 0) {
    cats.push('room');
  }
  return cats;
}

function linesForCategory(
  category: SpecialtyCategory,
  context: TalkContext,
  openIssues: readonly OpenIssueSnapshot[],
  contributorNames: readonly string[],
): string[] {
  switch (category) {
    case 'github':
      return githubIssueLines(openIssues, context.roomId);
    case 'contributor':
      return contributorLines(contributorNames, context.roomId);
    case 'calendar':
      return calendarLines(context.now);
    case 'owned-upgrade':
      return ownedUpgradeLines(context.owned);
    case 'stage':
      return stageLines(context.stageId);
    case 'rate':
      return rateLines(context.tokensPerSecond);
    case 'room':
      return roomFlavorLines(context.roomId);
  }
}

function pickPreferredCategory(
  available: readonly SpecialtyCategory[],
  roomId: RoomId,
  random: () => number,
): SpecialtyCategory | undefined {
  if (available.length === 0) {
    return undefined;
  }
  const preferred = preferredCategories(roomId).filter((cat) =>
    available.includes(cat),
  );
  const pool = preferred.length > 0 ? preferred : available;
  // Weight the first half of the preferred list a bit heavier.
  if (pool.length >= 2 && random() < 0.55) {
    const front = pool.slice(0, Math.ceil(pool.length / 2));
    return pickFrom(front, random);
  }
  return pickFrom(pool, random);
}

/**
 * Build one specialty line, or `null` if nothing applies / all excluded.
 */
export function pickSpecialtyLine(options: PickOptions): string | null {
  const random = options.random ?? Math.random;
  const openIssues = options.openIssues ?? OPEN_ISSUES_SNAPSHOT;
  const contributorNames = options.contributorNames ?? TALK_CONTRIBUTOR_NAMES;
  const exclude = options.exclude ?? new Set<string>();

  const categories = availableCategories(
    options.context,
    openIssues,
    contributorNames,
  );
  if (categories.length === 0) {
    return null;
  }

  const category = pickPreferredCategory(
    categories,
    options.context.roomId,
    random,
  );
  if (!category) {
    return null;
  }

  const pool = linesForCategory(
    category,
    options.context,
    openIssues,
    contributorNames,
  ).filter((line) => !exclude.has(line));

  const source =
    pool.length > 0
      ? pool
      : linesForCategory(
          category,
          options.context,
          openIssues,
          contributorNames,
        );

  return pickFrom(source, random) ?? null;
}

/**
 * Prefer a rare specialty line; otherwise a room-flavored generic line.
 */
export function pickTalkLine(options: PickOptions): string {
  const random = options.random ?? Math.random;
  const exclude = options.exclude ?? new Set<string>();
  const lines = roomLines(options.context.roomId);

  if (random() < SPECIALTY_LINE_CHANCE) {
    const specialty = pickSpecialtyLine({ ...options, random });
    if (specialty !== null) {
      return specialty;
    }
  }

  const pool = lines.filter((line) => !exclude.has(line));
  const source = pool.length > 0 ? pool : [...lines];
  return pickFrom(source, random) ?? lines[0]!;
}

/**
 * Full bubble pick: rare emotional peak, else neutral specialty / room line.
 */
export function pickTalkBubble(options: PickOptions): TalkBubbleContent {
  const random = options.random ?? Math.random;
  const openIssues = options.openIssues ?? OPEN_ISSUES_SNAPSHOT;
  const contributorNames = options.contributorNames ?? TALK_CONTRIBUTOR_NAMES;

  const peak = pickEmotionalPeak({
    exclude: options.exclude,
    openIssues,
    contributorNames,
    random,
  });
  if (peak !== null) {
    return peak;
  }

  return {
    text: pickTalkLine({ ...options, random }),
    mood: 'neutral' satisfies TalkMood,
  };
}

export type { TalkBubbleContent, TalkMood };
