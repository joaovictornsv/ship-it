/** Rotating Dev faces so the office crowd feels a bit more alive. */

export const DEV_EMOJIS = ['🧑‍💻', '👨‍💻', '👩‍💻', '🧑‍🔧', '🤓', '🤖'] as const;

export function devEmojiForIndex(index: number): string {
  return DEV_EMOJIS[index % DEV_EMOJIS.length]!;
}
