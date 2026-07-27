import { useEffect, useId, useRef, useState } from 'react';
import { ShoppingBag, X } from 'lucide-react';
import { useGameStore } from '../../game/state';
import { ShopCatalog } from './ShopCatalog';
import { hasAffordableShopPurchase } from './shopAffordability';
import { useBuyMode } from './useBuyMode';

/**
 * Mobile shop: closed by default so Ship It stays the first-paint primary action.
 * Opens as a bottom sheet / drawer below the Tailwind `lg` breakpoint.
 * Closed trigger shows a small affordability cue when something is buyable (#53).
 */
export function ShopDrawer() {
  const [open, setOpen] = useState(false);
  const [buyMode] = useBuyMode();
  const titleId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const tokens = useGameStore((s) => s.tokens);
  const owned = useGameStore((s) => s.owned);
  const shipOwned = useGameStore((s) => s.shipOwned);
  const buildingOwned = useGameStore((s) => s.buildingOwned);
  const hasAffordable = hasAffordableShopPurchase({
    tokens,
    owned,
    shipOwned,
    buildingOwned,
    buyMode,
  });
  // Cue only while closed — open drawer shows the catalog itself.
  const showAffordableCue = !open && hasAffordable;

  useEffect(() => {
    if (!open) {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <button
          ref={triggerRef}
          type="button"
          className={[
            'pointer-events-auto relative flex w-full max-w-md items-center justify-center gap-2',
            'rounded-xl border border-[var(--ship-line)]',
            'bg-[color-mix(in_srgb,var(--ship-bg-elevated)_94%,transparent)] px-4 py-3',
            'text-base font-semibold tracking-tight text-[var(--ship-ink)] shadow-[0_-4px_24px_color-mix(in_srgb,var(--ship-ink)_8%,transparent)]',
            'backdrop-blur-sm',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ship-accent)]',
          ].join(' ')}
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-label={
            showAffordableCue ? 'Shop, affordable purchases available' : 'Shop'
          }
          onClick={() => setOpen(true)}
        >
          <ShoppingBag
            className="size-5 shrink-0 text-[var(--ship-accent)]"
            strokeWidth={2}
            aria-hidden
          />
          Shop
          {showAffordableCue ? (
            <span
              className={[
                'absolute right-3 top-2.5 size-2.5 rounded-full',
                'bg-[var(--ship-accent)]',
                'ring-2 ring-[var(--ship-bg-elevated)]',
              ].join(' ')}
              aria-hidden
            />
          ) : null}
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-40" role="presentation">
          <button
            type="button"
            className="absolute inset-0 bg-[color-mix(in_srgb,var(--ship-ink)_40%,transparent)]"
            aria-label="Close shop"
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={[
              'shop-drawer-panel absolute inset-x-0 bottom-0 flex max-h-[min(78dvh,36rem)] flex-col',
              'overflow-x-hidden rounded-t-2xl border border-b-0 border-[var(--ship-line)]',
              'bg-[var(--ship-bg-elevated)] shadow-[0_-8px_32px_color-mix(in_srgb,var(--ship-ink)_12%,transparent)]',
              'pb-[max(1rem,env(safe-area-inset-bottom))]',
            ].join(' ')}
          >
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--ship-line)] px-4 py-3">
              <div className="min-w-0">
                <h2
                  id={titleId}
                  className="text-base font-semibold tracking-tight text-[var(--ship-ink)]"
                >
                  Shop
                </h2>
                <p className="text-xs text-[var(--ship-muted)]">
                  buildings + ship
                </p>
              </div>
              <button
                ref={closeRef}
                type="button"
                className={[
                  'inline-flex size-10 shrink-0 items-center justify-center rounded-lg',
                  'border border-[var(--ship-line)] text-[var(--ship-ink)]',
                  'hover:bg-[color-mix(in_srgb,var(--ship-ink)_6%,transparent)]',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ship-accent)]',
                ].join(' ')}
                aria-label="Close shop"
                onClick={() => setOpen(false)}
              >
                <X className="size-5" strokeWidth={2} aria-hidden />
              </button>
            </div>
            <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-3">
              <ShopCatalog />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
