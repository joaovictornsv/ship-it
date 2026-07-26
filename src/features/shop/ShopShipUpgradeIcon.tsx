type ShipUpgradeIconProps = {
  emoji: string;
  className?: string;
};

/** Warm emoji glyph for a Ship upgrade shop tile. */
export function ShopShipUpgradeIcon({
  emoji,
  className = 'text-lg leading-none',
}: ShipUpgradeIconProps) {
  return (
    <span className={className} aria-hidden>
      {emoji}
    </span>
  );
}
