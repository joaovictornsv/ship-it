import { useState } from 'react';
import { resolveDevSkin } from '../../data/contributors';
import { devEmojiForIndex } from '../shop/upgradeEmoji';

type DevSpriteProps = {
  index: number;
  /** When true, play a short spawn pop (buy celebration). */
  spawn?: boolean;
  onSpawnEnd?: () => void;
};

/**
 * Dev sprite — opt-in contributor avatar when available, else generic emoji.
 * Hover (`title`) shows the contributor display name. Avatar load errors fall
 * back to the emoji glyph so missing assets never blank a desk.
 */
export function DevSprite({
  index,
  spawn = false,
  onSpawnEnd,
}: DevSpriteProps) {
  const resolved = resolveDevSkin(index);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const delayMs = (index % 8) * 120;
  const label = resolved.mode === 'contributor' ? resolved.label : undefined;
  const showAvatar = resolved.mode === 'contributor' && !avatarFailed;

  return (
    <span
      className={[
        'office-dev mb-0.5 flex items-center justify-center text-xl leading-none sm:text-2xl',
        spawn ? 'office-dev-spawn' : '',
      ].join(' ')}
      style={{ animationDelay: spawn ? '0ms' : `${delayMs}ms` }}
      title={label}
      aria-hidden
      onAnimationEnd={(event) => {
        if (event.animationName === 'office-spawn-pop') {
          onSpawnEnd?.();
        }
      }}
    >
      {showAvatar && resolved.mode === 'contributor' ? (
        <img
          className="office-dev-avatar size-7 rounded-md object-cover sm:size-8"
          src={resolved.avatarSrc}
          alt=""
          draggable={false}
          onError={() => {
            setAvatarFailed(true);
          }}
        />
      ) : (
        devEmojiForIndex(index)
      )}
    </span>
  );
}
