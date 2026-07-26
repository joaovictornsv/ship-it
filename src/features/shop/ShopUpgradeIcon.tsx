import {
  BellRing,
  Coffee,
  GitPullRequest,
  LaptopMinimal,
  Workflow,
  type LucideIcon,
} from 'lucide-react';
import type { UpgradeIconId } from '../../data/upgrades';
import { upgradeIconColorVar } from './upgradeColors';

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

/** Free-license Lucide glyph for a shop row, tinted per upgrade. */
export function ShopUpgradeIcon({ icon, className }: ShopUpgradeIconProps) {
  const Icon = ICONS[icon];
  const colorVar = upgradeIconColorVar(icon);
  return (
    <Icon
      aria-hidden
      className={className ?? 'size-5 shrink-0'}
      style={className ? undefined : { color: `var(${colorVar})` }}
      strokeWidth={1.75}
    />
  );
}
