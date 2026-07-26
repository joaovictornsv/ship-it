import { LaptopMinimal } from 'lucide-react';

type DevSpriteProps = {
  index: number;
  /** When true, play a short spawn pop (buy celebration). */
  spawn?: boolean;
  onSpawnEnd?: () => void;
};

/**
 * Recognizable Dev icon sprite (Lucide laptop) — not abstract stick figures.
 *
 * Extension point for #10 contributor skins: swap `LaptopMinimal` (or wrap this
 * component) with a skin-aware renderer that picks an avatar / variant from the
 * opt-in contributor pool while keeping the same desk-cell layout contract.
 */
export function DevSprite({
  index,
  spawn = false,
  onSpawnEnd,
}: DevSpriteProps) {
  const delayMs = (index % 8) * 120;
  return (
    <span
      className={[
        'office-dev mb-0.5 flex items-center justify-center',
        spawn ? 'office-dev-spawn' : '',
      ].join(' ')}
      style={{ animationDelay: spawn ? '0ms' : `${delayMs}ms` }}
      aria-hidden
      onAnimationEnd={(event) => {
        if (event.animationName === 'office-spawn-pop') {
          onSpawnEnd?.();
        }
      }}
    >
      <LaptopMinimal
        className="size-5 text-[var(--ship-upgrade-dev)] sm:size-6"
        strokeWidth={1.75}
      />
    </span>
  );
}
