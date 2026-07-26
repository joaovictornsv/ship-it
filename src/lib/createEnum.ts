/**
 * Build a name-keyed enum object. Each entry gets `name` (the key) and
 * insertion `index`, plus optional shared `defaultFields`.
 *
 * Prefer putting per-value behavior on entries (methods / fields) instead of
 * scattered if-chains, switch maps, or parallel Record tables keyed by the
 * same names. Resolve with `Enum[storedName]` or `getEnumByName`.
 */

type EnumEntryFields = Record<string, unknown>;

export type CreateEnumOptions<
  TDefault extends EnumEntryFields = EnumEntryFields,
> = {
  defaultFields?: TDefault;
};

export type EnumEntry<
  TName extends string,
  TValue extends EnumEntryFields,
  TDefault extends EnumEntryFields = EnumEntryFields,
> = TDefault &
  TValue & {
    name: TName;
    index: number;
  };

export type EnumObject<
  T extends Record<string, EnumEntryFields>,
  TDefault extends EnumEntryFields = EnumEntryFields,
> = {
  [K in keyof T]: EnumEntry<K & string, T[K], TDefault>;
};

export function createEnum<
  const T extends Record<string, EnumEntryFields>,
  TDefault extends EnumEntryFields = EnumEntryFields,
>(obj: T, options: CreateEnumOptions<TDefault> = {}): EnumObject<T, TDefault> {
  return Object.entries(obj).reduce(
    (acc, [key, value], index) => {
      acc[key as keyof T] = {
        ...options.defaultFields,
        name: key,
        index,
        ...value,
      } as EnumObject<T, TDefault>[keyof T];
      return acc;
    },
    {} as EnumObject<T, TDefault>,
  );
}

/** Lookup by stored `name` (enum key). Missing / nullish → `null`. */
export function getEnumByName<T extends Record<string, { name: string }>>(
  enumObject: T,
  name: string | null | undefined,
): T[keyof T] | null {
  if (name == null || name === '') {
    return null;
  }
  return (enumObject[name as keyof T] as T[keyof T] | undefined) ?? null;
}
