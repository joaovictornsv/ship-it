---
name: prestige-change
description: >-
  Change Rewrite soft-reset rules, Rewrites currency behavior, or prestige shop
  effects with prestige/economy docs and migrations when needed.
---

# prestige-change

Edit prestige carefully: keep/reset tables and earn tracking are easy to break.

## Read first

- `docs/modules/prestige.md`
- `docs/modules/economy.md`
- `docs/modules/saves.md` (if persisted fields move)
- `src/game/economy.ts` — `rewritesGained`, mults, costs
- `src/game/state.ts` — `rewrite()`, `buyPrestigeUpgrade()`, earn fields
- `src/data/prestigeUpgrades.ts` — catalog

## Checklist

1. State the rule change in product terms (what resets, what keeps, unlock timing, shop placement).
2. Update pure formulas in `economy.ts` + Vitest (`write-tests`).
3. Update store actions / UI (`RewritePanel`, confirm flow, Rewrites shop) per `prestige.md` + `ui.md`.
4. If new persisted fields or ID renames: run `save-migrate`.
5. Update `prestige.md` (+ economy/shop as needed) in the same PR (`update-docs`).
6. `check-quality` with review; add audit if saves touched.

## Locked reminders

- `rewritesGained = floor(sqrt(tokensEarnedThisRun / K))` — track **earned this run**, not spendable bank.
- Prestige currency never buys normal shop rows.
- Rooms/cosmetics stay across Rewrite when those systems exist.

## Do not

- Soft-lock players with a `K` / UX change without updating the documented unlock story.
- Skip tests for gain / mult / reset helpers.
