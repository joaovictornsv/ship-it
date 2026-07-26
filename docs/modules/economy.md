# Economy

Formulas, cost curves, tokens/s, click power, number formatting (K/M/B).

**Status:** active — multi-upgrade tokens/s, Cookie-style costs, compact formatting (issue #6).

## Owned by

- `src/game/economy.ts` — pure formulas
- `src/game/format.ts` — `formatTokensCompact` (K / M / B)
- `src/game/tick.ts` — pure production tick / resume helpers
- `src/game/state.ts` — Zustand store (`tokens`, `owned`, `lastTickAt`, actions)
- `src/game/types.ts` — shared `Tokens` / `OwnedUpgrades` / `GameState`
- `src/features/click/` — Ship It button + bank UI (tokens + tokens/s)
- `src/features/shop/` — shop rail + `useProductionTick`
- related Vitest coverage (`economy.test.ts`, `format.test.ts`, `tick.test.ts`, `state.test.ts`)

## Click power / bank

| Concept       | Contract                                                                |
| ------------- | ----------------------------------------------------------------------- |
| Currency      | Tokens (`Tokens`)                                                       |
| Bank          | `GameState.tokens` in Zustand (`useGameStore`)                          |
| Click action  | `shipIt()` adds `clickPower()` tokens; returns amount for floating `+N` |
| Base power    | `clickPower()` → `1` (no modifiers yet)                                 |
| Persistence   | Versioned save via `src/features/save/` (see `saves.md`)                |
| UI rate label | **tokens/s** (`tokensPerSecond(owned)` in header)                       |
| UI amounts    | `formatTokensCompact` — floor, then plain / K / M / B (no scientific)   |

## Number formatting

`formatTokensCompact(value)` in `src/game/format.ts`:

| Range        | Display                        |
| ------------ | ------------------------------ |
| `\|n\| < 1K` | Integer string (`999`)         |
| `1K … < 1M`  | Truncated `K` (`1.5K`, `999K`) |
| `1M … < 1B`  | Truncated `M`                  |
| `≥ 1B`       | Truncated `B`                  |

Used by the token bank and shop buy costs. Never emits scientific notation.

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
| Rate             | `tokensPerSecond(owned)` — sum of `owned[id] × def.tokensPerSecond` over the full catalog     |
| Accrual          | `tokensFromDelta(tps, deltaMs)` → `tps × deltaMs / 1000`                                      |
| Open-tab tick    | `applyProductionTick(state, nowMs)` via store `tick(nowMs)` (~100ms)                          |
| Clock            | Injectable `nowMs` / `Clock` — tests pass fake times                                          |
| Offline / resume | **No accrual.** `resumeWithoutAccrual(nowMs)` / `resumeFromHidden` only advances `lastTickAt` |
| Visibility       | On `hidden`: flush tick; on `visible`: resume without grant                                   |

## Notes

- Exact costs / prestige `K` are playtest-tuned (see PRODUCT / ISSUES).
- Keep helpers in `economy.ts` / `tick.ts` / `format.ts` pure and unit-tested; store only applies results.
