import { ShopCatalog } from './ShopCatalog';

/**
 * Desktop right-rail shop (`lg` and up). Mobile uses `ShopDrawer` instead.
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
        <p className="text-xs text-[var(--ship-muted)]">
          buildings + ship + themes
        </p>
      </div>
      <ShopCatalog />
    </aside>
  );
}
