# Prestige (Rewrite)

Soft reset, Rewrites currency, prestige shop, what resets vs keeps (rooms kept).

**Status:** active — issue #9; UX pacing + chrome (#49).

## Owned by

- `src/game/economy.ts` — pure prestige formulas (`rewritesGained`, mults, costs)
- `src/data/prestigeUpgrades.ts` — Postmortem / Muscle memory / Stub repo catalog
- `src/game/state.ts` — earn tracking, `rewrite()`, `buyPrestigeUpgrade()`
- `src/features/shop/` — `RewritePanel`, `RewriteConfirmDialog`, `RewritesShop`, `ShopPrestigeRow`
- `docs/modules/economy.md`, `saves.md` — cross-links

## Formula (locked)

```text
rewritesGained = floor(sqrt(tokensEarnedThisRun / K))
```

| Constant                | Value   | Notes                                               |
| ----------------------- | ------- | --------------------------------------------------- |
| `REWRITE_K`             | 100_000 | First Rewrite at ≥100k tokens earned this run (#49) |
| `REWRITE_TPS_BONUS_PER` | 0.05    | +5% tokens/s per banked Rewrite                     |
| `PRESTIGE_COST_GROWTH`  | 1.5     | Rising Rewrites cost for repeatable prestige tiers  |

Unlock when `rewritesGained ≥ 1` (⇔ `tokensEarnedThisRun ≥ K`). No early grayed Rewrite panel — discrete CTA only when available (#49).

Track **`tokensEarnedThisRun`** (clicks + passive), not the spendable bank — buying must not delay prestige.

## Keep vs reset

| Resets                                    | Keeps                                                                        |
| ----------------------------------------- | ---------------------------------------------------------------------------- |
| Token bank                                | Rewrites bank                                                                |
| Owned buildings (`owned`)                 | Prestige shop upgrades (Postmortem / Muscle memory / Stub repo)              |
| Ship upgrades (`shipOwned`) — click track | Cosmetics / rooms (when rooms exist)                                         |
| Building upgrades (`buildingOwned`)       | Banked Rewrites passive tokens/s mult                                        |
| `tokensEarnedThisRun`                     | Achievements + lifetime counters (`achievementsUnlocked`, `lifetime*`) — #33 |

**Stub repo:** after Rewrite, `owned` starts with **1 Espresso machine** when owned.

## Prestige shop (Rewrites only)

| ID              | Effect                              | Cost model                          |
| --------------- | ----------------------------------- | ----------------------------------- |
| `postmortem`    | +5% tokens/s per level              | `ceil(1 × 1.5^owned)` Rewrites      |
| `muscle-memory` | +10% tokens per click per level     | `ceil(1 × 1.5^owned)` Rewrites      |
| `stub-repo`     | Each Rewrite starts with 1 Espresso | 2 Rewrites, one-shot (`maxOwned=1`) |

Prestige currency **never** buys normal shop rows (buildings / Ship upgrades).

## Tokens/s + click stacking

```text
tokens/s = Σ(owned × rate) × (1 + rewrites × 0.05) × (1 + Postmortem %)
click    = (1 + Σ flat) × Π mult × (1 + Muscle memory %)
```

## Player UI

- **Rewrite CTA** under Ship It: mounts only when `rewritesGained ≥ 1` (compact status + accent button). No full panel / “earn X more” chrome before unlock (#49).
- **Rewrite flow** (`RewriteConfirmDialog`): confirm soft reset (tokens lost vs Rewrites gained + new ×tokens/s) → post-confirm **Rewrites shop** (`RewritesShop` + prestige rows). Not in the normal shop rail/drawer.
- HUD may show banked Rewrites under tokens/s when `rewrites > 0`.
- Chrome follows `docs/modules/ui.md` (`--ship-prestige-*`, `--ship-rewrite`).

## Save

Schema **v3** adds `tokensEarnedThisRun`, `rewrites`, `prestigeOwned`. Achievement keep fields land in **v4** — see `saves.md` / `achievements.md`.
