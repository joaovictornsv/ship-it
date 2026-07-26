import type { Beans } from './types';

/**
 * Beans earned per Ship It click.
 * Base click power is 1; modifiers land with later upgrades / prestige.
 */
export function clickPower(): Beans {
  return 1;
}
