import { createEnum, getEnumByName } from '../../lib/createEnum';

/** Session key for the shop bulk-buy mode control. */
export const BUY_MODE_STORAGE_KEY = 'ship-it:shop-buy-mode';

/**
 * Building buy multipliers (Cookie-style). `max` resolves quantity from the bank.
 * Ship upgrades stay one-shot and ignore this control.
 */
export const BuyModes = createEnum({
  x1: { label: '×1', fixedQuantity: 1 },
  x10: { label: '×10', fixedQuantity: 10 },
  x100: { label: '×100', fixedQuantity: 100 },
  max: { label: 'Max', fixedQuantity: null as null },
});

export type BuyModeName = keyof typeof BuyModes;

export const BUY_MODE_ORDER: BuyModeName[] = ['x1', 'x10', 'x100', 'max'];

export const DEFAULT_BUY_MODE: BuyModeName = 'x1';

export function isBuyModeName(value: string): value is BuyModeName {
  return getEnumByName(BuyModes, value) != null;
}

export function readBuyModeFromSession(): BuyModeName {
  if (typeof sessionStorage === 'undefined') {
    return DEFAULT_BUY_MODE;
  }
  try {
    const raw = sessionStorage.getItem(BUY_MODE_STORAGE_KEY);
    if (raw && isBuyModeName(raw)) {
      return raw;
    }
  } catch {
    // Ignore quota / private-mode failures; fall back to default.
  }
  return DEFAULT_BUY_MODE;
}

export function writeBuyModeToSession(mode: BuyModeName): void {
  if (typeof sessionStorage === 'undefined') {
    return;
  }
  try {
    sessionStorage.setItem(BUY_MODE_STORAGE_KEY, mode);
  } catch {
    // Ignore quota / private-mode failures.
  }
}
