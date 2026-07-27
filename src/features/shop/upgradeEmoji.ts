import { DEFAULT_ROOM_ID, getRoom, type RoomId } from '../../data/rooms';
import { DEFAULT_DEV_EMOJIS, PEOPLE_DEV_EMOJIS } from '../../data/devEmojis';

/** Default office Dev face pool (re-export for shop / docs). */
export const DEV_EMOJIS = DEFAULT_DEV_EMOJIS;

export { PEOPLE_DEV_EMOJIS };

/** Stable emoji glyph for desk index in the active room pool. */
export function devEmojiForIndex(
  index: number,
  roomId: RoomId = DEFAULT_ROOM_ID,
): string {
  const pool = getRoom(roomId).devEmojis;
  const i = ((index % pool.length) + pool.length) % pool.length;
  return pool[i]!;
}
