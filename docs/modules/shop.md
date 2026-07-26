# Shop

Shop UX: desktop right rail + mobile bottom drawer; scan-first buy rows; joke copy.

**Status:** active — horizontal Ship upgrades queue above Buildings (issue #30); scan-first rows (#28); responsive shell (#8).

## Owned by

- `src/features/shop/` — `ShopRail`, `ShopDrawer`, `ShopCatalog`, `ShopRow`, `ShopShipTile`, icons/colors, `useProductionTick`
- `src/app/breakpoints.ts` — shared `lg` breakpoint (`DESKTOP_MIN_WIDTH_PX = 1024`)
- `src/features/scene/` — living office reads owned from store; `onUpgradeOwnedChanged` fans out spawn FX

## Layout / breakpoints

| Viewport                          | Behavior                                                                                 |
| --------------------------------- | ---------------------------------------------------------------------------------------- |
| `lg` and up (`min-width: 1024px`) | Right-rail shop beside the Ship It play column (`max-w-6xl` shell); rail always visible  |
| Below `lg`                        | Shop **closed by default** — fixed bottom **Shop** trigger opens a bottom sheet / drawer |

Mobile first paint keeps **one primary action** (Ship It). The drawer is `aria-modal` dialog; Escape / backdrop / close dismiss it. Safe-area padding on the trigger and sheet. Drawer rows use the **same** scan-first hierarchy as the rail.

## Sections

`ShopCatalog` renders (rail + drawer share the list):

1. **Ship upgrades** — Cookie-style **horizontal** one-shot queue **above** buildings (`ShopShipTile`). Owned upgrades live on Achievements, not here.
2. **Buildings** — tokens/s producers (`ShopRow`)

Do not add a second panel, floating badge cluster, or HUD strip of click meta.

## Building row

Each producer renders as a dense interactive row (card only because it wraps buy):

| Priority     | Element                                   | Notes                                                 |
| ------------ | ----------------------------------------- | ----------------------------------------------------- |
| Primary scan | Emoji · **name** · **×N** · **price/buy** | Owned count is the big number only (no “Owned” label) |
| Details      | Joke blurb + `+X tokens/s each`           | Hidden by default                                     |

## Ship upgrade queue

Horizontal scroll of compact tiles (`visibleShipUpgradeQueue`):

| Shown                                        | Hidden                                     |
| -------------------------------------------- | ------------------------------------------ |
| Only the **next available** (not owned) step | Owned upgrades; locked future ladder steps |

Empty state copy when the queue has nothing to buy:

- Soft-locked (no building yet): “Buy a building to unlock the Ship upgrades queue.”
- Ladder complete: “No Ship upgrades available. Check Achievements for what you own.”

| Tile scan | Element                                   | Notes                                                                                       |
| --------- | ----------------------------------------- | ------------------------------------------------------------------------------------------- |
| Primary   | Glyph · short name · cost                 | Whole tile is the buy control                                                               |
| Details   | ⓘ tooltip: blurb, click effect, CTA label | Hover / keyboard focus / touch toggle; portaled to `body` so shop overflow does not clip it |

Successful buy flashes the tile (`buy-spend-flash`). Glyphs: `shipUpgradeEmoji.ts`. Hues: `shipUpgradeColors.ts` → `--ship-upgrade-*`.

## Copy

English only. Building rate label is always **tokens/s**. Ship tiles say tokens per click / click power — never mix currencies.

## Ship It CTA

Each owned Ship upgrade evolves the CTA via `shipItCta` (highest owned wins):

- **Label** — every catalog entry has a distinct `ctaLabel` (never stays as base “Ship It”)
- **Glyph** — emoji from that upgrade beside the label
- **Accent** — button background mixes the upgrade’s `--ship-upgrade-*` hue with deploy teal

Press still uses `ship-press` / `floater-rise`. Size hierarchy unchanged; Ship It stays the dominant primary action.

## Related views

Owned Ship upgrades also appear on the **Achievements** page (`#/achievements`) — see `achievements.md`.
