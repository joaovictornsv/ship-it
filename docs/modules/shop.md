# Shop

Shop UX: desktop right rail + mobile bottom drawer; buy affordances; joke copy.

**Status:** active — responsive shop (issue #8): right rail at `lg+`, bottom sheet below `lg`.

## Owned by

- `src/features/shop/` — `ShopRail`, `ShopDrawer`, `ShopCatalog`, `ShopRow`, `ShopUpgradeIcon`, `useProductionTick`
- `src/app/breakpoints.ts` — shared `lg` breakpoint (`DESKTOP_MIN_WIDTH_PX = 1024`)
- `src/features/scene/` — living office reads owned from store; `onUpgradeOwnedChanged` still called on buy

## Layout / breakpoints

| Viewport                          | Behavior                                                                                 |
| --------------------------------- | ---------------------------------------------------------------------------------------- |
| `lg` and up (`min-width: 1024px`) | Right-rail shop beside the Ship It play column (`max-w-6xl` shell); rail always visible  |
| Below `lg`                        | Shop **closed by default** — fixed bottom **Shop** trigger opens a bottom sheet / drawer |

Mobile first paint keeps **one primary action** (Ship It). The drawer is `aria-modal` dialog; Escape / backdrop / close dismiss it. Safe-area padding on the trigger and sheet.

## Shop row

Each catalog upgrade renders as an interactive row (card only because it wraps buy):

- Free-license **Lucide** icon (`ShopUpgradeIcon`)
- Name + joke blurb
- Owned count + **tokens/s** each
- Buy control showing compact cost (`formatTokensCompact` — K / M / B)

Shared list: `ShopCatalog` (used by rail + drawer).

## Copy

English only. Rate label is always **tokens/s**.
