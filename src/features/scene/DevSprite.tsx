import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type AnimationEvent,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { devTitleForIndex } from '../../data/devTitles';
import { resolveDevSkin } from '../../data/contributors';
import type { RoomId } from '../../data/rooms';
import { devEmojiForIndex } from '../shop/upgradeEmoji';

type DevSpriteProps = {
  index: number;
  roomId: RoomId;
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
 * `overflow-hidden` does not clip it. Contributor skins also show a
 * "Contributor" label in the tip; clicks never leave the office. Avatar load
 * errors fall back to the emoji glyph so missing assets never blank a desk.
 */
export function DevSprite({
  index,
  roomId,
  spawn = false,
  onSpawnEnd,
}: DevSpriteProps) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const resolved = resolveDevSkin(index);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pos, setPos] = useState<TipPos | null>(null);
  const delayMs = (index % 8) * 120;
  const label = resolved.label;
  const isContributor = resolved.mode === 'contributor';
  const showAvatar = isContributor && !avatarFailed;
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
      devEmojiForIndex(index, roomId)
    );

  const tip =
    tipVisible && pos && typeof document !== 'undefined'
      ? createPortal(
          <span
            role="tooltip"
            className={[
              'pointer-events-none fixed z-[80] -translate-x-1/2 -translate-y-full',
              'flex max-w-[10.5rem] flex-col items-center rounded-xl border border-[color-mix(in_srgb,var(--ship-bg-elevated)_28%,transparent)]',
              'bg-[var(--ship-ink)] px-2.5 py-1 text-center text-[11px] font-medium leading-snug text-[var(--ship-bg-elevated)]',
              'shadow-[0_4px_12px_color-mix(in_srgb,var(--ship-ink)_22%,transparent)]',
              'office-dev-name-tip',
            ].join(' ')}
            style={{ top: pos.top, left: pos.left }}
          >
            <span className="max-w-full truncate">{label}</span>
            {isContributor ? (
              <span className="mt-0.5 text-[10px] font-normal opacity-75">
                Contributor
              </span>
            ) : (
              <span className="mt-0.5 max-w-full truncate text-[10px] font-normal opacity-75">
                {devTitleForIndex(index)}
              </span>
            )}
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
      <span
        className={spriteClassName(spawn)}
        style={style}
        aria-hidden
        onAnimationEnd={onAnimationEnd}
      >
        {glyph}
      </span>
      {tip}
    </span>
  );
}
