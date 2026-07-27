import { useEffect, useId, useRef, useState } from 'react';
import { Info } from 'lucide-react';
import type { OfficeThemeDef } from '../../data/officeThemes';
import { formatTokensCompact } from '../../game/format';
import { useGameStore } from '../../game/state';
import { officeThemeCost } from '../../game/themes';

type ShopThemeRowProps = {
  theme: OfficeThemeDef;
};

/**
 * Office theme row: buy with tokens when locked; equip when owned.
 * Scan-first: emoji · name · cost/buy or Equip / Equipped.
 */
export function ShopThemeRow({ theme }: ShopThemeRowProps) {
  const tokens = useGameStore((s) => s.tokens);
  const owned = useGameStore((s) => s.themesOwned[theme.name] === true);
  const equipped = useGameStore((s) => s.activeTheme === theme.name);
  const buyOfficeTheme = useGameStore((s) => s.buyOfficeTheme);
  const setActiveTheme = useGameStore((s) => s.setActiveTheme);
  const cost = officeThemeCost(theme.name);
  const isFree = cost === 0;
  const canBuy = !owned && !isFree && tokens >= cost;
  const detailsId = useId();
  const detailsRef = useRef<HTMLDivElement>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [actionFlash, setActionFlash] = useState(false);

  useEffect(() => {
    if (!detailsOpen) {
      return;
    }
    function onPointerDown(event: PointerEvent) {
      const root = detailsRef.current;
      if (!root || root.contains(event.target as Node)) {
        return;
      }
      setDetailsOpen(false);
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [detailsOpen]);

  function flash() {
    setActionFlash(false);
    requestAnimationFrame(() => {
      setActionFlash(true);
    });
  }

  function handleBuy() {
    if (!buyOfficeTheme(theme.name)) {
      return;
    }
    flash();
  }

  function handleEquip() {
    if (!setActiveTheme(theme.name)) {
      return;
    }
    flash();
  }

  return (
    <article
      className={[
        'rounded-xl border border-[var(--ship-line)]',
        'bg-[color-mix(in_srgb,var(--ship-bg-elevated)_88%,transparent)] px-3 py-2',
        actionFlash ? 'buy-spend-flash' : '',
        equipped
          ? 'ring-1 ring-[color-mix(in_srgb,var(--ship-accent)_35%,transparent)]'
          : '',
      ].join(' ')}
      aria-label={theme.label}
      onAnimationEnd={(event) => {
        if (event.animationName === 'buy-spend-flash') {
          setActionFlash(false);
        }
      }}
    >
      <div className="flex items-center gap-2.5">
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[var(--ship-line)] bg-[color-mix(in_srgb,var(--ship-sky)_18%,transparent)] text-lg leading-none"
          aria-hidden
        >
          {theme.emoji}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-sm font-semibold tracking-tight text-[var(--ship-ink)]">
              {theme.label}
            </h3>
            <div ref={detailsRef} className="group/info relative shrink-0">
              <button
                type="button"
                className={[
                  'flex size-7 items-center justify-center rounded-lg',
                  'text-[var(--ship-muted)] hover:bg-[color-mix(in_srgb,var(--ship-ink)_6%,transparent)]',
                  'hover:text-[var(--ship-accent-deep)]',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ship-accent)]',
                  detailsOpen ? 'text-[var(--ship-accent-deep)]' : '',
                ].join(' ')}
                aria-label={`Details for ${theme.label}`}
                aria-expanded={detailsOpen}
                aria-controls={detailsId}
                onClick={() => setDetailsOpen((open) => !open)}
              >
                <Info className="size-3.5" strokeWidth={2} aria-hidden />
              </button>
              <div
                id={detailsId}
                role="note"
                className={[
                  'absolute left-0 top-[calc(100%+0.35rem)] z-20 w-56 rounded-lg',
                  'border border-[var(--ship-line)] bg-[var(--ship-bg-elevated)] p-2.5 text-left',
                  'shadow-[0_8px_24px_color-mix(in_srgb,var(--ship-ink)_12%,transparent)]',
                  'opacity-0 pointer-events-none transition-opacity duration-150',
                  'group-hover/info:pointer-events-auto group-hover/info:opacity-100',
                  'group-focus-within/info:pointer-events-auto group-focus-within/info:opacity-100',
                  detailsOpen ? 'pointer-events-auto opacity-100' : '',
                ].join(' ')}
              >
                <p className="text-xs text-[var(--ship-muted)]">
                  {theme.blurb}
                </p>
                <p className="mt-1.5 text-xs font-semibold tabular-nums text-[var(--ship-ink)]">
                  Office look · scene only
                </p>
              </div>
            </div>
          </div>
          <p className="mt-0.5 text-xs text-[var(--ship-muted)]">
            {equipped ? 'Equipped' : owned ? 'Owned' : 'Locked'}
          </p>
        </div>

        {owned ? (
          <button
            type="button"
            className={[
              'flex shrink-0 items-center rounded-lg px-3 py-1.5 text-sm font-bold',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ship-accent)]',
              equipped
                ? 'cursor-default bg-[color-mix(in_srgb,var(--ship-accent)_16%,transparent)] text-[var(--ship-accent-deep)]'
                : 'bg-[var(--ship-accent)] text-white hover:brightness-110',
            ].join(' ')}
            disabled={equipped}
            aria-label={
              equipped ? `${theme.label} is equipped` : `Equip ${theme.label}`
            }
            onClick={handleEquip}
          >
            {equipped ? 'Equipped' : 'Equip'}
          </button>
        ) : (
          <button
            type="button"
            className={[
              'flex shrink-0 flex-col items-end gap-0.5 rounded-lg px-3 py-1.5',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ship-accent)]',
              canBuy
                ? 'bg-[var(--ship-accent)] text-white hover:brightness-110'
                : 'cursor-not-allowed bg-[color-mix(in_srgb,var(--ship-ink)_8%,transparent)] text-[color-mix(in_srgb,var(--ship-muted)_70%,transparent)]',
            ].join(' ')}
            disabled={!canBuy}
            aria-label={`Buy ${theme.label} for ${formatTokensCompact(cost)} tokens`}
            onClick={handleBuy}
          >
            <span className="text-sm font-bold leading-none tabular-nums">
              {formatTokensCompact(cost)}
            </span>
          </button>
        )}
      </div>
    </article>
  );
}
