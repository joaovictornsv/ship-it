import { prestigeUpgrades } from '../../data/prestigeUpgrades';
import { prestigeTokensPerSecondMult } from '../../game/economy';
import { formatTokensCompact } from '../../game/format';
import { useGameStore } from '../../game/state';
import { ShopPrestigeRow } from './ShopPrestigeRow';

type RewritesShopProps = {
  /** Optional heading id for dialog labelling. */
  headingId?: string;
};

/**
 * Prestige rows spent in Rewrites — only mounted inside the Rewrite flow,
 * not the normal shop rail/drawer (#49).
 */
export function RewritesShop({
  headingId = 'shop-rewrites-heading',
}: RewritesShopProps) {
  const rewrites = useGameStore((s) => s.rewrites);
  const prestigeOwned = useGameStore((s) => s.prestigeOwned);
  const tpsMult = prestigeTokensPerSecondMult(rewrites, prestigeOwned);

  return (
    <section aria-labelledby={headingId}>
      <div className="mb-2 px-0.5">
        <h3
          id={headingId}
          className="text-sm font-semibold tracking-tight text-[var(--ship-ink)]"
        >
          Rewrites shop
        </h3>
        <p className="text-xs text-[var(--ship-muted)]">
          permanent power · spend{' '}
          <span className="font-semibold tabular-nums text-[var(--ship-rewrite)]">
            {formatTokensCompact(rewrites)}
          </span>{' '}
          Rewrites
          {tpsMult > 1 ? <> · ×{tpsMult.toFixed(2)} tokens/s</> : null}
        </p>
      </div>
      <ul className="flex list-none flex-col gap-2 p-0">
        {prestigeUpgrades.map((upgrade) => (
          <li key={upgrade.id}>
            <ShopPrestigeRow upgrade={upgrade} />
          </li>
        ))}
      </ul>
    </section>
  );
}
