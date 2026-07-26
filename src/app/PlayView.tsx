import { ShipItButton } from '../features/click';
import { OfficeScene } from '../features/scene';
import { ShopRail } from '../features/shop';

/** Primary clicker + living office + shop layout (no export/import chrome). */
export function PlayView() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-10 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
      <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center lg:min-h-[min(70vh,36rem)]">
        <div className="flex flex-col items-center gap-2">
          <h1 className="sr-only">Ship It</h1>
          <p className="max-w-sm text-base text-[var(--ship-muted)]">
            Click to earn tokens. Hire Devs and buy tools for tokens/s.
          </p>
        </div>
        <OfficeScene />
        <ShipItButton />
      </div>
      <ShopRail />
    </main>
  );
}
