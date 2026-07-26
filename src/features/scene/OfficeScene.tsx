import { useEffect, useRef, useState } from 'react';
import { DESKTOP_MEDIA_QUERY } from '../../app/breakpoints';
import { useMediaQuery } from '../../app/useMediaQuery';
import {
  CI_CD,
  CODE_REVIEW,
  DEV_ID,
  ESPRESSO_MACHINE,
  ON_CALL,
} from '../../data/upgrades';
import { useGameStore } from '../../game/state';
import { DevSprite } from './DevSprite';
import { lodBadgeCount, sceneSpriteCap, visibleDevCount } from './lod';
import { OfficeTalkBubbles } from './OfficeTalkBubbles';
import { isDevSpawnEvent, subscribeUpgradeOwnedChanged } from './sceneEvents';
import { sceneStageForOwned } from './stages';

type PropChip = {
  emoji: string;
  owned: number;
  label: string;
};

/**
 * Shared DOM+CSS living office: Devs spawn from owned count, LOD-capped,
 * CSS Grid desk farm, discrete milestone stages (not continuous morphs).
 * Below `lg`, uses the leaner mobile sprite budget.
 */
export function OfficeScene() {
  const isDesktop = useMediaQuery(DESKTOP_MEDIA_QUERY);
  const cap = sceneSpriteCap(isDesktop);
  const devOwned = useGameStore((s) => s.owned[DEV_ID] ?? 0);
  const espressoOwned = useGameStore((s) => s.owned[ESPRESSO_MACHINE.id] ?? 0);
  const codeReviewOwned = useGameStore((s) => s.owned[CODE_REVIEW.id] ?? 0);
  const ciOwned = useGameStore((s) => s.owned[CI_CD.id] ?? 0);
  const onCallOwned = useGameStore((s) => s.owned[ON_CALL.id] ?? 0);
  const stage = sceneStageForOwned(devOwned);
  const visible = visibleDevCount(devOwned, cap);
  const badge = lodBadgeCount(devOwned, cap);
  const [spawnIndex, setSpawnIndex] = useState<number | null>(null);
  const [stageFlash, setStageFlash] = useState(false);
  const prevStageRef = useRef(stage.name);
  const bootedRef = useRef(false);

  useEffect(() => {
    return subscribeUpgradeOwnedChanged(({ id, owned }) => {
      if (!isDevSpawnEvent(id)) {
        return;
      }
      const nextVisible = visibleDevCount(owned, cap);
      if (nextVisible <= 0) {
        return;
      }
      setSpawnIndex(nextVisible - 1);
    });
  }, [cap]);

  useEffect(() => {
    if (!bootedRef.current) {
      bootedRef.current = true;
      prevStageRef.current = stage.name;
      return;
    }
    if (prevStageRef.current === stage.name) {
      return;
    }
    prevStageRef.current = stage.name;
    setStageFlash(false);
    requestAnimationFrame(() => {
      setStageFlash(true);
    });
  }, [stage.name]);

  const deskCount = Math.max(visible, stage.emptyDesks);
  const props: PropChip[] = [
    {
      emoji: ESPRESSO_MACHINE.emoji,
      owned: espressoOwned,
      label: 'Espresso',
    },
    {
      emoji: CODE_REVIEW.emoji,
      owned: codeReviewOwned,
      label: 'Code review',
    },
    {
      emoji: CI_CD.emoji,
      owned: ciOwned,
      label: 'CI / CD',
    },
    {
      emoji: ON_CALL.emoji,
      owned: onCallOwned,
      label: 'On-call',
    },
  ].filter((prop) => prop.owned > 0);

  return (
    <section
      className={[
        'office-scene relative w-full max-w-xl overflow-hidden rounded-2xl sm:max-w-2xl',
        'border border-[var(--ship-line)]',
        'bg-[color-mix(in_srgb,var(--ship-bg-elevated)_92%,transparent)]',
        `office-stage-${stage.name}`,
        stageFlash ? 'office-stage-flash' : '',
      ].join(' ')}
      aria-label={`Office — ${stage.label}, ${devOwned} Dev${devOwned === 1 ? '' : 's'}`}
      data-stage={stage.name}
      data-dev-owned={devOwned}
      onAnimationEnd={(event) => {
        if (event.animationName === 'office-stage-flash') {
          setStageFlash(false);
        }
      }}
    >
      <div className="office-sky pointer-events-none absolute inset-x-0 top-0 h-1/3" />
      <div className="office-floor pointer-events-none absolute inset-x-0 bottom-0 h-2/3" />

      <OfficeTalkBubbles visibleDevs={visible} />

      {props.length > 0 ? (
        <div className="office-props-rail relative z-[1]" aria-hidden>
          {props.map((prop) => (
            <span key={prop.label} className="office-prop">
              <span className="text-sm leading-none">{prop.emoji}</span>
              {prop.owned > 1 ? (
                <span className="text-[10px] font-semibold tabular-nums text-[var(--ship-muted)]">
                  ×{prop.owned}
                </span>
              ) : null}
            </span>
          ))}
        </div>
      ) : null}

      <div className="office-desk-farm relative z-[1]">
        {Array.from({ length: deskCount }, (_, index) => {
          const occupied = index < visible;
          return (
            <div
              key={index}
              className={[
                'office-desk-cell',
                occupied
                  ? 'office-desk-cell-occupied'
                  : 'office-desk-cell-empty',
              ].join(' ')}
            >
              {occupied ? (
                <DevSprite
                  index={index}
                  spawn={spawnIndex === index}
                  onSpawnEnd={() => {
                    if (spawnIndex === index) {
                      setSpawnIndex(null);
                    }
                  }}
                />
              ) : null}
              <div className="office-desk-surface" />
            </div>
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
