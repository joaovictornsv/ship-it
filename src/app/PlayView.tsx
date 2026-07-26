import { ShipItButton } from '../features/click';
import { OfficeScene } from '../features/scene';
import { ShopDrawer, ShopRail } from '../features/shop';
import { DESKTOP_MEDIA_QUERY } from './breakpoints';
import { useMediaQuery } from './useMediaQuery';

/**
 * Primary clicker + living office + shop layout (no export/import chrome).
 * Below `lg`: Ship It first paint + closed shop drawer. At `lg+`: right-rail shop.
 */
export function PlayView() {
  const isDesktop = useMediaQuery(DESKTOP_MEDIA_QUERY);

  return (
    <main
      className={[
        'mx-auto flex w-full max-w-6xl flex-1 gap-8 px-4 py-10',
        isDesktop
          ? 'flex-row items-start justify-between gap-10'
          : 'flex-col pb-28',
      ].join(' ')}
    >
      <div
        className={[
          'flex flex-1 flex-col items-center justify-center gap-8 text-center',
          isDesktop ? 'min-h-[min(70vh,36rem)]' : '',
        ].join(' ')}
      >
        <div className="flex flex-col items-center gap-2">
          <h1 className="sr-only">Ship It</h1>
          <p className="max-w-sm text-base text-[var(--ship-muted)]">
            Click to earn tokens. Hire Devs and buy tools for tokens/s.
          </p>
        </div>
        <OfficeScene />
        <ShipItButton />
      </div>
      {isDesktop ? <ShopRail /> : <ShopDrawer />}
    </main>
  );
}
