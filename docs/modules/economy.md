# Economy

Formulas, cost curves, beans/s, click power, number formatting (K/M/B).

**Status:** started — click power + bean bank (issue #3). Producers / beans/s land in #4+.

## Owned by

- `src/game/economy.ts` — pure formulas
- `src/game/state.ts` — Zustand store (`beans`, `shipIt`)
- `src/game/types.ts` — shared `Beans` / `GameState`
- `src/features/click/` — Ship It button + bank UI
- related Vitest coverage (`economy.test.ts`)

## Click power / bank

| Concept       | Contract                                                               |
| ------------- | ---------------------------------------------------------------------- |
| Currency      | Coffee beans (`Beans`)                                                 |
| Bank          | `GameState.beans` in Zustand (`useGameStore`)                          |
| Click action  | `shipIt()` adds `clickPower()` beans; returns amount for floating `+N` |
| Base power    | `clickPower()` → `1` (no modifiers yet)                                |
| Persistence   | None yet — in-memory only until saves (#5)                             |
| UI rate label | **beans/s** (passive rate; not used until Espresso / tick)             |

## Notes

- Exact costs / prestige `K` are playtest-tuned (see PRODUCT / ISSUES).
- Keep helpers in `economy.ts` pure and unit-tested; store only applies results.
