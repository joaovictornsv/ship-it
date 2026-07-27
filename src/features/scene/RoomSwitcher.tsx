import { rooms, type RoomId } from '../../data/rooms';
import { useGameStore } from '../../game/state';

/**
 * Compact room map tabs — only unlocked rooms. Keeps the stage readable
 * early (office alone) and densifies as unlocks land.
 */
export function RoomSwitcher() {
  const roomsUnlocked = useGameStore((s) => s.roomsUnlocked);
  const activeRoom = useGameStore((s) => s.activeRoom);
  const setActiveRoom = useGameStore((s) => s.setActiveRoom);

  const unlocked = rooms.filter((room) => roomsUnlocked[room.name] === true);

  if (unlocked.length <= 1) {
    return null;
  }

  return (
    <div
      className="office-room-switcher relative z-[2] flex flex-wrap gap-1.5"
      role="tablist"
      aria-label="Unlocked rooms"
    >
      {unlocked.map((room) => {
        const selected = room.name === activeRoom;
        return (
          <button
            key={room.name}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-label={room.label}
            title={room.blurb}
            className={[
              'office-room-tab inline-flex items-center gap-1 rounded-lg',
              'border px-2 py-1 text-xs font-semibold tracking-tight',
              'transition-[background-color,border-color,color] duration-150',
              selected
                ? 'border-[var(--ship-accent)] bg-[color-mix(in_srgb,var(--ship-accent)_14%,var(--ship-bg-elevated))] text-[var(--ship-ink)]'
                : 'border-[var(--ship-line)] bg-[color-mix(in_srgb,var(--ship-bg-elevated)_88%,transparent)] text-[var(--ship-muted)] hover:border-[color-mix(in_srgb,var(--ship-accent)_35%,var(--ship-line))] hover:text-[var(--ship-ink)]',
            ].join(' ')}
            onClick={() => {
              setActiveRoom(room.name as RoomId);
            }}
          >
            <span aria-hidden className="text-[0.8rem] leading-none">
              {room.emoji}
            </span>
            <span>{room.label}</span>
          </button>
        );
      })}
    </div>
  );
}
