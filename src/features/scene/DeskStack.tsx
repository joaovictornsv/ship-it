import { DESK_NOTEBOOK_EMOJI, deskSnackForIndex } from './deskClutter';

type DeskStackProps = {
  occupied: boolean;
  index: number;
};

/**
 * Desk cell — vacant surface, or flex row (center notebook · right snack)
 * with the notebook overflowing above the desk bar.
 */
export function DeskStack({ occupied, index }: DeskStackProps) {
  if (!occupied) {
    return <div className="office-desk-surface" aria-hidden />;
  }

  const snack = deskSnackForIndex(index);

  return (
    <div className="office-desk-stack" aria-hidden>
      <div className="office-desk-surface office-desk-surface-occupied">
        <span className="office-desk-slot office-desk-slot-center">
          <span className="office-desk-notebook">{DESK_NOTEBOOK_EMOJI}</span>
        </span>
        <span className="office-desk-slot office-desk-slot-right">
          <span className="office-desk-slot-icon">{snack}</span>
        </span>
      </div>
    </div>
  );
}
