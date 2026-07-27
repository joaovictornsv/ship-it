import { BUY_MODE_ORDER, BuyModes, type BuyModeName } from './buyMode';

type ShopBuyModeControlProps = {
  mode: BuyModeName;
  onChange: (mode: BuyModeName) => void;
};

/**
 * Compact ×1 / ×10 / ×100 / Max control for building rows.
 * Lives in shop chrome (rail + drawer), not the first-paint play column.
 */
export function ShopBuyModeControl({
  mode,
  onChange,
}: ShopBuyModeControlProps) {
  return (
    <div
      className="flex flex-wrap items-center gap-1.5"
      role="group"
      aria-label="Buy amount"
    >
      {BUY_MODE_ORDER.map((name) => {
        const entry = BuyModes[name];
        const selected = mode === name;
        return (
          <button
            key={name}
            type="button"
            className={[
              'rounded-lg px-2 py-1 text-xs font-semibold tabular-nums',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ship-accent)]',
              selected
                ? 'bg-[var(--ship-accent)] text-white'
                : [
                    'border border-[var(--ship-line)] text-[var(--ship-ink)]',
                    'bg-[color-mix(in_srgb,var(--ship-bg-elevated)_88%,transparent)]',
                    'hover:bg-[color-mix(in_srgb,var(--ship-ink)_6%,transparent)]',
                  ].join(' '),
            ].join(' ')}
            aria-pressed={selected}
            onClick={() => {
              onChange(name);
            }}
          >
            {entry.label}
          </button>
        );
      })}
    </div>
  );
}
