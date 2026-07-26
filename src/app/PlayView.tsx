import { ShipItButton, TokensBank } from '../features/click';
import { OfficeScene } from '../features/scene';
import { ShopDrawer, ShopRail } from '../features/shop';
import { DESKTOP_MEDIA_QUERY } from './breakpoints';
import { PlayTip } from './PlayTip';
import { useMediaQuery } from './useMediaQuery';

/**
 * Primary clicker + living office + shop layout (no export/import chrome).
 * Below `lg`: Ship It first paint + closed shop drawer. At `lg+`: right-rail shop.
 * Currency HUD docks on the Ship It cluster (PRODUCT §4); scene is the stage.
 */
export function PlayView() {
  const isDesktop = useMediaQuery(DESKTOP_MEDIA_QUERY);

  return (
    <main
      className={[
        'mx-auto flex w-full max-w-6xl flex-1 gap-8 px-4 py-8',
        isDesktop
          ? 'flex-row items-start justify-between gap-10'
          : 'flex-col pb-28',
      ].join(' ')}
    >
      <div
        className={[
          'flex flex-1 flex-col items-center gap-5 text-center',
          isDesktop ? 'min-h-[min(78vh,42rem)] justify-center' : '',
        ].join(' ')}
      >
        <h1 className="sr-only">Ship It</h1>
        <OfficeScene />
        <div className="flex w-full max-w-md flex-col items-center gap-3">
          <TokensBank />
          <ShipItButton />
          <PlayTip />
        </div>
      </div>
      {isDesktop ? <ShopRail /> : <ShopDrawer />}
    </main>
  );
}
