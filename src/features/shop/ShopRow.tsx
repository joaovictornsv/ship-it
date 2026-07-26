import { useEffect, useId, useRef, useState } from 'react';
import { Info } from 'lucide-react';
import type { UpgradeDef } from '../../data/upgrades';
import { nextUpgradeCost } from '../../game/economy';
import { formatTokensCompact } from '../../game/format';
import { useGameStore } from '../../game/state';
import { onUpgradeOwnedChanged } from '../scene';
import { ShopUpgradeIcon } from './ShopUpgradeIcon';
import { upgradeColorVar } from './upgradeColors';

type ShopRowProps = {
  upgrade: UpgradeDef;
};

/**
 * Scan-first buy row: colored icon · name · Owned · price/buy.
 * Blurb + per-unit tokens/s: hover / keyboard focus / touch ⓘ toggle (never hover-only).
 */
export function ShopRow({ upgrade }: ShopRowProps) {
  const tokens = useGameStore((s) => s.tokens);
  const owned = useGameStore((s) => s.owned[upgrade.id] ?? 0);
  const buyUpgrade = useGameStore((s) => s.buyUpgrade);
  const cost = nextUpgradeCost(upgrade.id, owned);
  const canAfford = tokens >= cost;
  const colorVar = upgradeColorVar(upgrade.id);
  const detailsId = useId();
  const detailsRef = useRef<HTMLDivElement>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [buyFlash, setBuyFlash] = useState(false);

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

  return (
    <article
      className={[
        'rounded-xl border border-[var(--ship-line)]',
        'bg-[color-mix(in_srgb,var(--ship-bg-elevated)_88%,transparent)] px-3 py-2',
        buyFlash ? 'buy-spend-flash' : '',
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
          <ShopUpgradeIcon icon={upgrade.icon} />
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
                  +{upgrade.tokensPerSecond} tokens/s each
                </p>
              </div>
            </div>
          </div>
          <p className="mt-0.5 text-xs font-semibold tabular-nums text-[var(--ship-ink)]">
            Owned <span className="text-sm">×{owned}</span>
          </p>
        </div>

        <button
          type="button"
          className={[
            'shrink-0 rounded-lg px-3 py-2 text-sm font-bold tabular-nums',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ship-accent)]',
            canAfford
              ? 'bg-[var(--ship-accent)] text-white hover:brightness-110'
              : 'cursor-not-allowed bg-[color-mix(in_srgb,var(--ship-ink)_8%,transparent)] text-[color-mix(in_srgb,var(--ship-muted)_70%,transparent)]',
          ].join(' ')}
          disabled={!canAfford}
          aria-label={`Buy ${upgrade.name} for ${formatTokensCompact(cost)} tokens`}
          onClick={() => {
            if (!buyUpgrade(upgrade.id)) {
              return;
            }
            setBuyFlash(false);
            requestAnimationFrame(() => {
              setBuyFlash(true);
            });
            const nextOwned = useGameStore.getState().owned[upgrade.id] ?? 0;
            onUpgradeOwnedChanged(upgrade.id, nextOwned);
          }}
        >
          {formatTokensCompact(cost)}
        </button>
      </div>
    </article>
  );
}
