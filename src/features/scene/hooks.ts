import type { UpgradeId } from '../../data/upgrades';
import { notifyUpgradeOwnedChanged } from './sceneEvents';

/**
 * Buy-side notify after a successful purchase.
 * Living office reads owned counts from the game store (incl. hydrate);
 * this hook fans out spawn / celebration FX via `sceneEvents`.
 */
export function onUpgradeOwnedChanged(id: UpgradeId, owned: number): void {
  notifyUpgradeOwnedChanged(id, owned);
}
