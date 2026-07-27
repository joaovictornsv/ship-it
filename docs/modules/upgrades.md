# Upgrades

Producer IDs (Dev, Espresso machine, …), **Ship upgrades** (click power), and **building upgrades** (per-producer tokens/s mults).

**Status:** active — early ladder through On-call (#6); Dev / Espresso scene (#7); Ship upgrades one-shot track (#30); building upgrades (#37); prestige shop (#9); unlockable rooms (#11).

## Owned by

- `src/data/upgrades.ts` — producer catalog
- `src/data/shipUpgrades.ts` — Ship upgrade (click-power) catalog
- `src/data/buildingUpgrades.ts` — building upgrade (per-producer tokens/s) catalog
- `src/data/prestigeUpgrades.ts` — Rewrites prestige catalog
- `src/data/rooms.ts` — unlockable scene rooms (sticky map cosmetics)
- `src/features/shop/` — `ShopRail` / `ShopRow` / `ShopShipTile` / `ShopBuildingTile` / `ShopPrestigeRow`
- `src/game/economy.ts` — cost + tokens/s + `clickPower` + prestige helpers
- `src/game/state.ts` — `owned` / `shipOwned` / `buildingOwned` / `prestigeOwned` / `roomsUnlocked` + buy / rewrite actions
- `src/features/scene/` — `OfficeScene` from producer owned + active room; `onUpgradeOwnedChanged` on buy

## Split (locked)

| Track             | Job                                    | Cost model            | Resets on Rewrite |
| ----------------- | -------------------------------------- | --------------------- | ----------------- |
| Buildings         | tokens/s + scene presence              | Cookie `×1.15` owned  | Yes (run state)   |
| Ship upgrades     | tokens per click + light CTA evolution | One-shot fixed ladder | Yes (run state)   |
| Building upgrades | per-producer tokens/s multipliers      | One-shot fixed costs  | Yes (run state)   |
| Prestige          | permanent power (Rewrites currency)    | Rising Rewrites cost  | No (keep)         |

Espresso is **never** a click-power building. No producer row gains click side-effects. Building upgrades multiply a named producer’s tokens/s in place — they are **not** Dev tier promotion (junior → mid).

## Producer catalog

| ID                 | Name             | Role                                                                 | baseCost | tokens/s each | icon key      |
| ------------------ | ---------------- | -------------------------------------------------------------------- | -------- | ------------- | ------------- |
| `espresso-machine` | Espresso machine | First ladder building; **small tokens/s producer** (not click power) | 15       | 0.1           | `coffee`      |
| `dev`              | Dev              | Flagship producer line (grandma analog)                              | 100      | 1             | `dev`         |
| `code-review`      | Code review      | Mid ladder tokens/s                                                  | 1_100    | 8             | `code-review` |
| `ci-cd`            | CI / CD          | Automation ladder step                                               | 12_000   | 47            | `ci-cd`       |
| `on-call`          | On-call          | Late-early ladder step                                               | 130_000  | 260           | `on-call`     |

Constants: `ESPRESSO_MACHINE_ID`, `DEV_ID`, `CODE_REVIEW_ID`, `CI_CD_ID`, `ON_CALL_ID`.

Each producer def owns **`emoji`** and **`colorVar`** (shop / scene accents). Do not add parallel id→glyph or id→color maps in features.

**Catalog shape (intentional):** producers, Ship upgrades, and building upgrades stay as **typed def objects + ordered arrays** (`upgrades`, `shipUpgrades`, `buildingUpgrades`). Stable save `id` is a field on the def (not the `createEnum` key) so display `name` does not collide with enum `name`. Discrete sets (AppViews, SceneStages, effect kinds, upcoming achievements) use `createEnum`.

Shop order follows the table (early → late). Costs / rates are playtest starting points.

### Espresso machine (locked role)

- Buys with tokens; Cookie-style rising cost for owned count.
- Each owned unit adds **0.1 tokens/s** (playtest starting point), then × building-upgrade mults for that producer.
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

One-shot ladder in `src/data/shipUpgrades.ts`. Buy once → unlock next. Soft unlock after **any** producer is owned (`shipUpgradesUnlocked`). Combined shop queue (`visibleOneShotQueue`) shows the **next available (not owned)** Ship upgrade interleaved by cost with available building upgrades — owned and locked stay hidden; empty when none available (see Achievements for owned).

| ID                    | Name                | Effect   | cost       | CTA label (when highest) | icon key              |
| --------------------- | ------------------- | -------- | ---------- | ------------------------ | --------------------- |
| `rubber-duck`         | Rubber duck         | +1 flat  | 100        | Duck ship                | `rubber-duck`         |
| `mechanical-keyboard` | Mechanical keyboard | +2 flat  | 750        | Type & ship              | `mechanical-keyboard` |
| `standup`             | Standup             | +3 flat  | 2_000      | Stand & ship             | `standup`             |
| `stack-overflow-tab`  | Stack Overflow tab  | +5 flat  | 5_000      | Ship from SO             | `stack-overflow-tab`  |
| `sticky-notes`        | Sticky notes        | +8 flat  | 12_000     | Note & ship              | `sticky-notes`        |
| `dark-mode`           | Dark mode           | ×2 mult  | 35_000     | Ship after dark          | `dark-mode`           |
| `pair-programming`    | Pair programming    | +15 flat | 90_000     | Pair & ship              | `pair-programming`    |
| `lgtm-stamp`          | LGTM stamp          | ×2 mult  | 220_000    | LGTM ship                | `lgtm-stamp`          |
| `pomodoro`            | Pomodoro            | +25 flat | 600_000    | Focus ship               | `pomodoro`            |
| `green-build`         | Green build         | ×2 mult  | 1_800_000  | Green ship               | `green-build`         |
| `readme-driven`       | README-driven       | +50 flat | 5_000_000  | Docs & ship              | `readme-driven`       |
| `ship-it-friday`      | Ship-it Friday      | ×3 mult  | 15_000_000 | Friday ship              | `ship-it-friday`      |

Each Ship upgrade def owns **`emoji`** and **`colorVar`**. Shop / CTA helpers should read fields from the def (or thin wrappers), not parallel maps.

Effect kind labels / click-power folding live on `ShipUpgradeEffectKinds` + `shipUpgradeEffectLabel` / `applyShipUpgradeEffect` in `shipUpgrades.ts`.

```text
clickPower = (1 + Σ flats) × Π mults
```

Owned map: `GameState.shipOwned: Partial<Record<ShipUpgradeId, true>>`.

### Ship upgrade copy

| ID                    | Blurb                                            |
| --------------------- | ------------------------------------------------ |
| `rubber-duck`         | Explain the bug out loud. The duck ships anyway. |
| `mechanical-keyboard` | Clickier clicks. Neighbors included free.        |
| `standup`             | Fifteen minutes. Three updates. Zero decisions.  |
| `stack-overflow-tab`  | Copy, paste, pray, ship. Ancient ritual.         |
| `sticky-notes`        | The kanban that lives on your monitor bezel.     |
| `dark-mode`           | Same code. Twice the confidence.                 |
| `pair-programming`    | Two keyboards. One brain cell. Somehow faster.   |
| `lgtm-stamp`          | Looks good to merge. Tests optional.             |
| `pomodoro`            | Twenty-five minutes of focus. Five of snacks.    |
| `green-build`         | All checks passed. Nobody knows why.             |
| `readme-driven`       | Document it first. Implement never. Ship anyway. |
| `ship-it-friday`      | No review Friday. Weekend on-call included.      |

## Building upgrades (per-producer tokens/s)

One-shot multipliers in `src/data/buildingUpgrades.ts` (Cookie “grandma / building upgrade” pattern). Soft unlock when the player owns **`unlockAt`** of the target producer (v1: `1` for each). Buy once; several can appear in the queue at once (unlike the Ship ladder). Reuse the target producer’s **`colorVar`** / emoji warmth — no new shell tokens.

| ID               | Name           | Target           | Unlock | Effect | cost      |
| ---------------- | -------------- | ---------------- | ------ | ------ | --------- |
| `double-shot`    | Double shot    | Espresso machine | 1      | ×2     | 500       |
| `second-monitor` | Second monitor | Dev              | 1      | ×2     | 5_000     |
| `rubber-stamp`   | Rubber stamp   | Code review      | 1      | ×2     | 55_000    |
| `matrix-builds`  | Matrix builds  | CI / CD          | 1      | ×2     | 600_000   |
| `follow-the-sun` | Follow-the-sun | On-call          | 1      | ×2     | 6_500_000 |

Effect labels / folding: `BuildingUpgradeEffectKinds` + `buildingUpgradeEffectLabel` / `applyBuildingUpgradeEffect` / `producerTokensPerSecondMult`.

```text
producerRate = owned × baseRate × Π buildingMults(target)
tokens/s = Σ producerRate × prestigeMult
```

Owned map: `GameState.buildingOwned: Partial<Record<BuildingUpgradeId, true>>`.

### Building upgrade copy

| ID               | Blurb                                              |
| ---------------- | -------------------------------------------------- |
| `double-shot`    | Twice the drip. Same tiny machine. Somehow louder. |
| `second-monitor` | Twice the tabs. Same one brain cell.               |
| `rubber-stamp`   | LGTM, but louder. Tests still optional.            |
| `matrix-builds`  | Parallel pipelines. Parallel blame.                |
| `follow-the-sun` | Someone is always awake. Usually you.              |

## Owned state

- `GameState.owned` — producer counts (missing key = 0)
- `GameState.shipOwned` — one-shot Ship flags (missing key = not owned)
- `GameState.buildingOwned` — one-shot building-upgrade flags (missing key = not owned)
- `GameState.roomsUnlocked` / `activeRoom` — sticky scene rooms (see `scene.md`); not purchased — unlocked by owned / Rewrites thresholds

## Scene hooks

`onUpgradeOwnedChanged(id, owned)` fans out spawn FX for **producers** only. Ship / building upgrades do not spawn office props in v1. Buying Espresso / Code review / CI (and banking a Rewrite) also unlocks map rooms via `newlyUnlockedRooms` — see `scene.md`.

## Notes

- Upgrade IDs are stable; renames need a save migrator.
- Further ladder rows / multipliers can extend catalogs without renaming existing IDs.
