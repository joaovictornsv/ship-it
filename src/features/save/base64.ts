/** UTF-8 string → standard base64 (browser `btoa` or Node `Buffer`). */
export function encodeBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  if (typeof btoa === 'function') {
    let binary = '';
    for (const byte of bytes) {
      binary += String.fromCharCode(byte);
    }
    return btoa(binary);
  }
  return Buffer.from(bytes).toString('base64');
}

/** Standard base64 → UTF-8 string. Throws on invalid input. */
export function decodeBase64(b64: string): string {
  const trimmed = b64.trim();
  if (typeof atob === 'function') {
    const binary = atob(trimmed);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  }
  return Buffer.from(trimmed, 'base64').toString('utf8');
}
