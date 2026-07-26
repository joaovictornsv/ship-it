import type { UpgradeId } from '../../data/upgrades';

/**
 * Optional buy-side notify after a successful purchase.
 * Living office reads owned counts from the game store (incl. hydrate);
 * this hook stays available for future spawn FX without reshaping the buy path.
 */
export function onUpgradeOwnedChanged(id: UpgradeId, owned: number): void {
  void id;
  void owned;
}
