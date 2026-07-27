/**
 * Unlockable scene rooms — office → later spaces (PRODUCT / issue #11).
 * IDs are stable; do not rename without a save migrator.
 */

import { createEnum, getEnumByName } from '../lib/createEnum';
import { PEOPLE_DEV_EMOJIS } from './devEmojis';
import {
  CI_CD_ID,
  CODE_REVIEW_ID,
  ESPRESSO_MACHINE_ID,
  type UpgradeId,
} from './upgrades';

/** Unlock predicates evaluated against live run + prestige counters. */
export type RoomUnlockGoal =
  | { kind: 'always' }
  | { kind: 'owned'; upgradeId: UpgradeId; threshold: number }
  | { kind: 'rewrites'; threshold: number };

export type RoomFields = {
  /** Short English label for tabs / a11y. */
  label: string;
  /** One-line tease for empty-state / docs. */
  blurb: string;
  /** Stage glyph (emoji) — scene warmth, not shell chrome. */
  emoji: string;
  /** Empty-office hint when this room is active and Dev owned = 0. */
  emptyHint: string;
  /** Emoji pool for fallback Dev sprites in this room (people only). */
  devEmojis: readonly string[];
  /** Wall strip under `public/` (e.g. `/office/rooms/office-wall.jpeg`). */
  backgroundWallSrc?: string;
  /** Floor strip under `public/` (e.g. `/office/rooms/office-floor.jpeg`). */
  backgroundFloorSrc?: string;
  unlock: RoomUnlockGoal;
};

export const Rooms = createEnum({
  office: {
    label: 'Office',
    blurb: 'Where features pretend to ship.',
    emoji: '🏢',
    emptyHint: 'Empty office — hire Devs to fill the desks.',
    devEmojis: PEOPLE_DEV_EMOJIS.slice(0, 6),
    backgroundWallSrc: '/office/rooms/office-wall.jpeg',
    backgroundFloorSrc: '/office/rooms/office-floor.jpeg',
    unlock: { kind: 'always' },
  },
  'break-room': {
    label: 'Break room',
    blurb: 'Espresso first, standup later.',
    emoji: '☕',
    emptyHint: 'Quiet break room — hire Devs to fill the seats.',
    devEmojis: ['👨‍💻', '👩‍💻', '🧑‍💻', '🧘', '😴', '🤓'],
    unlock: {
      kind: 'owned',
      upgradeId: ESPRESSO_MACHINE_ID,
      threshold: 1,
    },
  },
  'review-lab': {
    label: 'Review lab',
    blurb: 'Two eyes, one LGTM.',
    emoji: '👀',
    emptyHint: 'Review lab is empty — hire Devs to fill the desks.',
    devEmojis: ['🤔', '🧐', '👨‍💻', '👩‍💻', '🧑‍💻', '🤓'],
    unlock: {
      kind: 'owned',
      upgradeId: CODE_REVIEW_ID,
      threshold: 1,
    },
  },
  'ops-bay': {
    label: 'Ops bay',
    blurb: 'Green checks and pager jokes.',
    emoji: '🚨',
    emptyHint: 'Ops bay is quiet — hire Devs before the pager rings.',
    devEmojis: ['👩‍💻', '🧑‍🔧', '👨‍💻', '👩‍🔧', '👨‍🔧', '🧑‍💻'],
    unlock: {
      kind: 'owned',
      upgradeId: CI_CD_ID,
      threshold: 1,
    },
  },
  datacenter: {
    label: 'Datacenter',
    blurb: 'Permanent floor after a Rewrite.',
    emoji: '🖥️',
    emptyHint: 'Datacenter racks wait — hire Devs to fill the floor.',
    devEmojis: ['🧑‍💻', '👨‍💻', '👩‍💻', '🤓', '🧑‍🔧', '👩‍🔧'],
    unlock: { kind: 'rewrites', threshold: 1 },
  },
});

export type RoomId = keyof typeof Rooms;

export type RoomDef = (typeof Rooms)[RoomId];

/** Ordered ascending by catalog index (office → datacenter). */
export const rooms: readonly RoomDef[] = Object.values(Rooms).sort(
  (a, b) => a.index - b.index,
);

export function getRoom(id: RoomId): RoomDef {
  return Rooms[id];
}

export function getRoomByName(name: string | null | undefined): RoomDef | null {
  return getEnumByName(Rooms, name);
}

/** Starting room — always unlocked. */
export const DEFAULT_ROOM_ID: RoomId = Rooms.office.name;
