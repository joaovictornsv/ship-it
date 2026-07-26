# Upgrades

Upgrade IDs (Dev, Espresso machine, …), tiers, shop copy, shop ↔ scene hooks.

**Status:** active — early ladder through On-call (issue #6). Scene presence in #7.

## Owned by

- `src/data/upgrades.ts` — catalog definitions
- `src/features/shop/` — `ShopRail` / `ShopRow`
- `src/game/economy.ts` — cost + tokens/s from owned counts
- `src/game/state.ts` — `owned` map + `buyUpgrade`
- `src/features/scene/hooks.ts` — stub notify on purchase until #7

## Catalog

| ID                 | Name             | Role                                                                 | baseCost | tokens/s each | icon key      |
| ------------------ | ---------------- | -------------------------------------------------------------------- | -------- | ------------- | ------------- |
| `espresso-machine` | Espresso machine | First ladder building; **small tokens/s producer** (not click power) | 15       | 0.1           | `coffee`      |
| `dev`              | Dev              | Flagship producer line (grandma analog)                              | 100      | 1             | `dev`         |
| `code-review`      | Code review      | Mid ladder tokens/s                                                  | 1_100    | 8             | `code-review` |
| `ci-cd`            | CI / CD          | Automation ladder step                                               | 12_000   | 47            | `ci-cd`       |
| `on-call`          | On-call          | Late-early ladder step                                               | 130_000  | 260           | `on-call`     |

Constants: `ESPRESSO_MACHINE_ID`, `DEV_ID`, `CODE_REVIEW_ID`, `CI_CD_ID`, `ON_CALL_ID`.

Shop order follows the table (early → late). Costs / rates are playtest starting points.

### Espresso machine (locked role)

- Buys with tokens; Cookie-style rising cost for owned count.
- Each owned unit adds **0.1 tokens/s** (playtest starting point).
- Shop copy should read naturally in tokens (“15 tokens”, not abstract CPS).
- Scene presence (machine / mugs) lands with the living office (#7) — not required here.

### Dev (flagship)

- Core tokens/s producer; visible characters land in #7.
- One tier for now (no Intern; no junior→mid promote yet).

### Copy

| ID                 | Name             | Blurb                                                   |
| ------------------ | ---------------- | ------------------------------------------------------- |
| `espresso-machine` | Espresso machine | A tiny drip of automation. Smells like progress.        |
| `dev`              | Dev              | Ships features and coffee cups in equal measure.        |
| `code-review`      | Code review      | Two pairs of eyes, one LGTM, zero tests.                |
| `ci-cd`            | CI / CD          | Green checks soothe the soul. Red ones build character. |
| `on-call`          | On-call          | Pager duty: the original idle notification.             |

## Owned state

`GameState.owned: Partial<Record<UpgradeId, number>>` — missing key means 0.

## Scene hooks

`onUpgradeOwnedChanged(id, owned)` is a no-op stub until #7. Shop calls it after a successful buy.

## Notes

- Upgrade IDs are stable; renames need a save migrator.
- Further ladder rows / multipliers can extend the catalog without renaming existing IDs.
