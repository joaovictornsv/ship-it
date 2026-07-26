import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Info } from 'lucide-react';
import { shipUpgradeEffectLabel } from '../../data/shipUpgrades';
import type { ShipUpgradeDef } from '../../data/shipUpgrades';
import { shipUpgradeCost } from '../../game/economy';
import { formatTokensCompact } from '../../game/format';
import { useGameStore } from '../../game/state';
import { ShopShipUpgradeIcon } from './ShopShipUpgradeIcon';

type ShopShipTileProps = {
  upgrade: ShipUpgradeDef;
};

type TipPos = { top: number; left: number };

/**
 * Compact Cookie-style Ship upgrade tile for the available (not owned) queue.
 * Buy control + ⓘ tooltip (hover / focus / touch). Tooltip portals to `body`
 * so shop overflow does not clip it.
 */
export function ShopShipTile({ upgrade }: ShopShipTileProps) {
  const tokens = useGameStore((s) => s.tokens);
  const buyShipUpgrade = useGameStore((s) => s.buyShipUpgrade);
  const cost = shipUpgradeCost(upgrade.id);
  const canBuy = tokens >= cost;
  const colorVar = upgrade.colorVar;
  const tipId = useId();
  const anchorRef = useRef<HTMLDivElement>(null);
  const tipPanelRef = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [buyFlash, setBuyFlash] = useState(false);
  const [pos, setPos] = useState<TipPos | null>(null);

  const tipVisible = pinned || hovered;

  const effectLabel = shipUpgradeEffectLabel(upgrade.effect);

  function updatePos() {
    const anchor = anchorRef.current;
    if (!anchor) {
      return;
    }
    const rect = anchor.getBoundingClientRect();
    const width = 208; // w-52
    const left = Math.min(
      Math.max(8, rect.left),
      window.innerWidth - width - 8,
    );
    const top = rect.bottom + 8;
    setPos({ top, left });
  }

  useLayoutEffect(() => {
    if (!tipVisible) {
      return;
    }
    updatePos();
  }, [tipVisible]);

  useEffect(() => {
    if (!tipVisible) {
      return;
    }
    function onReposition() {
      updatePos();
    }
    window.addEventListener('resize', onReposition);
    window.addEventListener('scroll', onReposition, true);
    return () => {
      window.removeEventListener('resize', onReposition);
      window.removeEventListener('scroll', onReposition, true);
    };
  }, [tipVisible]);

  useEffect(() => {
    if (!pinned) {
      return;
    }
    function onPointerDown(event: PointerEvent) {
      const anchor = anchorRef.current;
      const panel = tipPanelRef.current;
      const target = event.target as Node;
      if (anchor?.contains(target) || panel?.contains(target)) {
        return;
      }
      setPinned(false);
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [pinned]);

  function handleBuy() {
    if (!buyShipUpgrade(upgrade.id)) {
      return;
    }
    setBuyFlash(false);
    requestAnimationFrame(() => {
      setBuyFlash(true);
    });
  }

  const tooltip =
    tipVisible && pos && typeof document !== 'undefined'
      ? createPortal(
          <div
            ref={tipPanelRef}
            id={tipId}
            role="tooltip"
            className={[
              'fixed z-[80] w-52 rounded-lg border border-[var(--ship-line)]',
              'bg-[var(--ship-bg-elevated)] p-2.5 text-left',
              'shadow-[0_8px_24px_color-mix(in_srgb,var(--ship-ink)_12%,transparent)]',
            ].join(' ')}
            style={{ top: pos.top, left: pos.left }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <p className="text-xs font-semibold tracking-tight text-[var(--ship-ink)]">
              {upgrade.name}
            </p>
            <p className="mt-1 text-xs text-[var(--ship-muted)]">
              {upgrade.blurb}
            </p>
            <p className="mt-1.5 text-xs font-semibold tabular-nums text-[var(--ship-ink)]">
              {effectLabel}
            </p>
            <p className="mt-1 text-xs text-[var(--ship-muted)]">
              CTA becomes{' '}
              <span className="font-semibold text-[var(--ship-ink)]">
                {upgrade.ctaLabel}
              </span>
            </p>
          </div>,
          document.body,
        )
      : null;

  return (
    <div
      ref={anchorRef}
      className="relative shrink-0"
      onMouseEnter={() => {
        setHovered(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
      }}
      onFocusCapture={() => {
        setHovered(true);
      }}
      onBlurCapture={(event) => {
        const next = event.relatedTarget as Node | null;
        if (
          anchorRef.current?.contains(next) ||
          tipPanelRef.current?.contains(next)
        ) {
          return;
        }
        setHovered(false);
      }}
    >
      <button
        type="button"
        className={[
          'relative flex w-[4.75rem] flex-col items-center gap-1 rounded-xl border border-[var(--ship-line)] px-1.5 py-2',
          'bg-[color-mix(in_srgb,var(--ship-bg-elevated)_88%,transparent)]',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ship-accent)]',
          buyFlash ? 'buy-spend-flash' : '',
          canBuy ? 'hover:brightness-[1.03]' : 'opacity-60',
        ].join(' ')}
        aria-describedby={tipVisible ? tipId : undefined}
        aria-label={`Buy ${upgrade.name} for ${formatTokensCompact(cost)} tokens`}
        disabled={!canBuy}
        onClick={handleBuy}
        onAnimationEnd={(event) => {
          if (event.animationName === 'buy-spend-flash') {
            setBuyFlash(false);
          }
        }}
      >
        <div
          className="flex size-9 items-center justify-center rounded-lg border border-[var(--ship-line)]"
          style={{
            background: `color-mix(in srgb, var(${colorVar}) 14%, transparent)`,
          }}
          aria-hidden
        >
          <ShopShipUpgradeIcon emoji={upgrade.emoji} />
        </div>
        <span className="max-w-full truncate text-[0.65rem] font-semibold leading-tight text-[var(--ship-ink)]">
          {upgrade.name}
        </span>
        <span
          className={[
            'text-[0.7rem] font-bold tabular-nums',
            canBuy
              ? 'text-[var(--ship-accent-deep)]'
              : 'text-[var(--ship-muted)]',
          ].join(' ')}
        >
          {formatTokensCompact(cost)}
        </span>
      </button>

      <button
        type="button"
        className={[
          'absolute -right-1 -top-1 z-10 flex size-6 items-center justify-center rounded-full',
          'border border-[var(--ship-line)] bg-[var(--ship-bg-elevated)]',
          'text-[var(--ship-muted)] hover:text-[var(--ship-accent-deep)]',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ship-accent)]',
          pinned ? 'text-[var(--ship-accent-deep)]' : '',
        ].join(' ')}
        aria-label={`Details for ${upgrade.name}`}
        aria-expanded={tipVisible}
        aria-controls={tipId}
        onClick={(event) => {
          event.stopPropagation();
          setPinned((open) => !open);
        }}
      >
        <Info className="size-3" strokeWidth={2} aria-hidden />
      </button>

      {tooltip}
    </div>
  );
}
