import { useEffect, useId, useRef, useState } from 'react';
import { Info } from 'lucide-react';
import type { ShipUpgradeDef } from '../../data/shipUpgrades';
import { shipUpgradeCost } from '../../game/economy';
import { formatTokensCompact } from '../../game/format';
import { useGameStore } from '../../game/state';
import { ShopShipUpgradeIcon } from './ShopShipUpgradeIcon';
import { shipUpgradeColorVar } from './shipUpgradeColors';

type ShopShipRowProps = {
  upgrade: ShipUpgradeDef;
  /** Soft unlock gate (first producer owned). */
  unlocked: boolean;
  /** This row is the next buyable one-shot (or already owned). */
  available: boolean;
  owned: boolean;
};

/**
 * Scan-first one-shot Ship upgrade row: icon · name · Owned/Next · price/buy.
 * Blurb + effect: hover / keyboard focus / touch ⓘ toggle (never hover-only).
 */
export function ShopShipRow({
  upgrade,
  unlocked,
  available,
  owned,
}: ShopShipRowProps) {
  const tokens = useGameStore((s) => s.tokens);
  const buyShipUpgrade = useGameStore((s) => s.buyShipUpgrade);
  const cost = shipUpgradeCost(upgrade.id);
  const canBuy = unlocked && available && !owned && tokens >= cost;
  const colorVar = shipUpgradeColorVar(upgrade.id);
  const detailsId = useId();
  const detailsRef = useRef<HTMLDivElement>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [buyFlash, setBuyFlash] = useState(false);

  const effectLabel =
    upgrade.effect.kind === 'flat'
      ? `+${upgrade.effect.amount} tokens per click`
      : `×${upgrade.effect.factor} click power`;

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

  let statusLabel = 'Locked';
  if (owned) {
    statusLabel = 'Owned';
  } else if (!unlocked) {
    statusLabel = 'Buy a building first';
  } else if (available) {
    statusLabel = 'Next';
  } else {
    statusLabel = 'Locked';
  }

  return (
    <article
      className={[
        'rounded-xl border border-[var(--ship-line)]',
        'bg-[color-mix(in_srgb,var(--ship-bg-elevated)_88%,transparent)] px-3 py-2',
        buyFlash ? 'buy-spend-flash' : '',
        !owned && !available ? 'opacity-70' : '',
      ].join(' ')}
      aria-label={upgrade.name}
      onAnimationEnd={(event) => {
        if (event.animationName === 'buy-spend-flash') {
          setBuyFlash(false);
        }
      }}
    >
      <div className="flex items-center gap-2.5">
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[var(--ship-line)]"
          style={{
            background: `color-mix(in srgb, var(${colorVar}) 14%, transparent)`,
          }}
          aria-hidden
        >
          <ShopShipUpgradeIcon icon={upgrade.icon} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-sm font-semibold tracking-tight text-[var(--ship-ink)]">
              {upgrade.name}
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
                aria-label={`Details for ${upgrade.name}`}
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
                  {upgrade.blurb}
                </p>
                <p className="mt-1.5 text-xs font-semibold tabular-nums text-[var(--ship-ink)]">
                  {effectLabel}
                </p>
              </div>
            </div>
          </div>
          <p
            className="mt-0.5 text-xs font-medium text-[var(--ship-muted)]"
            aria-label={statusLabel}
          >
            {statusLabel}
          </p>
        </div>

        <button
          type="button"
          className={[
            'shrink-0 rounded-lg px-3 py-2 text-sm font-bold tabular-nums',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ship-accent)]',
            owned
              ? 'cursor-default bg-[color-mix(in_srgb,var(--ship-ink)_8%,transparent)] text-[var(--ship-muted)]'
              : canBuy
                ? 'bg-[var(--ship-accent)] text-white hover:brightness-110'
                : 'cursor-not-allowed bg-[color-mix(in_srgb,var(--ship-ink)_8%,transparent)] text-[color-mix(in_srgb,var(--ship-muted)_70%,transparent)]',
          ].join(' ')}
          disabled={owned || !canBuy}
          aria-label={
            owned
              ? `${upgrade.name} owned`
              : `Buy ${upgrade.name} for ${formatTokensCompact(cost)} tokens`
          }
          onClick={() => {
            if (!buyShipUpgrade(upgrade.id)) {
              return;
            }
            setBuyFlash(false);
            requestAnimationFrame(() => {
              setBuyFlash(true);
            });
          }}
        >
          {owned ? 'Owned' : formatTokensCompact(cost)}
        </button>
      </div>
    </article>
  );
}
