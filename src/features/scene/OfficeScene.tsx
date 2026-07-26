import { Coffee } from 'lucide-react';
import { DEV_ID, ESPRESSO_MACHINE_ID } from '../../data/upgrades';
import { useGameStore } from '../../game/state';
import { DEV_SLOTS } from './devSlots';
import { DevSprite } from './DevSprite';
import { lodBadgeCount, visibleDevCount } from './lod';
import { sceneStageForOwned } from './stages';

/**
 * Shared DOM+CSS living office: Devs spawn from owned count, LOD-capped,
 * with discrete milestone stages (not continuous morphs).
 */
export function OfficeScene() {
  const devOwned = useGameStore((s) => s.owned[DEV_ID] ?? 0);
  const espressoOwned = useGameStore((s) => s.owned[ESPRESSO_MACHINE_ID] ?? 0);
  const stage = sceneStageForOwned(devOwned);
  const visible = visibleDevCount(devOwned);
  const badge = lodBadgeCount(devOwned);

  return (
    <section
      className={[
        'office-scene relative w-full max-w-md overflow-hidden rounded-xl',
        'border border-[var(--ship-line)]',
        'bg-[color-mix(in_srgb,var(--ship-bg-elevated)_92%,transparent)]',
        `office-stage-${stage.id}`,
      ].join(' ')}
      aria-label={`Office — ${stage.label}, ${devOwned} Dev${devOwned === 1 ? '' : 's'}`}
      data-stage={stage.id}
      data-dev-owned={devOwned}
    >
      <div className="office-sky pointer-events-none absolute inset-x-0 top-0 h-1/3" />
      <div className="office-floor pointer-events-none absolute inset-x-0 bottom-0 h-2/3" />

      <div
        className="office-props pointer-events-none absolute inset-0"
        aria-hidden
      >
        <div className="office-desk office-desk-a" />
        <div className="office-desk office-desk-b" />
        <div className="office-desk office-desk-c" />
        <div className="office-desk office-desk-d" />
        {espressoOwned > 0 ? (
          <div className="office-espresso absolute bottom-[18%] left-[6%] flex items-end gap-1">
            <Coffee
              className="size-5 text-[var(--office-mug)]"
              strokeWidth={1.75}
              aria-hidden
            />
            {espressoOwned > 1 ? (
              <span className="text-[10px] font-semibold tabular-nums text-[var(--ship-muted)]">
                ×{espressoOwned}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="office-crowd relative h-44 w-full sm:h-52">
        {Array.from({ length: visible }, (_, index) => {
          const slot = DEV_SLOTS[index]!;
          return (
            <DevSprite
              key={index}
              index={index}
              left={slot.left}
              top={slot.top}
            />
          );
        })}

        {badge !== null ? (
          <span
            className={[
              'absolute right-3 top-3 rounded-lg',
              'border border-[var(--ship-line)]',
              'bg-[color-mix(in_srgb,var(--ship-bg-elevated)_90%,transparent)]',
              'px-2 py-1 text-sm font-bold tabular-nums text-[var(--ship-ink)]',
            ].join(' ')}
            aria-label={`${badge} Devs total`}
          >
            ×{badge}
          </span>
        ) : null}
      </div>

      <p className="sr-only">
        {stage.label}. {devOwned} Dev{devOwned === 1 ? '' : 's'} owned
        {badge !== null ? `, showing ${visible} on screen` : ''}.
      </p>
    </section>
  );
}
