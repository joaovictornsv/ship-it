import type { UpgradeId } from '../../data/upgrades';

/**
 * Stub until living office (#7).
 * Shop / buy paths may call this after a successful purchase; no scene yet.
 */
export function onUpgradeOwnedChanged(id: UpgradeId, owned: number): void {
  void id;
  void owned;
  // Scene presence (Dev sprites, props) lands in issue #7.
}
