# Saves

Versioned single-slot persistence: autosave, SHA-256 integrity, base64 export/import.

**Status:** active — MVP contract from TECHNICAL §3 (issue #5); prestige fields in v3 (issue #9).

## Owned by

- `src/features/save/` — codec, storage, autosave hooks, export/import UI
- `src/game/state.ts` — `hydrateFromSave`, `saveUntrusted`, persisted slice

## Schema

```ts
type SaveFile = {
  v: number; // schema version (CURRENT_SAVE_VERSION = 3)
  savedAt: number; // epoch ms
  state: GameState; // tokens, owned, shipOwned, tokensEarnedThisRun, rewrites, prestigeOwned, lastTickAt
  checksum: string; // SHA-256 hex of canonical state JSON
};
```

**Wire / storage format:** `base64(JSON.stringify(SaveFile))` in `localStorage` key `ship-it.save` (single slot).

## Checksum

- Payload = `stableStringify(state)` (recursively sorted object keys).
- Algorithm = SHA-256 via Web Crypto (`crypto.subtle`).
- On mismatch: **load anyway**, set `saveUntrusted`, show dismissible banner.
- Deterrence only — see `security.md`.
- Older blobs omit later fields (`shipOwned`, prestige); `readRawGameState` preserves wire shape so pre-migration checksums still match.

## Autosave

- Trailing ~1.5s window after **tokens / owned / shipOwned / tokensEarnedThisRun / rewrites / prestigeOwned** changes (`lastTickAt`-only tick noise does not schedule; an already-pending timer is not reset).
- Autosave + production tick stay **disabled until hydrate finishes** (avoids writing an empty store over a good slot).
- Flush on `visibilitychange` → `hidden` and on `pagehide`; prefers a warmed base64 blob for a **sync** `localStorage` write.
- On hydrate: restore all persisted fields; set `lastTickAt` to now (**no offline accrual**).

## Migrations

- `migrateSaveFile` walks `v` up to `CURRENT_SAVE_VERSION` via ordered migrators.
- **v1 → v2:** add `shipOwned: {}` (Ship upgrades click-power track). v1 blobs omit `shipOwned` so pre-migration checksums still match.
- **v2 → v3:** add `tokensEarnedThisRun: 0`, `rewrites: 0`, `prestigeOwned: {}`. Mid-run v2 saves get **no retroactive** earn credit.
- Bump `v` only with an explicit migrator + tests.

## Export / import

- **Export:** download `ship-it-save.txt` (base64 blob).
- **Import:** file upload or paste; writes the single slot after a successful parse.
- Soft plausibility warnings (negative tokens / Rewrites, unknown upgrade / ship / prestige ids) never block play.

## Player UI

- **Play screen:** no export/import panel — clicker + shop only. Autosave + hydrate still run in the app shell.
- **Save view:** dedicated screen (`#/save` via lightweight hash nav) mounts export / import file / paste (`SaveControls`). Header **Save** / **Back to play** (and brand → play) switches views without touching the save slot.
- Untrusted banner stays global/shell (not tied to the Save view).
- Chrome follows `docs/modules/ui.md` (`--ship-*` tokens).
