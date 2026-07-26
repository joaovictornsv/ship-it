/** Emoji glyphs for shop rows + office presence (warmer than monochrome Lucide). */

import type { UpgradeIconId } from '../../data/upgrades';

export const UPGRADE_EMOJI: Record<UpgradeIconId, string> = {
  coffee: '☕',
  dev: '🧑‍💻',
  'code-review': '👀',
  'ci-cd': '🚦',
  'on-call': '📟',
};

/** Rotating Dev faces so the office crowd feels a bit more alive. */
export const DEV_EMOJIS = ['🧑‍💻', '👨‍💻', '👩‍💻', '🧑‍🔧', '🤓', '🤖'] as const;

export function devEmojiForIndex(index: number): string {
  return DEV_EMOJIS[index % DEV_EMOJIS.length]!;
}
