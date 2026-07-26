/** Emoji glyphs for shop rows + office presence (warmer than monochrome Lucide). */

import type { UpgradeIconId } from '../../data/upgrades';
import { getUpgradeByIcon } from '../../data/upgrades';

/** Icon → emoji via catalog entry (no parallel table). */
export const UPGRADE_EMOJI: Record<UpgradeIconId, string> = {
  coffee: getUpgradeByIcon('coffee').emoji,
  dev: getUpgradeByIcon('dev').emoji,
  'code-review': getUpgradeByIcon('code-review').emoji,
  'ci-cd': getUpgradeByIcon('ci-cd').emoji,
  'on-call': getUpgradeByIcon('on-call').emoji,
};

/** Rotating Dev faces so the office crowd feels a bit more alive. */
export const DEV_EMOJIS = ['🧑‍💻', '👨‍💻', '👩‍💻', '🧑‍🔧', '🤓', '🤖'] as const;

export function devEmojiForIndex(index: number): string {
  return DEV_EMOJIS[index % DEV_EMOJIS.length]!;
}
