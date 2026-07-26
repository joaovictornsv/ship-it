# Shop

Shop UX: desktop right rail + mobile bottom drawer; scan-first buy rows; joke copy.

**Status:** active — Buildings + Ship upgrades sections (issue #30); scan-first rows (#28); responsive shell (#8).

## Owned by

- `src/features/shop/` — `ShopRail`, `ShopDrawer`, `ShopCatalog`, `ShopRow`, `ShopShipRow`, icons/colors, `useProductionTick`
- `src/app/breakpoints.ts` — shared `lg` breakpoint (`DESKTOP_MIN_WIDTH_PX = 1024`)
- `src/features/scene/` — living office reads owned from store; `onUpgradeOwnedChanged` fans out spawn FX

## Layout / breakpoints

| Viewport                          | Behavior                                                                                 |
| --------------------------------- | ---------------------------------------------------------------------------------------- |
| `lg` and up (`min-width: 1024px`) | Right-rail shop beside the Ship It play column (`max-w-6xl` shell); rail always visible  |
| Below `lg`                        | Shop **closed by default** — fixed bottom **Shop** trigger opens a bottom sheet / drawer |

Mobile first paint keeps **one primary action** (Ship It). The drawer is `aria-modal` dialog; Escape / backdrop / close dismiss it. Safe-area padding on the trigger and sheet. Drawer rows use the **same** scan-first hierarchy as the rail.

## Sections

`ShopCatalog` renders two labeled blocks (rail + drawer share the list):

1. **Buildings** — tokens/s producers (`ShopRow`)
2. **Ship upgrades** — one-shot click-power ladder (`ShopShipRow`), below buildings so Espresso stays the early buy path

Do not add a second panel, floating badge cluster, or HUD strip of click meta.

## Building row

Each producer renders as a dense interactive row (card only because it wraps buy):

| Priority     | Element                                   | Notes                                                 |
| ------------ | ----------------------------------------- | ----------------------------------------------------- |
| Primary scan | Emoji · **name** · **×N** · **price/buy** | Owned count is the big number only (no “Owned” label) |
| Details      | Joke blurb + `+X tokens/s each`           | Hidden by default                                     |

## Ship upgrade row

| Priority     | Element                                     | Notes                                       |
| ------------ | ------------------------------------------- | ------------------------------------------- |
| Primary scan | Emoji · **name** · status · **price/Owned** | Status: Next / Owned / Locked               |
| Details      | Joke blurb + flat or mult effect            | Same ⓘ / hover / focus pattern as buildings |

Soft unlock: rows stay locked until any building is owned. Ladder: only the next unpurchased step is buyable.

Details reveal via **hover**, **keyboard focus**, or **touch** on the ⓘ control (toggle) — never hover-only. Buy control uses deploy teal when affordable and a muted disabled state when not. Successful buy flashes the row (`buy-spend-flash`).

Glyphs: `upgradeEmoji.ts` (buildings) / `shipUpgradeEmoji.ts` (Ship). Hues: `upgradeColors.ts` / `shipUpgradeColors.ts` → `--ship-upgrade-*`.

## Copy

English only. Building rate label is always **tokens/s**. Ship rows say tokens per click / click power — never mix currencies.

## Ship It CTA

Highest owned Ship upgrade lightly evolves CTA **label** + glyph (emoji beside label). Press still uses `ship-press` / `floater-rise`. No larger competing chrome; Ship It stays the dominant primary action.
