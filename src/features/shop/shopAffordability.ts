import { upgrades, type UpgradeId } from '../../data/upgrades';
import { maxAffordableOf, nextUpgradeCostForN } from '../../game/economy';
import type {
  OwnedBuildingUpgrades,
  OwnedShipUpgrades,
  OwnedUpgrades,
  Tokens,
} from '../../game/types';
import { BuyModes, type BuyModeName } from './buyMode';
import { visibleOneShotQueue } from './visibleOneShotQueue';

/**
 * Whether a building row buy control would be enabled for the given mode.
 * Mirrors {@link ShopRow} cost / quantity rules.
 */
export function canAffordBuildingPurchase(
  id: UpgradeId,
  owned: number,
  tokens: Tokens,
  buyMode: BuyModeName,
): boolean {
  const fixedQuantity = BuyModes[buyMode].fixedQuantity;
  const quantity =
    fixedQuantity == null ? maxAffordableOf(id, owned, tokens) : fixedQuantity;
  if (quantity <= 0) {
    return false;
  }
  const previewQuantity = Math.max(quantity, fixedQuantity ?? 1);
  const previewCost = nextUpgradeCostForN(id, owned, previewQuantity);
  return tokens >= previewCost;
}

export type ShopAffordabilityInput = {
  tokens: Tokens;
  owned: OwnedUpgrades;
  shipOwned: OwnedShipUpgrades;
  buildingOwned: OwnedBuildingUpgrades;
  buyMode: BuyModeName;
};

/**
 * True when at least one normal-shop purchase is affordable right now:
 * buildings (respecting bulk buy mode) or visible one-shot Ship / building
 * upgrades. Prestige / Rewrites shop is out of scope (#49).
 */
export function hasAffordableShopPurchase({
  tokens,
  owned,
  shipOwned,
  buildingOwned,
  buyMode,
}: ShopAffordabilityInput): boolean {
  for (const upgrade of upgrades) {
    if (
      canAffordBuildingPurchase(
        upgrade.id,
        owned[upgrade.id] ?? 0,
        tokens,
        buyMode,
      )
    ) {
      return true;
    }
  }

  for (const item of visibleOneShotQueue(owned, shipOwned, buildingOwned)) {
    if (tokens >= item.cost) {
      return true;
    }
  }

  return false;
}
