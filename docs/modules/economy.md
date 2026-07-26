# Economy

Formulas, cost curves, beans/s, click power, number formatting (K/M/B).

**Status:** active — click power, Cookie-style costs, Espresso beans/s + tick (issue #4).

## Owned by

- `src/game/economy.ts` — pure formulas
- `src/game/tick.ts` — pure production tick / resume helpers
- `src/game/state.ts` — Zustand store (`beans`, `owned`, `lastTickAt`, actions)
- `src/game/types.ts` — shared `Beans` / `OwnedUpgrades` / `GameState`
- `src/features/click/` — Ship It button + bank UI (beans + beans/s)
- `src/features/shop/` — minimal Espresso buy row + `useProductionTick`
- related Vitest coverage (`economy.test.ts`, `tick.test.ts`, `state.test.ts`)

## Click power / bank

| Concept       | Contract                                                               |
| ------------- | ---------------------------------------------------------------------- |
| Currency      | Coffee beans (`Beans`)                                                 |
| Bank          | `GameState.beans` in Zustand (`useGameStore`)                          |
| Click action  | `shipIt()` adds `clickPower()` beans; returns amount for floating `+N` |
| Base power    | `clickPower()` → `1` (no modifiers yet)                                |
| Persistence   | None yet — in-memory only until saves (#5)                             |
| UI rate label | **beans/s** (`beansPerSecond(owned)` in header)                        |

## Cost curve

Cookie-style exponential (no hard cap):

```text
cost(owned) = ceil(baseCost × 1.15 ^ owned)
```

- Constant: `COST_GROWTH = 1.15` in `economy.ts`
- Helper: `upgradeCost(baseCost, owned)` / `nextUpgradeCost(id, owned)`

## Beans/s + tick

| Concept          | Contract                                                                                      |
| ---------------- | --------------------------------------------------------------------------------------------- |
| Rate             | `beansPerSecond(owned)` — sum of `owned[id] × def.beansPerSecond`                             |
| Accrual          | `beansFromDelta(bps, deltaMs)` → `bps × deltaMs / 1000`                                       |
| Open-tab tick    | `applyProductionTick(state, nowMs)` via store `tick(nowMs)` (~100ms)                          |
| Clock            | Injectable `nowMs` / `Clock` — tests pass fake times                                          |
| Offline / resume | **No accrual.** `resumeWithoutAccrual(nowMs)` / `resumeFromHidden` only advances `lastTickAt` |
| Visibility       | On `hidden`: flush tick; on `visible`: resume without grant                                   |

## Notes

- Exact costs / prestige `K` are playtest-tuned (see PRODUCT / ISSUES).
- Keep helpers in `economy.ts` / `tick.ts` pure and unit-tested; store only applies results.
