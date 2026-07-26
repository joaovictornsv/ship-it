import {
  BellRing,
  Coffee,
  GitPullRequest,
  LaptopMinimal,
  Workflow,
  type LucideIcon,
} from 'lucide-react';
import type { UpgradeIconId } from '../../data/upgrades';

const ICONS: Record<UpgradeIconId, LucideIcon> = {
  coffee: Coffee,
  dev: LaptopMinimal,
  'code-review': GitPullRequest,
  'ci-cd': Workflow,
  'on-call': BellRing,
};

type ShopUpgradeIconProps = {
  icon: UpgradeIconId;
  className?: string;
};

/** Free-license Lucide glyph for a shop row. */
export function ShopUpgradeIcon({ icon, className }: ShopUpgradeIconProps) {
  const Icon = ICONS[icon];
  return (
    <Icon
      aria-hidden
      className={className ?? 'size-5 shrink-0 text-[var(--ship-accent)]'}
      strokeWidth={1.75}
    />
  );
}
