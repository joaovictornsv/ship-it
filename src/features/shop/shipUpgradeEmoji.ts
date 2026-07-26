/** Emoji glyphs for Ship upgrade shop tiles + subtle Ship It CTA glyph. */

import type { ShipUpgradeIconId } from '../../data/shipUpgrades';
import { getShipUpgradeByIcon, shipUpgrades } from '../../data/shipUpgrades';

/** Icon → emoji via catalog entry (no parallel table). */
export const SHIP_UPGRADE_EMOJI: Record<ShipUpgradeIconId, string> =
  Object.fromEntries(shipUpgrades.map((u) => [u.icon, u.emoji])) as Record<
    ShipUpgradeIconId,
    string
  >;

export function shipUpgradeEmoji(icon: ShipUpgradeIconId): string {
  return getShipUpgradeByIcon(icon).emoji;
}
