type DevSpriteProps = {
  index: number;
  left: number;
  top: number;
};

/**
 * Lightweight DOM Dev — head + torso, no canvas / no image pipeline.
 * Idle bob is CSS (`.office-dev`); disabled under prefers-reduced-motion.
 */
export function DevSprite({ index, left, top }: DevSpriteProps) {
  const delayMs = (index % 8) * 120;
  return (
    <span
      className="office-dev absolute flex flex-col items-center"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        zIndex: Math.round(top),
        animationDelay: `${delayMs}ms`,
      }}
      aria-hidden
    >
      <span className="office-dev-head size-2.5 rounded-full bg-[var(--ship-ink)]" />
      <span className="office-dev-body mt-0.5 h-3.5 w-2 rounded-sm bg-[var(--ship-accent)]" />
    </span>
  );
}
