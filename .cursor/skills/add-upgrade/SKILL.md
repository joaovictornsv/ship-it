---
name: add-upgrade
description: >-
  Add a producer, Ship upgrade, building upgrade, or prestige catalog entry
  with shop/scene hooks, module docs, and Vitest coverage. Use when adding or
  extending upgrade definitions.
---

# add-upgrade

Add catalog content the Ship It way: **fields on the def**, not parallel maps.

## Choose a track

| Track             | Catalog file                   | State field     | Module docs                                              |
| ----------------- | ------------------------------ | --------------- | -------------------------------------------------------- |
| Producer building | `src/data/upgrades.ts`         | `owned`         | `upgrades.md`, `economy.md`, `shop.md`, often `scene.md` |
| Ship (click)      | `src/data/shipUpgrades.ts`     | `shipOwned`     | `upgrades.md`, `economy.md`, `shop.md`                   |
| Building upgrade  | `src/data/buildingUpgrades.ts` | `buildingOwned` | `upgrades.md`, `economy.md`, `shop.md`                   |
| Prestige          | `src/data/prestigeUpgrades.ts` | `prestigeOwned` | `upgrades.md`, `prestige.md`, `economy.md`               |

Read the matching docs **before** editing.

## Checklist

1. **Stable `id`** — kebab-case string constant; do not rename without `save-migrate`.
2. **Def owns presentation** — `name`, `blurb`, `emoji`, `colorVar` (and cost / effect fields) on the def. No `UPGRADE_EMOJI` / color `Record` beside the catalog.
3. **Wire economy** — pure helpers in `src/game/economy.ts` (+ tests via `write-tests`).
4. **Wire state** — buy / owned maps in `src/game/state.ts` / types if a new map field is required (that usually needs a save migrator).
5. **Shop UI** — row/tile picks fields from the def; follow `docs/modules/ui.md` + `shop.md`.
6. **Scene** — only if the producer should appear in `OfficeScene`; update `scene.md`.
7. **Docs** — update `docs/modules/upgrades.md` (and economy/shop/scene/prestige as needed) in the same PR (`update-docs`).
8. **Tests** — cost/effect/queue visibility as applicable (`*.test.ts`).

## Do not

- Put click-power on producer buildings (Espresso is never click power).
- Invent balance as a product decision — tune constants, document in economy/upgrades.
- Skip module docs.
