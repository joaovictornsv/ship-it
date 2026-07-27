import {
  useId,
  useState,
  type AnimationEvent,
  type CSSProperties,
} from 'react';
import { shipItCta } from '../../game/economy';
import { useGameStore } from '../../game/state';
import type { Tokens } from '../../game/types';
type Floater = {
  id: number;
  amount: Tokens;
};

/**
 * Dominant Ship It click target: earns tokens and shows floating +N feedback.
 * Each owned Ship upgrade evolves label, glyph, and accent tint.
 * Press uses existing ship-press. No audio. Respects prefers-reduced-motion.
 */
export function ShipItButton() {
  const shipIt = useGameStore((state) => state.shipIt);
  const shipOwned = useGameStore((state) => state.shipOwned);
  const cta = shipItCta(shipOwned);
  const glyph = cta.emoji;
  const accentVar = cta.colorVar;
  const reactId = useId();
  const [floaters, setFloaters] = useState<Floater[]>([]);
  const [shipping, setShipping] = useState(false);
  const [floaterSeq, setFloaterSeq] = useState(0);

  const buttonStyle: CSSProperties | undefined = accentVar
    ? {
        background: `color-mix(in srgb, var(${accentVar}) 42%, var(--ship-accent))`,
      }
    : undefined;

  function handleClick() {
    const earned = shipIt();
    const id = floaterSeq;
    setFloaterSeq((n) => n + 1);
    setFloaters((prev) => [...prev, { id, amount: earned }]);
    setShipping(false);
    requestAnimationFrame(() => {
      setShipping(true);
    });
  }

  function handleAnimationEnd(event: AnimationEvent<HTMLButtonElement>) {
    if (event.animationName === 'ship-press') {
      setShipping(false);
    }
  }

  function dismissFloater(id: number) {
    setFloaters((prev) => prev.filter((f) => f.id !== id));
  }

  return (
    <div className="relative flex w-full flex-col items-center justify-center">
      <button
        type="button"
        className={[
          'ship-it-button relative z-10 w-full min-h-48 rounded-2xl bg-[var(--ship-accent)] px-10 py-12',
          'text-4xl font-bold tracking-tight text-white',
          'lg:w-auto lg:min-h-28 lg:min-w-56 lg:max-w-none lg:px-12 lg:py-8 lg:text-2xl',
          'transition-[filter,background-color] duration-200 hover:brightness-110',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ship-accent)]',
          'active:translate-y-1',
          shipping ? 'ship-it-shipping' : '',
        ].join(' ')}
        style={buttonStyle}
        aria-label={`${cta.label} — earn tokens`}
        onClick={handleClick}
        onAnimationEnd={handleAnimationEnd}
      >
        <span className="inline-flex items-center justify-center gap-2">
          {glyph ? (
            <span className="text-[0.85em] leading-none" aria-hidden>
              {glyph}
            </span>
          ) : null}
          {cta.label}
        </span>
      </button>

      <div
        className="pointer-events-none absolute inset-0 z-20 flex items-start justify-center pt-2"
        aria-hidden="true"
      >
        {floaters.map((floater) => (
          <span
            key={`${reactId}-${floater.id}`}
            className="click-floater absolute text-lg font-bold tabular-nums text-[var(--ship-accent)]"
            onAnimationEnd={() => dismissFloater(floater.id)}
          >
            +{floater.amount}
          </span>
        ))}
      </div>
    </div>
  );
}
