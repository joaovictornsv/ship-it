import { upgrades } from '../../data/upgrades';
import { ShopRow } from './ShopRow';

/**
 * Desktop right-rail shop (stacked under play area below `lg` until #8 drawer).
 */
export function ShopRail() {
  return (
    <aside
      className="flex w-full flex-col gap-3 lg:w-80 lg:shrink-0 lg:self-stretch"
      aria-label="Shop"
    >
      <div className="flex items-baseline justify-between gap-2 px-0.5">
        <h2 className="text-base font-semibold tracking-tight text-[var(--ship-ink)]">
          Shop
        </h2>
        <p className="text-xs text-[var(--ship-muted)]">tokens/s producers</p>
      </div>
      <ul className="flex list-none flex-col gap-3 p-0">
        {upgrades.map((upgrade) => (
          <li key={upgrade.id}>
            <ShopRow upgrade={upgrade} />
          </li>
        ))}
      </ul>
    </aside>
  );
}
