import { upcomingAchievements } from '../data/achievements';
import { shipUpgrades } from '../data/shipUpgrades';
import { hasShipUpgrade } from '../game/economy';
import { useGameStore } from '../game/state';
import { SHIP_UPGRADE_EMOJI } from '../features/shop/shipUpgradeEmoji';
import { shipUpgradeColorVar } from '../features/shop/shipUpgradeColors';

/**
 * Achievements screen: owned Ship upgrades + upcoming achievement stubs.
 * Full achievement unlock logic is roadmap later — this is the gallery shell.
 */
export function AchievementsView() {
  const shipOwned = useGameStore((s) => s.shipOwned);
  const ownedList = shipUpgrades.filter((u) => hasShipUpgrade(shipOwned, u.id));

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-10">
      <div className="max-w-lg text-left">
        <h1 className="text-lg font-semibold tracking-tight text-[var(--ship-ink)]">
          Achievements
        </h1>
        <p className="mt-1 text-sm text-[var(--ship-muted)]">
          Ship upgrades you have unlocked this run, plus a peek at achievements
          still on the roadmap.
        </p>
      </div>

      <section
        aria-labelledby="owned-ship-upgrades-heading"
        className="text-left"
      >
        <h2
          id="owned-ship-upgrades-heading"
          className="text-sm font-semibold tracking-tight text-[var(--ship-ink)]"
        >
          Ship upgrades owned
        </h2>
        {ownedList.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--ship-muted)]">
            None yet — buy a building, then pick up Ship upgrades in the shop
            queue.
          </p>
        ) : (
          <ul className="mt-3 flex list-none flex-col gap-2 p-0 sm:grid sm:grid-cols-2 sm:gap-3">
            {ownedList.map((upgrade) => {
              const colorVar = shipUpgradeColorVar(upgrade.id);
              const effect =
                upgrade.effect.kind === 'flat'
                  ? `+${upgrade.effect.amount} tokens per click`
                  : `×${upgrade.effect.factor} click power`;
              return (
                <li key={upgrade.id}>
                  <article
                    className={[
                      'flex items-start gap-3 rounded-xl border border-[var(--ship-line)]',
                      'bg-[color-mix(in_srgb,var(--ship-bg-elevated)_88%,transparent)] px-3 py-2.5',
                    ].join(' ')}
                  >
                    <div
                      className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[var(--ship-line)] text-lg"
                      style={{
                        background: `color-mix(in srgb, var(${colorVar}) 14%, transparent)`,
                      }}
                      aria-hidden
                    >
                      {SHIP_UPGRADE_EMOJI[upgrade.icon]}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold tracking-tight text-[var(--ship-ink)]">
                        {upgrade.name}
                      </h3>
                      <p className="mt-0.5 text-xs text-[var(--ship-muted)]">
                        {upgrade.blurb}
                      </p>
                      <p className="mt-1 text-xs font-semibold tabular-nums text-[var(--ship-ink)]">
                        {effect}
                      </p>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section
        aria-labelledby="upcoming-achievements-heading"
        className="text-left"
      >
        <h2
          id="upcoming-achievements-heading"
          className="text-sm font-semibold tracking-tight text-[var(--ship-ink)]"
        >
          Coming soon
        </h2>
        <p className="mt-1 text-xs text-[var(--ship-muted)]">
          Placeholder achievements — unlock tracking arrives with the incidents
          / achievements roadmap item.
        </p>
        <ul className="mt-3 flex list-none flex-col gap-2 p-0">
          {upcomingAchievements.map((item) => (
            <li key={item.id}>
              <article
                className={[
                  'rounded-xl border border-dashed border-[var(--ship-line)]',
                  'bg-[color-mix(in_srgb,var(--ship-bg-elevated)_70%,transparent)] px-3 py-2.5 opacity-80',
                ].join(' ')}
              >
                <h3 className="text-sm font-semibold tracking-tight text-[var(--ship-ink)]">
                  {item.name}
                </h3>
                <p className="mt-0.5 text-xs text-[var(--ship-muted)]">
                  {item.blurb}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
