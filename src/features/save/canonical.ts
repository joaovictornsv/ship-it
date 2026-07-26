/**
 * Stable JSON stringify with recursively sorted object keys.
 * Used as the checksum payload for `SaveFile.state`.
 */
export function stableStringify(value: unknown): string {
  return JSON.stringify(value, (_key, nested) => {
    if (
      nested !== null &&
      typeof nested === 'object' &&
      !Array.isArray(nested)
    ) {
      return Object.fromEntries(
        Object.entries(nested as Record<string, unknown>).sort(([a], [b]) =>
          a.localeCompare(b),
        ),
      );
    }
    return nested;
  });
}
