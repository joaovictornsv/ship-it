import type { UpgradeIconId } from '../../data/upgrades';
import { UPGRADE_EMOJI } from './upgradeEmoji';

type ShopUpgradeIconProps = {
  icon: UpgradeIconId;
  className?: string;
};

/** Warm emoji glyph for a shop row (scene uses the same set). */
export function ShopUpgradeIcon({ icon, className }: ShopUpgradeIconProps) {
  return (
    <span aria-hidden className={className ?? 'text-lg leading-none'}>
      {UPGRADE_EMOJI[icon]}
    </span>
  );
}
