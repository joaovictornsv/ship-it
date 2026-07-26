# Economy

Formulas, cost curves, tokens/s, click power, number formatting (K/M/B).

**Status:** active — click power, Cookie-style costs, Espresso tokens/s + tick (issue #4).

## Owned by

- `src/game/economy.ts` — pure formulas
- `src/game/tick.ts` — pure production tick / resume helpers
- `src/game/state.ts` — Zustand store (`tokens`, `owned`, `lastTickAt`, actions)
- `src/game/types.ts` — shared `Tokens` / `OwnedUpgrades` / `GameState`
- `src/features/click/` — Ship It button + bank UI (tokens + tokens/s)
- `src/features/shop/` — minimal Espresso buy row + `useProductionTick`
- related Vitest coverage (`economy.test.ts`, `tick.test.ts`, `state.test.ts`)

## Click power / bank

| Concept       | Contract                                                                |
| ------------- | ----------------------------------------------------------------------- |
| Currency      | Tokens (`Tokens`)                                                       |
| Bank          | `GameState.tokens` in Zustand (`useGameStore`)                          |
| Click action  | `shipIt()` adds `clickPower()` tokens; returns amount for floating `+N` |
| Base power    | `clickPower()` → `1` (no modifiers yet)                                 |
| Persistence   | Versioned save via `src/features/save/` (see `saves.md`)                |
| UI rate label | **tokens/s** (`tokensPerSecond(owned)` in header)                       |
| UI integers   | Bank + rate display `Math.floor` (no decimals in `TokensBank`)          |

## Cost curve

Cookie-style exponential (no hard cap):

```text
cost(owned) = ceil(baseCost × 1.15 ^ owned)
```

- Constant: `COST_GROWTH = 1.15` in `economy.ts`
- Helper: `upgradeCost(baseCost, owned)` / `nextUpgradeCost(id, owned)`

## Tokens/s + tick

| Concept          | Contract                                                                                      |
| ---------------- | --------------------------------------------------------------------------------------------- |
| Rate             | `tokensPerSecond(owned)` — sum of `owned[id] × def.tokensPerSecond`                           |
| Accrual          | `tokensFromDelta(tps, deltaMs)` → `tps × deltaMs / 1000`                                      |
| Open-tab tick    | `applyProductionTick(state, nowMs)` via store `tick(nowMs)` (~100ms)                          |
| Clock            | Injectable `nowMs` / `Clock` — tests pass fake times                                          |
| Offline / resume | **No accrual.** `resumeWithoutAccrual(nowMs)` / `resumeFromHidden` only advances `lastTickAt` |
| Visibility       | On `hidden`: flush tick; on `visible`: resume without grant                                   |

## Notes

- Exact costs / prestige `K` are playtest-tuned (see PRODUCT / ISSUES).
- Keep helpers in `economy.ts` / `tick.ts` pure and unit-tested; store only applies results.
