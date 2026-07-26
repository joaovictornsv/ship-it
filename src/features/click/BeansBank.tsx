import { useGameStore } from '../../game/state';

function formatBeans(beans: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(
    beans,
  );
}

/** Header (or equivalent) coffee-bean bank display. */
export function BeansBank() {
  const beans = useGameStore((state) => state.beans);

  return (
    <p className="text-sm tabular-nums text-black/70" aria-live="polite">
      <span className="font-semibold text-[var(--ship-ink)]">
        {formatBeans(beans)}
      </span>{' '}
      {beans === 1 ? 'bean' : 'beans'}
    </p>
  );
}
