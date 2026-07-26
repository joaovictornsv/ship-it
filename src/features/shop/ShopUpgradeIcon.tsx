type ShopUpgradeIconProps = {
  emoji: string;
  className?: string;
};

/** Warm emoji glyph for a shop row (scene uses the same catalog fields). */
export function ShopUpgradeIcon({ emoji, className }: ShopUpgradeIconProps) {
  return (
    <span aria-hidden className={className ?? 'text-lg leading-none'}>
      {emoji}
    </span>
  );
}
