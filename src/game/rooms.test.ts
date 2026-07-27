import { describe, expect, it } from 'vitest';
import {
  CI_CD_ID,
  CODE_REVIEW_ID,
  ESPRESSO_MACHINE_ID,
} from '../data/upgrades';
import { DEFAULT_ROOM_ID, Rooms } from '../data/rooms';
import {
  activeRoomAfterUnlocks,
  ensureOfficeUnlocked,
  isRoomUnlockConditionMet,
  mergeUnlockedRooms,
  newlyUnlockedRooms,
  resolveActiveRoom,
  roomSceneClass,
  roomSnapshotFromState,
} from './rooms';

describe('room unlock goals', () => {
  it('office is always unlocked', () => {
    expect(
      isRoomUnlockConditionMet(
        'office',
        roomSnapshotFromState({ owned: {}, rewrites: 0 }),
      ),
    ).toBe(true);
  });

  it('break-room needs an espresso', () => {
    expect(
      isRoomUnlockConditionMet(
        'break-room',
        roomSnapshotFromState({ owned: {}, rewrites: 0 }),
      ),
    ).toBe(false);
    expect(
      isRoomUnlockConditionMet(
        'break-room',
        roomSnapshotFromState({
          owned: { [ESPRESSO_MACHINE_ID]: 1 },
          rewrites: 0,
        }),
      ),
    ).toBe(true);
  });

  it('review-lab needs code review; ops-bay needs CI; datacenter needs Rewrite', () => {
    expect(
      isRoomUnlockConditionMet(
        'review-lab',
        roomSnapshotFromState({
          owned: { [CODE_REVIEW_ID]: 1 },
          rewrites: 0,
        }),
      ),
    ).toBe(true);
    expect(
      isRoomUnlockConditionMet(
        'ops-bay',
        roomSnapshotFromState({ owned: { [CI_CD_ID]: 1 }, rewrites: 0 }),
      ),
    ).toBe(true);
    expect(
      isRoomUnlockConditionMet(
        'datacenter',
        roomSnapshotFromState({ owned: {}, rewrites: 1 }),
      ),
    ).toBe(true);
  });
});

describe('newlyUnlockedRooms / merge', () => {
  it('reports only missing eligible rooms', () => {
    const snap = roomSnapshotFromState({
      owned: { [ESPRESSO_MACHINE_ID]: 2 },
      rewrites: 0,
    });
    expect(newlyUnlockedRooms(snap, {})).toEqual(['office', 'break-room']);
    expect(
      newlyUnlockedRooms(snap, { office: true, 'break-room': true }),
    ).toEqual([]);
  });

  it('merges without dropping existing unlocks', () => {
    expect(
      mergeUnlockedRooms({ office: true }, ['break-room', 'review-lab']),
    ).toEqual({
      office: true,
      'break-room': true,
      'review-lab': true,
    });
  });
});

describe('active room resolution', () => {
  it('ensures office and falls back when active is unknown', () => {
    expect(ensureOfficeUnlocked({})).toEqual({ office: true });
    expect(resolveActiveRoom('nope', { office: true })).toBe(DEFAULT_ROOM_ID);
    expect(
      resolveActiveRoom('ops-bay', {
        office: true,
        'break-room': true,
        'ops-bay': true,
      }),
    ).toBe('ops-bay');
  });

  it('after unlocks, prefers the highest newly unlocked room', () => {
    const unlocked = {
      office: true as const,
      'break-room': true as const,
      'review-lab': true as const,
    };
    expect(
      activeRoomAfterUnlocks('office', ['break-room', 'review-lab'], unlocked),
    ).toBe('review-lab');
    expect(activeRoomAfterUnlocks('office', [], unlocked)).toBe('office');
  });

  it('builds a stable CSS class from room id', () => {
    expect(roomSceneClass(Rooms['break-room'].name)).toBe(
      'office-room-break-room',
    );
  });
});
