/** Scene FX pub/sub — spawn pop / stage flash without reshaping the buy path. */

import type { UpgradeId } from '../../data/upgrades';
import { DEV_ID } from '../../data/upgrades';

type SpawnListener = (payload: { id: UpgradeId; owned: number }) => void;

const spawnListeners = new Set<SpawnListener>();

export function notifyUpgradeOwnedChanged(id: UpgradeId, owned: number): void {
  spawnListeners.forEach((listener) => {
    listener({ id, owned });
  });
}

export function subscribeUpgradeOwnedChanged(
  listener: SpawnListener,
): () => void {
  spawnListeners.add(listener);
  return () => {
    spawnListeners.delete(listener);
  };
}

/** True when a Dev purchase should celebrate a new sprite spawn. */
export function isDevSpawnEvent(id: UpgradeId): boolean {
  return id === DEV_ID;
}
