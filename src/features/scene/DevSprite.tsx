import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type AnimationEvent,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { resolveDevSkin } from '../../data/contributors';
import { devEmojiForIndex } from '../shop/upgradeEmoji';

type DevSpriteProps = {
  index: number;
  /** When true, play a short spawn pop (buy celebration). */
  spawn?: boolean;
  onSpawnEnd?: () => void;
};

type TipPos = { top: number; left: number };

const spriteClassName = (spawn: boolean) =>
  [
    'office-dev mb-0.5 flex items-center justify-center text-xl leading-none sm:text-2xl',
    spawn ? 'office-dev-spawn' : '',
  ].join(' ');

/**
 * Dev sprite — opt-in contributor avatar when available, else generic emoji.
 * Hover / focus shows a simple talk-shaped name tip with inverted ink/elevated
 * colors (distinct from office speech bubbles), portaled so the stage
 * `overflow-hidden` does not clip it. Human contributor skins wrap in a
 * GitHub profile link; bots and fallback desks stay non-linked. Avatar load
 * errors fall back to the emoji glyph so missing assets never blank a desk.
 */
export function DevSprite({
  index,
  spawn = false,
  onSpawnEnd,
}: DevSpriteProps) {
  const tipId = useId();
  const wrapRef = useRef<HTMLSpanElement>(null);
  const resolved = resolveDevSkin(index);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pos, setPos] = useState<TipPos | null>(null);
  const delayMs = (index % 8) * 120;
  const label = resolved.label;
  const showAvatar = resolved.mode === 'contributor' && !avatarFailed;
  const profileUrl =
    resolved.mode === 'contributor' ? resolved.profileUrl : null;
  const tipVisible = hovered;

  const style: CSSProperties = {
    animationDelay: spawn ? '0ms' : `${delayMs}ms`,
  };

  function updatePos() {
    const wrap = wrapRef.current;
    if (!wrap) {
      return;
    }
    const rect = wrap.getBoundingClientRect();
    setPos({
      top: rect.top - 6,
      left: rect.left + rect.width / 2,
    });
  }

  useLayoutEffect(() => {
    if (!tipVisible) {
      return;
    }
    updatePos();
  }, [tipVisible]);

  useEffect(() => {
    if (!tipVisible) {
      return;
    }
    function onReposition() {
      updatePos();
    }
    window.addEventListener('resize', onReposition);
    window.addEventListener('scroll', onReposition, true);
    return () => {
      window.removeEventListener('resize', onReposition);
      window.removeEventListener('scroll', onReposition, true);
    };
  }, [tipVisible]);

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

  const tip =
    tipVisible && pos && typeof document !== 'undefined'
      ? createPortal(
          <span
            id={tipId}
            role="tooltip"
            className={[
              'pointer-events-none fixed z-[80] -translate-x-1/2 -translate-y-full',
              'max-w-[10.5rem] truncate rounded-xl border border-[color-mix(in_srgb,var(--ship-bg-elevated)_28%,transparent)]',
              'bg-[var(--ship-ink)] px-2.5 py-1 text-[11px] font-medium leading-snug text-[var(--ship-bg-elevated)]',
              'shadow-[0_4px_12px_color-mix(in_srgb,var(--ship-ink)_22%,transparent)]',
              'office-dev-name-tip',
            ].join(' ')}
            style={{ top: pos.top, left: pos.left }}
          >
            {label}
          </span>,
          document.body,
        )
      : null;

  return (
    <span
      ref={wrapRef}
      className="relative inline-flex"
      onMouseEnter={() => {
        setHovered(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
      }}
      onFocusCapture={() => {
        setHovered(true);
      }}
      onBlurCapture={(event) => {
        const next = event.relatedTarget as Node | null;
        if (wrapRef.current?.contains(next)) {
          return;
        }
        setHovered(false);
      }}
    >
      {profileUrl ? (
        <a
          className={`${spriteClassName(spawn)} no-underline text-inherit`}
          style={style}
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${label} on GitHub`}
          aria-describedby={tipVisible ? tipId : undefined}
          onAnimationEnd={onAnimationEnd}
        >
          {glyph}
        </a>
      ) : (
        <span
          className={spriteClassName(spawn)}
          style={style}
          aria-hidden
          onAnimationEnd={onAnimationEnd}
        >
          {glyph}
        </span>
      )}
      {tip}
    </span>
  );
}
