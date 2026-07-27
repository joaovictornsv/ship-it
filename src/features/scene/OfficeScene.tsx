import { useEffect, useRef, useState } from 'react';
import { DESKTOP_MEDIA_QUERY } from '../../app/breakpoints';
import { useMediaQuery } from '../../app/useMediaQuery';
import { getRoom } from '../../data/rooms';
import {
  CI_CD,
  CODE_REVIEW,
  DEV_ID,
  ESPRESSO_MACHINE,
  ON_CALL,
} from '../../data/upgrades';
import { roomSceneClass } from '../../game/rooms';
import { selectTokensPerSecond, useGameStore } from '../../game/state';
import { DevSprite } from './DevSprite';
import { DeskStack } from './DeskStack';
import { sceneSpriteCap, visibleDevCount } from './lod';
import { OfficeTalkBubbles } from './OfficeTalkBubbles';
import { RoomSwitcher } from './RoomSwitcher';
import { isDevSpawnEvent, subscribeUpgradeOwnedChanged } from './sceneEvents';
import { sceneStageForOwned } from './stages';

/**
 * Shared DOM+CSS living office: Devs spawn from owned count, LOD-capped,
 * CSS Grid desk farm, discrete milestone stages + unlockable rooms (#11).
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
  const tokensPerSecond = useGameStore(selectTokensPerSecond);
  const activeRoomId = useGameStore((s) => s.activeRoom);
  const room = getRoom(activeRoomId);
  const stage = sceneStageForOwned(devOwned);
  const visible = visibleDevCount(devOwned, cap);
  const [spawnIndex, setSpawnIndex] = useState<number | null>(null);
  const [stageFlash, setStageFlash] = useState(false);
  const prevStageRef = useRef(stage.name);
  const prevRoomRef = useRef(activeRoomId);
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
      prevRoomRef.current = activeRoomId;
      return;
    }
    const stageChanged = prevStageRef.current !== stage.name;
    const roomChanged = prevRoomRef.current !== activeRoomId;
    prevStageRef.current = stage.name;
    prevRoomRef.current = activeRoomId;
    if (!stageChanged && !roomChanged) {
      return;
    }
    setStageFlash(false);
    requestAnimationFrame(() => {
      setStageFlash(true);
    });
  }, [stage.name, activeRoomId]);

  const isEmptyOffice = devOwned === 0;
  const deskCount = Math.max(visible, stage.emptyDesks);

  return (
    <section
      className={[
        'office-scene relative w-full max-w-xl overflow-hidden rounded-2xl sm:max-w-2xl',
        'border border-[var(--ship-line)]',
        'bg-[color-mix(in_srgb,var(--ship-bg-elevated)_92%,transparent)]',
        `office-stage-${stage.name}`,
        roomSceneClass(activeRoomId),
        stageFlash ? 'office-stage-flash' : '',
      ].join(' ')}
      aria-label={`${room.label} — ${stage.label}, ${devOwned} Dev${devOwned === 1 ? '' : 's'}`}
      data-stage={stage.name}
      data-room={activeRoomId}
      data-dev-owned={devOwned}
      onAnimationEnd={(event) => {
        if (event.animationName === 'office-stage-flash') {
          setStageFlash(false);
        }
      }}
    >
      <RoomSwitcher />

      <div className="office-sky pointer-events-none absolute inset-x-0 top-0 h-1/3" />

      {/* Floor + chatter + desks share one band so talk bubbles stay inside
          the overflow-clipped stage. */}
      <div className="office-stage-body relative z-[1]">
        <div className="office-floor pointer-events-none absolute inset-0" />

        <OfficeTalkBubbles
          visibleDevs={visible}
          stageId={stage.name}
          roomId={activeRoomId}
          tokensPerSecond={tokensPerSecond}
          espressoOwned={espressoOwned}
          codeReviewOwned={codeReviewOwned}
          ciOwned={ciOwned}
          onCallOwned={onCallOwned}
        />

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
                    roomId={activeRoomId}
                    spawn={spawnIndex === index}
                    onSpawnEnd={() => {
                      if (spawnIndex === index) {
                        setSpawnIndex(null);
                      }
                    }}
                  />
                ) : null}
                <DeskStack occupied={occupied} index={index} />
              </div>
            );
          })}

          {isEmptyOffice ? (
            <p className="office-empty-hint text-sm text-[var(--ship-muted)]">
              {room.emptyHint}
            </p>
          ) : null}
        </div>
      </div>

      <p className="sr-only">
        {room.label}. {stage.label}. {devOwned} Dev
        {devOwned === 1 ? '' : 's'} owned
        {devOwned > visible ? `, showing ${visible} on screen` : ''}.
      </p>
    </section>
  );
}
