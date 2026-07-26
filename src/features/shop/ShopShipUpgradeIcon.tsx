import type { ShipUpgradeIconId } from '../../data/shipUpgrades';
import { SHIP_UPGRADE_EMOJI } from './shipUpgradeEmoji';

type ShipUpgradeIconProps = {
  icon: ShipUpgradeIconId;
  className?: string;
};

/** Warm emoji glyph for a Ship upgrade shop row. */
export function ShopShipUpgradeIcon({
  icon,
  className = 'text-lg leading-none',
}: ShipUpgradeIconProps) {
  return (
    <span className={className} aria-hidden>
      {SHIP_UPGRADE_EMOJI[icon]}
    </span>
  );
}
