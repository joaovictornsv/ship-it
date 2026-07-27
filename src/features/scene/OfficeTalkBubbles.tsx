import { useEffect, useState } from 'react';
import type { RoomId } from '../../data/rooms';
import { roomDialogues } from './roomTalk';
import {
  pickTalkBubble,
  type TalkContext,
  type TalkMood,
  type TalkOwnedProps,
} from './specialtyTalk';
import type { SceneStageId } from './stages';

/** New bubbles arrive slowly so the office doesn’t chatter constantly. */
const SPAWN_MIN_MS = 4500;
const SPAWN_MAX_MS = 8000;
/** Visible long enough to read; then a soft fade-out. */
const SHOW_MIN_MS = 7000;
const SHOW_MAX_MS = 10000;
/** Emotional peaks linger a beat longer. */
const PEAK_SHOW_BONUS_MS = 1200;
const FADE_OUT_MS = 700;
const DIALOGUE_FOLLOW_MS = 2800;

type Bubble = {
  id: number;
  text: string;
  mood: TalkMood;
  left: number;
  top: number;
  fading: boolean;
};

export type OfficeTalkBubblesProps = {
  /** How many Devs are visible — no chatter when the office is empty. */
  visibleDevs: number;
  stageId: SceneStageId;
  roomId: RoomId;
  tokensPerSecond: number;
  espressoOwned: number;
  codeReviewOwned: number;
  ciOwned: number;
  onCallOwned: number;
};

function maxBubblesFor(visibleDevs: number): number {
  if (visibleDevs <= 0) {
    return 0;
  }
  if (visibleDevs === 1) {
    return 1;
  }
  if (visibleDevs < 6) {
    return 2;
  }
  if (visibleDevs < 14) {
    return 3;
  }
  return 4;
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function placeBubble(existing: readonly Bubble[]): {
  left: number;
  top: number;
} {
  // Inset from edges: `-translate-x-1/2` + max-width can spill past left/right,
  // and the stage body clips with the parent `overflow-hidden`.
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const left = 22 + Math.random() * 56;
    const top = 14 + Math.random() * 58;
    const farEnough = existing.every((bubble) => {
      const dx = bubble.left - left;
      const dy = bubble.top - top;
      return dx * dx + dy * dy > 180;
    });
    if (farEnough) {
      return { left, top };
    }
  }
  return {
    left: 22 + Math.random() * 56,
    top: 14 + Math.random() * 58,
  };
}

function bubbleClassName(mood: TalkMood, fading: boolean): string {
  const motion = fading ? 'office-talk-bubble-out' : 'office-talk-bubble';
  if (mood === 'angry') {
    return [
      motion,
      'office-talk-bubble-peak office-talk-bubble-angry',
      'absolute max-w-[11rem] -translate-x-1/2 rounded-xl px-2.5 py-1.5',
      'text-[11px] font-bold leading-snug',
    ].join(' ');
  }
  if (mood === 'happy') {
    return [
      motion,
      'office-talk-bubble-peak office-talk-bubble-happy',
      'absolute max-w-[11rem] -translate-x-1/2 rounded-xl px-2.5 py-1.5',
      'text-[11px] font-bold leading-snug',
    ].join(' ');
  }
  return [
    motion,
    'absolute max-w-[10.5rem] -translate-x-1/2 rounded-xl border border-[var(--ship-line)]',
    'bg-[var(--ship-bg-elevated)] px-2.5 py-1.5 text-[11px] font-medium leading-snug text-[var(--ship-ink)]',
    'shadow-[0_4px_12px_color-mix(in_srgb,var(--ship-ink)_10%,transparent)]',
  ].join(' ');
}

/**
 * Natural office chatter over the desk farm — several bubbles at once.
 * Soft opacity fade in/out; slow spawn / long dwell. Off under reduced motion.
 * Per-room copy + rare specialty / emotional peaks via `specialtyTalk` /
 * `roomTalk` — majority stays neutral room lines / dialogues.
 */
export function OfficeTalkBubbles({
  visibleDevs,
  stageId,
  roomId,
  tokensPerSecond,
  espressoOwned,
  codeReviewOwned,
  ciOwned,
  onCallOwned,
}: OfficeTalkBubblesProps) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    if (visibleDevs <= 0) {
      return;
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced.matches) {
      return;
    }

    let cancelled = false;
    let spawnTimer = 0;
    const hideTimers = new Set<number>();
    let seq = 0;
    let live: Bubble[] = [];
    const recent = new Set<string>();
    const owned: TalkOwnedProps = {
      espresso: espressoOwned,
      codeReview: codeReviewOwned,
      ci: ciOwned,
      onCall: onCallOwned,
    };

    function talkContext(): TalkContext {
      return {
        now: new Date(),
        stageId,
        tokensPerSecond,
        owned,
        roomId,
      };
    }

    function sync(next: Bubble[]) {
      live = next;
      setBubbles(next);
    }

    function remove(id: number) {
      if (cancelled) {
        return;
      }
      sync(live.filter((bubble) => bubble.id !== id));
    }

    function beginFade(id: number) {
      if (cancelled) {
        return;
      }
      sync(
        live.map((bubble) =>
          bubble.id === id ? { ...bubble, fading: true } : bubble,
        ),
      );
      const removeTimer = window.setTimeout(() => {
        hideTimers.delete(removeTimer);
        remove(id);
      }, FADE_OUT_MS);
      hideTimers.add(removeTimer);
    }

    function show(text: string, mood: TalkMood = 'neutral'): Bubble | null {
      const cap = maxBubblesFor(visibleDevs);
      if (live.length >= cap) {
        return null;
      }
      seq += 1;
      const id = seq;
      const spot = placeBubble(live);
      const bubble: Bubble = { id, text, mood, fading: false, ...spot };
      recent.add(text);
      if (recent.size > 14) {
        const oldest = recent.values().next().value;
        if (oldest !== undefined) {
          recent.delete(oldest);
        }
      }
      sync([...live, bubble]);
      const dwell =
        randomBetween(SHOW_MIN_MS, SHOW_MAX_MS) +
        (mood === 'neutral' ? 0 : PEAK_SHOW_BONUS_MS);
      const fadeTimer = window.setTimeout(() => {
        hideTimers.delete(fadeTimer);
        beginFade(id);
      }, dwell);
      hideTimers.add(fadeTimer);
      return bubble;
    }

    function spawnOnce() {
      if (cancelled) {
        return;
      }

      const cap = maxBubblesFor(visibleDevs);
      const room = cap - live.length;
      if (room > 0) {
        const dialogues = roomDialogues(roomId);
        const useDialogue = room >= 2 && Math.random() < 0.35;
        if (useDialogue && dialogues.length > 0) {
          const dialogue =
            dialogues[Math.floor(Math.random() * dialogues.length)]!;
          show(dialogue.a, 'neutral');
          const followTimer = window.setTimeout(() => {
            hideTimers.delete(followTimer);
            if (!cancelled) {
              show(dialogue.b, 'neutral');
            }
          }, DIALOGUE_FOLLOW_MS);
          hideTimers.add(followTimer);
        } else {
          const pick = pickTalkBubble({
            exclude: recent,
            context: talkContext(),
          });
          show(pick.text, pick.mood);
        }
      }

      spawnTimer = window.setTimeout(
        spawnOnce,
        randomBetween(SPAWN_MIN_MS, SPAWN_MAX_MS),
      );
    }

    spawnTimer = window.setTimeout(spawnOnce, randomBetween(1800, 3200));

    return () => {
      cancelled = true;
      window.clearTimeout(spawnTimer);
      hideTimers.forEach((timer) => {
        window.clearTimeout(timer);
      });
      hideTimers.clear();
    };
  }, [
    visibleDevs,
    stageId,
    roomId,
    tokensPerSecond,
    espressoOwned,
    codeReviewOwned,
    ciOwned,
    onCallOwned,
  ]);

  if (visibleDevs <= 0 || bubbles.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-[2]" aria-hidden>
      {bubbles.map((bubble) => (
        <span
          key={bubble.id}
          className={bubbleClassName(bubble.mood, bubble.fading)}
          style={{ left: `${bubble.left}%`, top: `${bubble.top}%` }}
        >
          {bubble.text}
        </span>
      ))}
    </div>
  );
}
