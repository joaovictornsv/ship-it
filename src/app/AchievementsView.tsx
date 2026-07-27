import { Check, Lock } from 'lucide-react';
import { achievements } from '../data/achievements';
import {
  achievementProgressLabel,
  achievementSnapshotFromState,
} from '../game/achievements';
import { shipUpgradeEffectLabel, shipUpgrades } from '../data/shipUpgrades';
import { hasShipUpgrade } from '../game/economy';
import { useGameStore } from '../game/state';

/**
 * Achievements screen: milestone badges (unlocked + locked progress) and
 * this-run Ship upgrades gallery.
 */
export function AchievementsView() {
  const shipOwned = useGameStore((s) => s.shipOwned);
  const achievementsUnlocked = useGameStore((s) => s.achievementsUnlocked);
  const lifetimeTokensEarned = useGameStore((s) => s.lifetimeTokensEarned);
  const lifetimeClicks = useGameStore((s) => s.lifetimeClicks);
  const lifetimePurchases = useGameStore((s) => s.lifetimePurchases);
  const owned = useGameStore((s) => s.owned);
  const rewrites = useGameStore((s) => s.rewrites);

  const snap = achievementSnapshotFromState({
    lifetimeTokensEarned,
    lifetimeClicks,
    lifetimePurchases,
    owned,
    rewrites,
  });

  const ownedList = shipUpgrades.filter((u) => hasShipUpgrade(shipOwned, u.id));
  const unlockedCount = achievements.filter(
    (a) => achievementsUnlocked[a.name] === true,
  ).length;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-10">
      <div className="max-w-lg text-left">
        <h1 className="text-lg font-semibold tracking-tight text-[var(--ship-ink)]">
          Achievements
        </h1>
        <p className="mt-1 text-sm text-[var(--ship-muted)]">
          Durable shipping milestones —{' '}
          <span className="tabular-nums text-[var(--ship-ink)]">
            {unlockedCount}/{achievements.length}
          </span>{' '}
          unlocked. Survive Reload and Rewrite.
        </p>
      </div>

      <section aria-labelledby="milestones-heading" className="text-left">
        <h2
          id="milestones-heading"
          className="text-sm font-semibold tracking-tight text-[var(--ship-ink)]"
        >
          Milestones
        </h2>
        <ul className="mt-3 flex list-none flex-col gap-2 p-0 sm:grid sm:grid-cols-2 sm:gap-3">
          {achievements.map((item) => {
            const unlocked = achievementsUnlocked[item.name] === true;
            return (
              <li key={item.name}>
                <article
                  aria-label={`${item.title}, ${unlocked ? 'unlocked' : 'locked'}`}
                  className={[
                    'flex gap-3 rounded-xl border px-3 py-2.5',
                    unlocked
                      ? [
                          'border-[color-mix(in_srgb,var(--ship-accent)_35%,var(--ship-line))]',
                          'bg-[var(--ship-bg-elevated)]',
                          'shadow-[inset_3px_0_0_0_var(--ship-accent)]',
                        ].join(' ')
                      : [
                          'border-dashed border-[var(--ship-line)]',
                          'bg-[color-mix(in_srgb,var(--ship-ink)_4%,transparent)]',
                        ].join(' '),
                  ].join(' ')}
                >
                  <div
                    className={[
                      'mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border',
                      unlocked
                        ? 'border-[color-mix(in_srgb,var(--ship-accent)_28%,var(--ship-line))] bg-[color-mix(in_srgb,var(--ship-accent)_14%,transparent)] text-[var(--ship-accent-deep)]'
                        : 'border-[var(--ship-line)] bg-[color-mix(in_srgb,var(--ship-bg-elevated)_60%,transparent)] text-[var(--ship-muted)]',
                    ].join(' ')}
                    aria-hidden
                  >
                    {unlocked ? (
                      <Check className="size-4" strokeWidth={2.5} />
                    ) : (
                      <Lock className="size-4" strokeWidth={2} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        className={[
                          'text-sm font-semibold tracking-tight',
                          unlocked
                            ? 'text-[var(--ship-ink)]'
                            : 'text-[var(--ship-muted)]',
                        ].join(' ')}
                      >
                        {item.title}
                      </h3>
                      <span
                        className={[
                          'shrink-0 rounded-md px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide',
                          unlocked
                            ? 'bg-[color-mix(in_srgb,var(--ship-accent)_16%,transparent)] text-[var(--ship-accent-deep)]'
                            : 'bg-[color-mix(in_srgb,var(--ship-ink)_6%,transparent)] text-[var(--ship-muted)]',
                        ].join(' ')}
                      >
                        {unlocked ? 'Unlocked' : 'Locked'}
                      </span>
                    </div>
                    <p
                      className={[
                        'mt-0.5 text-xs',
                        unlocked
                          ? 'text-[var(--ship-muted)]'
                          : 'text-[color-mix(in_srgb,var(--ship-muted)_78%,transparent)]',
                      ].join(' ')}
                    >
                      {item.blurb}
                    </p>
                    <p
                      className={[
                        'mt-1 text-xs font-semibold tabular-nums',
                        unlocked
                          ? 'text-[var(--ship-accent-deep)]'
                          : 'text-[var(--ship-muted)]',
                      ].join(' ')}
                    >
                      {unlocked
                        ? 'Complete'
                        : achievementProgressLabel(item, snap)}
                    </p>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </section>

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
        <p className="mt-1 text-xs text-[var(--ship-muted)]">
          This-run click-power track — resets on Rewrite.
        </p>
        {ownedList.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--ship-muted)]">
            None yet — buy a building, then pick up Ship upgrades in the shop
            queue.
          </p>
        ) : (
          <ul className="mt-3 flex list-none flex-col gap-2 p-0 sm:grid sm:grid-cols-2 sm:gap-3">
            {ownedList.map((upgrade) => {
              const effect = shipUpgradeEffectLabel(upgrade.effect);
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
                        background: `color-mix(in srgb, var(${upgrade.colorVar}) 14%, transparent)`,
                      }}
                      aria-hidden
                    >
                      {upgrade.emoji}
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
    </main>
  );
}
