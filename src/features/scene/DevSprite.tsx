import {
  useState,
  type AnimationEvent,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { resolveDevSkin } from '../../data/contributors';
import { devEmojiForIndex } from '../shop/upgradeEmoji';

type DevSpriteProps = {
  index: number;
  /** When true, play a short spawn pop (buy celebration). */
  spawn?: boolean;
  onSpawnEnd?: () => void;
};

const spriteClassName = (spawn: boolean) =>
  [
    'office-dev mb-0.5 flex items-center justify-center text-xl leading-none sm:text-2xl',
    spawn ? 'office-dev-spawn' : '',
  ].join(' ');

/**
 * Dev sprite — opt-in contributor avatar when available, else generic emoji.
 * Every desk gets a native `title` hover name. Human contributor skins wrap in
 * a GitHub profile link; bots and fallback desks stay non-linked. Avatar load
 * errors fall back to the emoji glyph so missing assets never blank a desk.
 */
export function DevSprite({
  index,
  spawn = false,
  onSpawnEnd,
}: DevSpriteProps) {
  const resolved = resolveDevSkin(index);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const delayMs = (index % 8) * 120;
  const label = resolved.label;
  const showAvatar = resolved.mode === 'contributor' && !avatarFailed;
  const profileUrl =
    resolved.mode === 'contributor' ? resolved.profileUrl : null;

  const style: CSSProperties = {
    animationDelay: spawn ? '0ms' : `${delayMs}ms`,
  };

  const onAnimationEnd = (event: AnimationEvent<HTMLElement>): void => {
    if (event.animationName === 'office-spawn-pop') {
      onSpawnEnd?.();
    }
  };

  const glyph: ReactNode =
    showAvatar && resolved.mode === 'contributor' ? (
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
    );

  if (profileUrl) {
    return (
      <a
        className={`${spriteClassName(spawn)} no-underline text-inherit`}
        style={style}
        href={profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        title={label}
        aria-label={`${label} on GitHub`}
        onAnimationEnd={onAnimationEnd}
      >
        {glyph}
      </a>
    );
  }

  return (
    <span
      className={spriteClassName(spawn)}
      style={style}
      title={label}
      aria-hidden
      onAnimationEnd={onAnimationEnd}
    >
      {glyph}
    </span>
  );
}
