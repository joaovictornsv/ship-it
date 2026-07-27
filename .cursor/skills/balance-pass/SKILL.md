---
name: balance-pass
description: >-
  Adjust costs, tokens/s, click power, or prestige constants with economy doc
  updates and Vitest coverage. Use for playtest tuning — not new product
  decisions.
---

# balance-pass

Tune numbers; do not reopen locked PRODUCT/TECHNICAL decisions.

## Where constants live

| Knob                                     | Typical home                   |
| ---------------------------------------- | ------------------------------ |
| Producer `baseCost` / `tokensPerSecond`  | `src/data/upgrades.ts`         |
| Ship upgrade costs / flats / mults       | `src/data/shipUpgrades.ts`     |
| Building-upgrade costs / mults / unlocks | `src/data/buildingUpgrades.ts` |
| Prestige costs / effects                 | `src/data/prestigeUpgrades.ts` |
| `COST_GROWTH`, `REWRITE_K`, rewrite %    | `src/game/economy.ts`          |

## Checklist

1. Confirm the change is **playtest tuning** (costs, rates, `K`, %), not a new system — else file a feature issue.
2. Change the constant(s) in the owning catalog or `economy.ts`.
3. Update tests that assert old numbers (`economy.test.ts`, effect tests, etc.).
4. Update `docs/modules/economy.md` and/or `upgrades.md` / `prestige.md` so documented values match (`update-docs`).
5. Run `pnpm test` focused, then full verify before PR.

## Do not

- Invent a new prestige rule or save field under the guise of balance — use `prestige-change` / `save-migrate`.
- Leave docs asserting the old `REWRITE_K` / costs.
