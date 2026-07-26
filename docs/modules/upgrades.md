# Upgrades

Upgrade IDs (Dev, Espresso machine, …), tiers, shop copy, shop ↔ scene hooks.

**Status:** started — Espresso machine catalog + buy path (issue #4). Full shop rail in #6.

## Owned by

- `src/data/upgrades.ts` — catalog definitions
- `src/features/shop/` — buy UI (minimal row for now)
- `src/game/economy.ts` — cost + beans/s from owned counts
- `src/game/state.ts` — `owned` map + `buyUpgrade`

## Catalog

| ID                 | Name             | Role                                                                | baseCost | beans/s each |
| ------------------ | ---------------- | ------------------------------------------------------------------- | -------- | ------------ |
| `espresso-machine` | Espresso machine | First ladder building; **small beans/s producer** (not click power) | 15       | 0.1          |

Constant: `ESPRESSO_MACHINE_ID = 'espresso-machine'`.

### Espresso machine (locked role)

- Buys with beans; Cookie-style rising cost for owned count.
- Each owned unit adds **0.1 beans/s** (playtest starting point).
- Shop copy should read naturally in beans (“15 beans”, not abstract CPS).
- Scene presence (machine / mugs) lands with the living office (#7) — not required here.

### Copy

| Field | English                                          |
| ----- | ------------------------------------------------ |
| Name  | Espresso machine                                 |
| Blurb | A tiny drip of automation. Smells like progress. |

## Owned state

`GameState.owned: Partial<Record<UpgradeId, number>>` — missing key means 0.

## Notes

- Upgrade IDs are stable; renames need a save migrator once saves exist (#5).
- Dev and further ladder rows arrive in #6.
