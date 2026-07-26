import { stableStringify } from './canonical';
import type { GameState } from '../../game/types';

/** SHA-256 hex digest of UTF-8 bytes (Web Crypto — works in browser + Node 24). */
export async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Canonical checksum payload for a game state snapshot. */
export function canonicalStateJson(state: GameState): string {
  return stableStringify(state);
}

export async function checksumState(state: GameState): Promise<string> {
  return sha256Hex(canonicalStateJson(state));
}
