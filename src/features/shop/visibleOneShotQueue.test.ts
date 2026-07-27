import { describe, expect, it } from 'vitest';
import { DOUBLE_SHOT_ID } from '../../data/buildingUpgrades';
import { RUBBER_DUCK_ID } from '../../data/shipUpgrades';
import { ESPRESSO_MACHINE_ID } from '../../data/upgrades';
import { visibleOneShotQueue } from './visibleOneShotQueue';

describe('visibleOneShotQueue', () => {
  it('is empty with no buildings owned', () => {
    expect(visibleOneShotQueue({}, {}, {})).toEqual([]);
  });

  it('interleaves ship and building upgrades by cost', () => {
    const queue = visibleOneShotQueue({ [ESPRESSO_MACHINE_ID]: 1 }, {}, {});
    expect(queue.map((item) => item.upgrade.id)).toEqual([
      RUBBER_DUCK_ID,
      DOUBLE_SHOT_ID,
    ]);
    expect(queue[0]?.kind).toBe('ship');
    expect(queue[1]?.kind).toBe('building');
  });

  it('omits owned building upgrades and advances the ship ladder', () => {
    const queue = visibleOneShotQueue(
      { [ESPRESSO_MACHINE_ID]: 1 },
      { [RUBBER_DUCK_ID]: true },
      { [DOUBLE_SHOT_ID]: true },
    );
    expect(queue.every((item) => item.kind === 'ship')).toBe(true);
    expect(queue.some((item) => item.upgrade.id === DOUBLE_SHOT_ID)).toBe(
      false,
    );
  });
});
