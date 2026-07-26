import { devEmojiForIndex } from '../shop/upgradeEmoji';

type DevSpriteProps = {
  index: number;
  /** When true, play a short spawn pop (buy celebration). */
  spawn?: boolean;
  onSpawnEnd?: () => void;
};

/**
 * Emoji Dev sprite — warmer than monochrome notebook icons.
 *
 * Extension point for #10 contributor skins: swap the emoji (or wrap this
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
        'office-dev mb-0.5 flex items-center justify-center text-xl leading-none sm:text-2xl',
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
      {devEmojiForIndex(index)}
    </span>
  );
}
