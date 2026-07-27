---
name: save-migrate
description: >-
  Bump save schema version with an ordered migrator, Vitest coverage, and
  saves.md update. Use when adding persisted fields or renaming save IDs.
---

# save-migrate

Every persisted shape change needs an explicit migrator + tests + docs.

## Owned by

- `src/features/save/migrate.ts` — ordered `v → v+1` migrators
- `src/features/save/types.ts` — `CURRENT_SAVE_VERSION`, `SaveFile`
- `src/features/save/parseState.ts` / `codec.ts` — parse + round-trip
- `docs/modules/saves.md` — schema + migration notes
- `docs/modules/security.md` — if threat model assumptions change

## Checklist

1. Read `docs/modules/saves.md` and current `CURRENT_SAVE_VERSION`.
2. Add migrator `n` that upgrades a save at version `n` to `n + 1` (defaults for new fields; preserve existing).
3. Bump `CURRENT_SAVE_VERSION` to `n + 1`.
4. Update `GameState` / parse helpers so new fields are typed and defaulted.
5. **Tests** (`write-tests`): old blob → migrates; checksum behavior on legacy wire shape; unknown newer `v` still fails closed.
6. **Docs** (`update-docs`): document the new migration bullet in `saves.md`.
7. Run audit tier of `check-quality` before PR (save/security).

## Rules

- Mid-run legacy saves: prefer **no retroactive** earn/prestige credit unless PRODUCT says otherwise.
- Renaming upgrade IDs requires a migrator that rewrites owned maps.
- Checksum remains deterrence-only: mismatch → load anyway + untrusted banner.

## Do not

- Bump `v` without a migrator.
- Break export/import base64 single-slot contract without a tracked decision.
