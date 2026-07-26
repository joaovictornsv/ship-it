# Shop

Shop UX: desktop right rail + mobile bottom drawer; scan-first buy rows; joke copy.

**Status:** active — scan-first rows + colored icons (issue #28); responsive shell from #8.

## Owned by

- `src/features/shop/` — `ShopRail`, `ShopDrawer`, `ShopCatalog`, `ShopRow`, `ShopUpgradeIcon`, `upgradeColors`, `useProductionTick`, `productionPulse`
- `src/app/breakpoints.ts` — shared `lg` breakpoint (`DESKTOP_MIN_WIDTH_PX = 1024`)
- `src/features/scene/` — living office reads owned from store; `onUpgradeOwnedChanged` fans out spawn FX

## Layout / breakpoints

| Viewport                          | Behavior                                                                                 |
| --------------------------------- | ---------------------------------------------------------------------------------------- |
| `lg` and up (`min-width: 1024px`) | Right-rail shop beside the Ship It play column (`max-w-6xl` shell); rail always visible  |
| Below `lg`                        | Shop **closed by default** — fixed bottom **Shop** trigger opens a bottom sheet / drawer |

Mobile first paint keeps **one primary action** (Ship It). The drawer is `aria-modal` dialog; Escape / backdrop / close dismiss it. Safe-area padding on the trigger and sheet. Drawer rows use the **same** scan-first hierarchy as the rail.

## Shop row

Each catalog upgrade renders as a dense interactive row (card only because it wraps buy):

| Priority     | Element                                                       | Notes                        |
| ------------ | ------------------------------------------------------------- | ---------------------------- |
| Primary scan | Colored Lucide icon · **name** · **Owned ×N** · **price/buy** | Numbers dominate at a glance |
| Details      | Joke blurb + `+X tokens/s each`                               | Hidden by default            |

Details reveal via **hover**, **keyboard focus**, or **touch** on the ⓘ control (toggle) — never hover-only. Buy control uses deploy teal when affordable and a muted disabled state when not. Successful buy flashes the row (`buy-spend-flash`).

Shared list: `ShopCatalog` (used by rail + drawer). Per-upgrade hues: `upgradeColors.ts` → `--ship-upgrade-*` tokens (see `ui.md`).

## Copy

English only. Rate label is always **tokens/s**.
