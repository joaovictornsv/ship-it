import { useEffect, useId, useRef, useState } from 'react';
import { Info } from 'lucide-react';
import type { PrestigeUpgradeDef } from '../../data/prestigeUpgrades';
import {
  canBuyPrestigeUpgrade,
  nextPrestigeUpgradeCost,
  prestigeEffectLabel,
  prestigeOwnedCount,
} from '../../game/economy';
import { formatTokensCompact } from '../../game/format';
import { useGameStore } from '../../game/state';

type ShopPrestigeRowProps = {
  upgrade: PrestigeUpgradeDef;
};

/**
 * Prestige shop row: spends Rewrites (never tokens).
 * Scan-first: glyph · name · ×owned · Rewrites cost / buy.
 */
export function ShopPrestigeRow({ upgrade }: ShopPrestigeRowProps) {
  const rewrites = useGameStore((s) => s.rewrites);
  const prestigeOwned = useGameStore((s) => s.prestigeOwned);
  const buyPrestigeUpgrade = useGameStore((s) => s.buyPrestigeUpgrade);
  const owned = prestigeOwnedCount(prestigeOwned, upgrade.id);
  const atMax = owned >= upgrade.maxOwned;
  const cost = nextPrestigeUpgradeCost(upgrade.id, owned);
  const canBuy =
    !atMax && canBuyPrestigeUpgrade(upgrade.id, prestigeOwned, rewrites);
  const colorVar = upgrade.colorVar;
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

  const buyLabel = atMax
    ? `${upgrade.name} already owned`
    : `Buy ${upgrade.name} for ${formatTokensCompact(cost)} Rewrites`;

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
          className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[var(--ship-line)] text-lg"
          style={{
            background: `color-mix(in srgb, var(${colorVar}) 14%, transparent)`,
          }}
          aria-hidden
        >
          {upgrade.emoji}
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
                  {prestigeEffectLabel(upgrade.id, owned)}
                </p>
              </div>
            </div>
          </div>
          <p
            className="mt-0.5 text-lg font-bold tabular-nums leading-none text-[var(--ship-ink)] sm:text-xl"
            aria-label={`${owned} owned`}
          >
            ×{owned}
          </p>
        </div>

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
          aria-label={buyLabel}
          onClick={() => {
            if (!canBuy || !buyPrestigeUpgrade(upgrade.id)) {
              return;
            }
            setBuyFlash(false);
            requestAnimationFrame(() => {
              setBuyFlash(true);
            });
          }}
        >
          <span className="text-[0.65rem] font-semibold leading-none opacity-90">
            {atMax ? 'Owned' : 'Rewrites'}
          </span>
          <span className="text-sm font-bold leading-none tabular-nums">
            {atMax ? '—' : formatTokensCompact(cost)}
          </span>
        </button>
      </div>
    </article>
  );
}
