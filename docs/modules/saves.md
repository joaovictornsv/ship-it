# Saves

Versioned single-slot persistence: autosave, SHA-256 integrity, base64 export/import.

**Status:** active — MVP contract from TECHNICAL §3 (issue #5).

## Owned by

- `src/features/save/` — codec, storage, autosave hooks, export/import UI
- `src/game/state.ts` — `hydrateFromSave`, `saveUntrusted`, persisted slice

## Schema

```ts
type SaveFile = {
  v: number; // schema version (CURRENT_SAVE_VERSION = 1)
  savedAt: number; // epoch ms
  state: GameState; // tokens, owned, lastTickAt
  checksum: string; // SHA-256 hex of canonical state JSON
};
```

**Wire / storage format:** `base64(JSON.stringify(SaveFile))` in `localStorage` key `ship-it.save` (single slot).

## Checksum

- Payload = `stableStringify(state)` (recursively sorted object keys).
- Algorithm = SHA-256 via Web Crypto (`crypto.subtle`).
- On mismatch: **load anyway**, set `saveUntrusted`, show dismissible banner.
- Deterrence only — see `security.md`.

## Autosave

- Debounced ~1.5s after tokens / owned / `lastTickAt` changes.
- Flush on `visibilitychange` → `hidden` and on `pagehide`.
- On hydrate: restore tokens + owned; set `lastTickAt` to now (**no offline accrual**).

## Migrations

- `migrateSaveFile` walks `v` up to `CURRENT_SAVE_VERSION` via ordered migrators.
- v1 ships with an empty migrator map (hook ready). Bump `v` only with an explicit migrator + tests.

## Export / import

- **Export:** download `ship-it-save.txt` (base64 blob).
- **Import:** file upload or paste; writes the single slot after a successful parse.
- Soft plausibility warnings (negative tokens, unknown upgrade ids) never block play.

## Player UI

- Untrusted banner + Save panel follow `docs/modules/ui.md` (`--ship-*` tokens).
