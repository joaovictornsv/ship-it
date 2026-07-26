import { upgrades } from '../../data/upgrades';
import { ShopRow } from './ShopRow';

/** Shared upgrade list for the desktop rail and mobile drawer. */
export function ShopCatalog() {
  return (
    <ul className="flex list-none flex-col gap-3 p-0">
      {upgrades.map((upgrade) => (
        <li key={upgrade.id}>
          <ShopRow upgrade={upgrade} />
        </li>
      ))}
    </ul>
  );
}
