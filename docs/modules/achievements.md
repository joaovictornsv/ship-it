# Achievements

Durable milestone badges across lifetime play stats (issue #33).

**Status:** active — catalog + unlock + HUD toast + save v4.

## Owned by

- `src/data/achievements.ts` — `Achievements` catalog (`createEnum`) + ordered `achievements`
- `src/game/achievements.ts` — pure threshold checks / progress labels
- `src/game/state.ts` — lifetime counters, unlock merge, ephemeral toast queue, Rewrite keep
- `src/features/achievements/` — `AchievementUnlockToast` HUD feedback
- `src/app/AchievementsView.tsx` — milestones panel + this-run Ship / building upgrades galleries
- `src/app/appView.ts` — `#/achievements` hash view
- `src/app/AppHeader.tsx` — desktop header Medal / mobile Menu → Achievements

## Catalog shape

Each entry has stable `name` (id), English `title` / `blurb`, `family`, and a `goal`:

| Goal kind           | Counter                                               |
| ------------------- | ----------------------------------------------------- |
| `lifetimeTokens`    | `lifetimeTokensEarned` (all-time clicks + passive)    |
| `lifetimeClicks`    | `lifetimeClicks` (Ship It presses)                    |
| `lifetimePurchases` | Producer unit buys + Ship / building upgrade buys     |
| `owned`             | Live `owned[upgradeId]` (unlock persists after reset) |
| `rewrites`          | Banked Rewrites                                       |

Starter set covers **tokens**, **clicks**, **owned**, **purchases**, and **rewrites** families. Thresholds are playtest starting points.

## Unlock rules

- Pure helpers evaluate goals; store merges newly met ids into `achievementsUnlocked`.
- Unlock is automatic on `shipIt` / `buyUpgrade` / `buyShipUpgrade` / `buyBuildingUpgrade` / `tick` / `rewrite`.
- Hydrate catch-up merges missing unlocks **silently** (no toast spam on load).
- Unlocks + lifetime counters **persist** across reload and **Rewrite** (cosmetics-class keep-list).

## Player UI

| Surface            | Behavior                                                                                 |
| ------------------ | ---------------------------------------------------------------------------------------- |
| Achievements panel | Unlocked + locked rows with progress (`current / threshold`); Ship + building galleries  |
| Unlock toast       | Fixed top HUD banner; FIFO queue (cap 5); linger ~5.5s then ~280ms exit; `aria-live`     |
| Motion             | `achievement-toast-in` + accent pulse; `achievement-toast-out`; off under reduced motion |

**Locked vs unlocked (panel):** unlocked = solid elevated surface, accent inset bar, Check glyph, accent status chip; locked = dashed border, muted ink wash, Lock glyph, muted title/progress. Same `--ship-*` tokens only.

Toast is non-blocking (no focus steal, `pointer-events-none`). Chrome matches unlocked milestone rows: accent inset bar, accent-tinted Medal glyph, soft token wash on elevated fill — `--ship-*` tokens only. Timings: `TOAST_LINGER_MS` (5500) + `TOAST_EXIT_MS` (280) in `AchievementUnlockToast`.

## Navigation

- Hash: `#/achievements`
- Desktop play header: Medal → Achievements; Save icon unchanged
- Mobile: Menu drawer → Achievements (same destinations)
- Secondary screens: desktop **Back to play**; mobile drawer **Ship It** / Back to play

## Save

Schema **v4** adds `lifetimeTokensEarned`, `lifetimeClicks`, `lifetimePurchases`, `achievementsUnlocked`. See `saves.md`. Prestige keep-list: `prestige.md`.

## Out of scope

- SEV / incident mini-events (separate wishlist)
- Achievement rewards / economy bonuses
- Huge day-one catalog (expand via data only)
