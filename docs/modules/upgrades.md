# Upgrades

Producer IDs (Dev, Espresso machine, …) and the separate **Ship upgrades** click-power track.

**Status:** active — early ladder through On-call (#6); Dev / Espresso scene (#7); Ship upgrades one-shot track (#30).

## Owned by

- `src/data/upgrades.ts` — producer catalog
- `src/data/shipUpgrades.ts` — Ship upgrade (click-power) catalog
- `src/features/shop/` — `ShopRail` / `ShopRow` / `ShopShipRow`
- `src/game/economy.ts` — cost + tokens/s + `clickPower`
- `src/game/state.ts` — `owned` / `shipOwned` + buy actions
- `src/features/scene/` — `OfficeScene` from producer owned; `onUpgradeOwnedChanged` on buy

## Split (locked)

| Track         | Job                                    | Cost model            | Resets on Rewrite (#9) |
| ------------- | -------------------------------------- | --------------------- | ---------------------- |
| Buildings     | tokens/s + scene presence              | Cookie `×1.15` owned  | Yes (run state)        |
| Ship upgrades | tokens per click + light CTA evolution | One-shot fixed ladder | Yes (run state)        |
| Muscle memory | permanent % on click (prestige shop)   | Rewrites currency     | No (keep)              |

Espresso is **never** a click-power building. No producer row gains click side-effects.

## Producer catalog

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
- Scene presence: minimal coffee prop in `OfficeScene` when owned ≥ 1.

### Dev (flagship)

- Core tokens/s producer; visible DOM Devs + LOD / milestone stages in `OfficeScene` (#7).
- One tier for now (no Intern; no junior→mid promote yet).

### Producer copy

| ID                 | Name             | Blurb                                                   |
| ------------------ | ---------------- | ------------------------------------------------------- |
| `espresso-machine` | Espresso machine | A tiny drip of automation. Smells like progress.        |
| `dev`              | Dev              | Ships features and coffee cups in equal measure.        |
| `code-review`      | Code review      | Two pairs of eyes, one LGTM, zero tests.                |
| `ci-cd`            | CI / CD          | Green checks soothe the soul. Red ones build character. |
| `on-call`          | On-call          | Pager duty: the original idle notification.             |

## Ship upgrades (click-power track)

One-shot ladder in `src/data/shipUpgrades.ts`. Buy once → unlock next. Soft unlock after **any** producer is owned (`shipUpgradesUnlocked`).

| ID                    | Name                | Effect  | cost    | CTA label (when highest) | icon key              |
| --------------------- | ------------------- | ------- | ------- | ------------------------ | --------------------- |
| `rubber-duck`         | Rubber duck         | +1 flat | 100     | Ship It                  | `rubber-duck`         |
| `mechanical-keyboard` | Mechanical keyboard | +2 flat | 750     | Type & ship              | `mechanical-keyboard` |
| `stack-overflow-tab`  | Stack Overflow tab  | +5 flat | 4_000   | Ship from SO             | `stack-overflow-tab`  |
| `dark-mode`           | Dark mode           | ×2 mult | 25_000  | Ship after dark          | `dark-mode`           |
| `lgtm-stamp`          | LGTM stamp          | ×2 mult | 150_000 | LGTM ship                | `lgtm-stamp`          |

```text
clickPower = (1 + Σ flats) × Π mults
```

Owned map: `GameState.shipOwned: Partial<Record<ShipUpgradeId, true>>`.

### Ship upgrade copy

| ID                    | Blurb                                            |
| --------------------- | ------------------------------------------------ |
| `rubber-duck`         | Explain the bug out loud. The duck ships anyway. |
| `mechanical-keyboard` | Clickier clicks. Neighbors included free.        |
| `stack-overflow-tab`  | Copy, paste, pray, ship. Ancient ritual.         |
| `dark-mode`           | Same code. Twice the confidence.                 |
| `lgtm-stamp`          | Looks good to merge. Tests optional.             |

## Owned state

- `GameState.owned` — producer counts (missing key = 0)
- `GameState.shipOwned` — one-shot flags (missing key = not owned)

## Scene hooks

`onUpgradeOwnedChanged(id, owned)` fans out spawn FX for **producers** only. Ship upgrades do not spawn office props in v1.

## Notes

- Upgrade IDs are stable; renames need a save migrator.
- Further ladder rows / multipliers can extend catalogs without renaming existing IDs.
