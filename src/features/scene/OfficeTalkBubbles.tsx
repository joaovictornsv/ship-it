import { useEffect, useState } from 'react';
import { DEV_DIALOGUES } from './devTalk';
import {
  pickTalkLine,
  type TalkContext,
  type TalkOwnedProps,
} from './specialtyTalk';
import type { SceneStageId } from './stages';

/** New bubbles arrive slowly so the office doesn’t chatter constantly. */
const SPAWN_MIN_MS = 4500;
const SPAWN_MAX_MS = 8000;
/** Visible long enough to read; then a soft fade-out. */
const SHOW_MIN_MS = 7000;
const SHOW_MAX_MS = 10000;
const FADE_OUT_MS = 700;
const DIALOGUE_FOLLOW_MS = 2800;

type Bubble = {
  id: number;
  text: string;
  left: number;
  top: number;
  fading: boolean;
};

export type OfficeTalkBubblesProps = {
  /** How many Devs are visible — no chatter when the office is empty. */
  visibleDevs: number;
  stageId: SceneStageId;
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
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const left = 8 + Math.random() * 84;
    // Full office height (props rail → floor), not just the top band.
    const top = 10 + Math.random() * 72;
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
    left: 8 + Math.random() * 84,
    top: 10 + Math.random() * 72,
  };
}

/**
 * Natural office chatter above the desk farm — several bubbles at once.
 * Soft opacity fade in/out; slow spawn / long dwell. Off under reduced motion.
 * Rare specialty lines (GitHub / contributors / calendar / owned props) via
 * `specialtyTalk` — majority stays generic `DEV_LINES` / dialogues.
 */
export function OfficeTalkBubbles({
  visibleDevs,
  stageId,
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

    function show(text: string): Bubble | null {
      const cap = maxBubblesFor(visibleDevs);
      if (live.length >= cap) {
        return null;
      }
      seq += 1;
      const id = seq;
      const spot = placeBubble(live);
      const bubble: Bubble = { id, text, fading: false, ...spot };
      recent.add(text);
      if (recent.size > 14) {
        const oldest = recent.values().next().value;
        if (oldest !== undefined) {
          recent.delete(oldest);
        }
      }
      sync([...live, bubble]);
      const fadeTimer = window.setTimeout(
        () => {
          hideTimers.delete(fadeTimer);
          beginFade(id);
        },
        randomBetween(SHOW_MIN_MS, SHOW_MAX_MS),
      );
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
        const useDialogue = room >= 2 && Math.random() < 0.35;
        if (useDialogue) {
          const dialogue =
            DEV_DIALOGUES[Math.floor(Math.random() * DEV_DIALOGUES.length)]!;
          show(dialogue.a);
          const followTimer = window.setTimeout(() => {
            hideTimers.delete(followTimer);
            if (!cancelled) {
              show(dialogue.b);
            }
          }, DIALOGUE_FOLLOW_MS);
          hideTimers.add(followTimer);
        } else {
          show(pickTalkLine({ exclude: recent, context: talkContext() }));
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
          className={[
            'absolute max-w-[10.5rem] -translate-x-1/2 rounded-xl border border-[var(--ship-line)]',
            'bg-[var(--ship-bg-elevated)] px-2.5 py-1.5 text-[11px] font-medium leading-snug text-[var(--ship-ink)]',
            'shadow-[0_4px_12px_color-mix(in_srgb,var(--ship-ink)_10%,transparent)]',
            bubble.fading ? 'office-talk-bubble-out' : 'office-talk-bubble',
          ].join(' ')}
          style={{ left: `${bubble.left}%`, top: `${bubble.top}%` }}
        >
          {bubble.text}
        </span>
      ))}
    </div>
  );
}
