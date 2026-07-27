import { describe, expect, it } from 'vitest';
import { Rooms } from '../../data/rooms';
import { DEV_EMOJIS, devEmojiForIndex } from './upgradeEmoji';

describe('devEmojiForIndex', () => {
  it('uses office pool by default', () => {
    expect(devEmojiForIndex(0)).toBe(DEV_EMOJIS[0]);
    expect(devEmojiForIndex(1)).toBe(DEV_EMOJIS[1]);
  });

  it('wraps within the active room pool', () => {
    const pool = Rooms['break-room'].devEmojis;
    expect(devEmojiForIndex(0, 'break-room')).toBe(pool[0]);
    expect(devEmojiForIndex(pool.length, 'break-room')).toBe(pool[0]);
  });

  it('returns different glyphs per room for the same index', () => {
    const office = devEmojiForIndex(2, 'office');
    const ops = devEmojiForIndex(2, 'ops-bay');
    expect(office).not.toBe(ops);
  });
});
