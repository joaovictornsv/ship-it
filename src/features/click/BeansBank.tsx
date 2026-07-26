import { selectBeansPerSecond, useGameStore } from '../../game/state';

function formatBeans(beans: number): string {
  const fractionDigits = Number.isInteger(beans) ? 0 : 1;
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  }).format(beans);
}

function formatRate(bps: number): string {
  if (bps === 0) return '0';
  const digits = bps < 1 ? 1 : bps < 10 ? 1 : 0;
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: digits,
    minimumFractionDigits: bps < 10 && bps > 0 ? 1 : 0,
  }).format(bps);
}

/** Header (or equivalent) coffee-bean bank + beans/s display. */
export function BeansBank() {
  const beans = useGameStore((state) => state.beans);
  const bps = useGameStore(selectBeansPerSecond);
  const beanLabel = beans === 1 ? 'bean' : 'beans';

  return (
    <div className="text-right text-sm tabular-nums text-black/70">
      <p aria-live="polite">
        <span className="font-semibold text-[var(--ship-ink)]">
          {formatBeans(beans)}
        </span>{' '}
        {beanLabel}
      </p>
      <p className="text-xs text-black/55" aria-live="polite">
        {formatRate(bps)} beans/s
      </p>
    </div>
  );
}
