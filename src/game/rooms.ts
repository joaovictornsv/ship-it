/**
 * Pure room unlock helpers — no store / DOM.
 */

import {
  DEFAULT_ROOM_ID,
  getRoom,
  getRoomByName,
  rooms,
  type RoomId,
  type RoomUnlockGoal,
} from '../data/rooms';
import type { GameState, OwnedRooms, OwnedUpgrades } from './types';

/** Slice of game state used for room unlock evaluation. */
export type RoomSnapshot = {
  owned: OwnedUpgrades;
  rewrites: number;
};

export function roomSnapshotFromState(
  state: Pick<GameState, 'owned' | 'rewrites'>,
): RoomSnapshot {
  return {
    owned: state.owned,
    rewrites: state.rewrites,
  };
}

/** Whether a single unlock goal is met against the snapshot. */
export function isRoomGoalMet(
  goal: RoomUnlockGoal,
  snap: RoomSnapshot,
): boolean {
  switch (goal.kind) {
    case 'always':
      return true;
    case 'owned':
      return (snap.owned[goal.upgradeId] ?? 0) >= goal.threshold;
    case 'rewrites':
      return snap.rewrites >= goal.threshold;
    default: {
      const _exhaustive: never = goal;
      return _exhaustive;
    }
  }
}

export function isRoomUnlockConditionMet(
  id: RoomId,
  snap: RoomSnapshot,
): boolean {
  return isRoomGoalMet(getRoom(id).unlock, snap);
}

/**
 * Rooms newly eligible that are not yet in `unlocked`.
 * Office is always included when missing.
 */
export function newlyUnlockedRooms(
  snap: RoomSnapshot,
  unlocked: OwnedRooms,
): RoomId[] {
  const next: RoomId[] = [];
  for (const room of rooms) {
    if (unlocked[room.name] === true) {
      continue;
    }
    if (isRoomGoalMet(room.unlock, snap)) {
      next.push(room.name);
    }
  }
  return next;
}

export function mergeUnlockedRooms(
  current: OwnedRooms,
  newly: readonly RoomId[],
): OwnedRooms {
  if (newly.length === 0) {
    return current;
  }
  const merged: OwnedRooms = { ...current };
  for (const id of newly) {
    merged[id] = true;
  }
  return merged;
}

/** Ensure office is present; drop unknown ids for play (warnings happen in parse). */
export function ensureOfficeUnlocked(unlocked: OwnedRooms): OwnedRooms {
  if (unlocked[DEFAULT_ROOM_ID] === true) {
    return unlocked;
  }
  return { ...unlocked, [DEFAULT_ROOM_ID]: true };
}

/**
 * Pick a valid active room: keep current if unlocked, else highest unlocked
 * by catalog order, else office.
 */
export function resolveActiveRoom(
  activeRoom: string | null | undefined,
  unlocked: OwnedRooms,
): RoomId {
  const safe = ensureOfficeUnlocked(unlocked);
  const current = getRoomByName(activeRoom);
  if (current && safe[current.name] === true) {
    return current.name;
  }
  let best: RoomId = DEFAULT_ROOM_ID;
  for (const room of rooms) {
    if (safe[room.name] === true) {
      best = room.name;
    }
  }
  return best;
}

/**
 * When new rooms unlock, prefer the highest-index newly unlocked room as the
 * active stage so progression feels visible.
 */
export function activeRoomAfterUnlocks(
  currentActive: RoomId,
  newly: readonly RoomId[],
  unlocked: OwnedRooms,
): RoomId {
  if (newly.length === 0) {
    return resolveActiveRoom(currentActive, unlocked);
  }
  let best = newly[0]!;
  for (const id of newly) {
    if (getRoom(id).index > getRoom(best).index) {
      best = id;
    }
  }
  return resolveActiveRoom(best, unlocked);
}

/** CSS modifier class for the active room (`office-room-break-room`, …). */
export function roomSceneClass(id: RoomId): string {
  return `office-room-${id}`;
}
