import { useId, useState, type AnimationEvent } from 'react';
import { useGameStore } from '../../game/state';
import type { Beans } from '../../game/types';

type Floater = {
  id: number;
  amount: Beans;
};

/**
 * Dominant Ship It click target: earns beans and shows floating +N feedback.
 * No audio. Brief press animation; respects prefers-reduced-motion via CSS.
 */
export function ShipItButton() {
  const shipIt = useGameStore((state) => state.shipIt);
  const reactId = useId();
  const [floaters, setFloaters] = useState<Floater[]>([]);
  const [shipping, setShipping] = useState(false);
  const [floaterSeq, setFloaterSeq] = useState(0);

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
    <div className="relative flex flex-col items-center justify-center">
      <button
        type="button"
        className={[
          'ship-it-button relative z-10 min-h-28 min-w-56 rounded-2xl bg-[var(--ship-accent)] px-12 py-8',
          'text-2xl font-bold tracking-tight text-white shadow-[0_8px_0_#6b4423]',
          'transition-[filter] hover:brightness-110',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ship-accent)]',
          'active:translate-y-1 active:shadow-[0_4px_0_#6b4423]',
          shipping ? 'ship-it-shipping' : '',
        ].join(' ')}
        aria-label="Ship It — earn coffee beans"
        onClick={handleClick}
        onAnimationEnd={handleAnimationEnd}
      >
        Ship It
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
