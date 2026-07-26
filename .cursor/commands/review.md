# Review (check-quality tier)

Run the **code review tier** on current changes under `src/` (and matching `docs/modules/` when contracts move).

Read [`.cursor/check-quality-reference.md`](../check-quality-reference.md) first for scope and the review-tier report template.

Use this command alone for a targeted REVIEW.md / enum pass. When invoked as part of `/check-quality`, run only after the verify tier passes.

## Pipeline (run in this order)

### 1. Enum logic centralization

Review changed files under `src/` for **spread logic that belongs on `createEnum` entries** (or catalog entry fields) instead of scattered helpers, hooks, or UI maps.

**Be pragmatic.** Only flag issues in the **diff** (or code directly touched by the change) where per-value behavior is implemented outside the enum / catalog module. If the diff has no `createEnum` usage and no per-enum-value branching or builders, mark this step as **pass (skipped)**.

#### When this applies

- The change introduces or modifies a `createEnum` definition (`src/lib/createEnum.ts`, or modules that call it such as `src/app/appView.ts`, `src/features/scene/stages.ts`).
- The change adds **per-value branching** (`if (view === 'save')`, `switch (stage.id)`, maps keyed by id / icon / kind).
- The change adds **per-value builder functions** or parallel `Record<Id, …>` tables (emoji, color, labels, order) that only serve one catalog member.

#### Required pattern

Each enum / catalog entry owns behavior for **its** value. Call sites resolve by stored name or id:

```ts
const entry = AppViews[view]; // .name === key
const hash = entry.getHash();

// or catalog defs:
const color = upgrade.colorVar;
const glyph = upgrade.emoji;
```

- Use `createEnum` / `getEnumByName` from `src/lib/createEnum.ts` for discrete named sets (views, stages, kinds, origins).
- Rich catalogs (`src/data/upgrades.ts`, `src/data/shipUpgrades.ts`) may stay as typed defs + arrays; still put **per-id fields** (emoji, colorVar, CTA, …) on the def — not parallel shop maps.
- Methods / helpers on entries accept **plain data context** only — not React components or Zustand stores.
- UI may map icon keys to glyphs when needed; prefer reading `def.emoji` / `def.colorVar` when the def is already in hand.

#### Red flags (report and fix when introduced by the change)

| Smell                                                               | Prefer                                                           |
| ------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `if (view === 'save')` / `if (view === 'achievements')` hash chains | `AppViews[view].getHash()` / fields on `AppViews`                |
| `STAGE_EMPTY_DESKS[stage.id]` parallel to `SCENE_STAGES`            | `emptyDesks` (and similar) on `SceneStages` entries              |
| `UPGRADE_EMOJI` / `BY_ID` color maps beside `upgrades`              | `emoji` / `colorVar` on each `UpgradeDef`                        |
| `SHIP_UPGRADE_EMOJI` / ship color `Record`s beside `shipUpgrades`   | `emoji` / `colorVar` on each `ShipUpgradeDef`                    |
| Hardcoded order arrays that duplicate catalog order                 | `index` from `createEnum`, or the existing ordered catalog array |
| Per-kind if-chains for titles / labels / icons                      | Methods or fields on the enum entry; resolve with `Enum[name]`   |

If the change only **consumes** enums / defs correctly, or touches them with no per-value logic, mark this step as **pass** with no changes.

### 2. Code quality review

Read **REVIEW.md** at the repo root.

Review only the changed files under `src/` (and related docs) against those guidelines.

**Be rigorous.** Flag bugs, incorrect behavior, maintainability risks, naming inconsistencies, duplication, missing early returns, UI pattern violations vs `docs/modules/ui.md`, missing tests for new pure branching, debug artifacts, and style or structure improvements even when ESLint passes.

Read the full file when needed, not just the diff. Legacy issues **inside** changed files are in scope.

If every guideline in REVIEW.md is fully satisfied, mark this step as **pass** with no changes.

## Final report

Emit the **review-tier report** from [`.cursor/check-quality-reference.md`](../check-quality-reference.md).
