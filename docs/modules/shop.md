# Shop

Shop UX: desktop right rail + mobile bottom drawer; scan-first buy rows; joke copy.

**Status:** active — bulk buy ×1 / ×10 / ×100 / Max for buildings (issue #38); horizontal one-shot upgrades queue (#30 + #37 building mults); Rewrites prestige in Rewrite flow only (#9 + #49); scan-first rows (#28); responsive shell (#8); mobile drawer no H-scroll + closed-trigger affordability cue (#53).

## Owned by

- `src/features/shop/` — `ShopRail`, `ShopDrawer`, `ShopCatalog`, `ShopBuyModeControl`, `ShopRow`, `ShopShipTile`, `ShopBuildingTile`, `ShopPrestigeRow`, `RewritesShop`, `RewritePanel`, `RewriteConfirmDialog`, icons/colors, `useBuyMode`, `useProductionTick`, `visibleOneShotQueue`, `shopAffordability`
- `src/app/breakpoints.ts` — shared `lg` breakpoint (`DESKTOP_MIN_WIDTH_PX = 1024`)
- `src/features/scene/` — living office reads owned from store; `onUpgradeOwnedChanged` fans out spawn FX
- `src/app/PlayView.tsx` — mounts `RewritePanel` under Ship It

## Layout / breakpoints

| Viewport                          | Behavior                                                                                 |
| --------------------------------- | ---------------------------------------------------------------------------------------- |
| `lg` and up (`min-width: 1024px`) | Right-rail shop beside the Ship It play column (`max-w-6xl` shell); rail always visible  |
| Below `lg`                        | Shop **closed by default** — fixed bottom **Shop** trigger opens a bottom sheet / drawer |

Mobile first paint keeps **one primary action** (Ship It). The drawer is `aria-modal` dialog; Escape / backdrop / close dismiss it. Safe-area padding on the trigger and sheet. Drawer rows use the **same** scan-first hierarchy as the rail (including the buy-mode control).

Sheet layout **constrains width** (`overflow-x-hidden` on the panel + scroll body; catalog `min-w-0`). One-shot upgrade tiles **wrap** within the sheet — no horizontal scrollbar / sideways pan under normal catalog content. Verify at ~360px and common phone widths including safe-area insets.

### Closed-trigger affordability cue

While the drawer is **closed**, the fixed bottom **Shop** trigger shows a small accent dot when at least one normal-shop purchase is currently affordable (buildings under the active buy mode, or visible Ship / building one-shots). Same cost helpers as buy rows (`shopAffordability` / `hasAffordableShopPurchase`). Cue clears when nothing is affordable or when the drawer is open. Accessible via trigger `aria-label` (`Shop, affordable purchases available`). No second HUD strip or floating badge cluster — cue lives on the existing trigger only.

## Sections

`ShopCatalog` renders (rail + drawer share the list):

1. **Upgrades** — Cookie-style **wrapping** one-shot queue **above** buildings (`ShopShipTile` + `ShopBuildingTile`). Ship ladder next-step + unlocked building boosts, interleaved by cost (`visibleOneShotQueue`). Owned upgrades live on Achievements, not here.
2. **Buildings** — tokens/s producers (`ShopRow`) with a compact **buy-mode** control in the section header

**Rewrites shop** is **not** in the normal catalog (#49). Prestige rows live in the Rewrite flow only (`RewritesShop` inside `RewriteConfirmDialog` after confirm). Rail/drawer subtitles stay **buildings + ship**.

Do not add a second panel, floating badge cluster, or HUD strip of click meta. Keep the buy-mode control in shop chrome — not on the first-paint play column.

## Rewrite CTA

`RewritePanel` sits under Ship It on the play column:

- **Locked** (`rewritesGained < 1`): one muted centered line — `Rewrite · {N} more` — with `role="status"` and an aria-label that names tokens remaining. No panel, button, bank, or mult preview
- **Available**: centered row — status line + secondary **Rewrite** button (accent outline / elevated fill; Ship It stays the primary solid CTA)
- Confirm dialog lists tokens lost, Rewrites gained, new bank, and ×tokens/s power; after confirm, the same dialog shows the **Rewrites shop**
- Soft reset via store `rewrite()` — see `prestige.md`

## Buy mode (buildings only)

Compact control above the building list: **×1** / **×10** / **×100** / **Max**.

| Mode            | Behavior                                                                                                             |
| --------------- | -------------------------------------------------------------------------------------------------------------------- |
| ×1 / ×10 / ×100 | One click buys that many units when the rising-cost **sum** fits the bank; otherwise the row buy control is disabled |
| Max             | Buys the largest `n ≥ 1` that fits; `0` → cannot buy (disabled)                                                      |

- Session-backed via `sessionStorage` (`ship-it:shop-buy-mode`) so rail remounts / drawer open-close keep the selection
- Cost preview on each row uses `nextUpgradeCostForN` / `maxAffordableOf` (see `economy.md`)
- Buy control shows **×quantity** above the mode total for ×10 / ×100 / Max (×1 stays cost-only)
- Ship / building upgrade tiles ignore buy mode (still one-shot)
- English labels only; totals use `formatTokensCompact`

## Building row

Each producer renders as a dense interactive row (card only because it wraps buy):

| Priority     | Element                             | Notes                                                                                  |
| ------------ | ----------------------------------- | -------------------------------------------------------------------------------------- |
| Primary scan | Emoji · **name** · **×N** · **buy** | Owned count is the big number only; buy shows cost, plus **×qty** for ×10 / ×100 / Max |
| Details      | Joke blurb + `+X tokens/s each`     | Hidden by default; catalog base rate (building mults fold into header tokens/s)        |

## One-shot upgrade queue

Wrapping flex of compact tiles (`visibleOneShotQueue`) — stays within rail / drawer width (no horizontal sheet scroll):

| Shown                                                                                     | Hidden                                                               |
| ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Next **Ship** ladder step (when unlocked) + all unlocked, not-owned **building** upgrades | Owned upgrades; locked future Ship steps / unmet building thresholds |

Sorted by ascending cost (then id). Empty state copy when the queue has nothing to buy:

- Soft-locked (no building yet): “Buy a building to unlock the upgrades queue.”
- Nothing left: “No upgrades available. Check Achievements for what you own.”

| Tile scan | Element                                                         | Notes                                                                                       |
| --------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Primary   | Glyph · short name · cost                                       | Whole tile is the buy control                                                               |
| Details   | ⓘ tooltip: blurb + effect (click power **or** named building ×) | Hover / keyboard focus / touch toggle; portaled to `body` so shop overflow does not clip it |

Successful buy flashes the tile (`buy-spend-flash`). Ship glyphs/hues live on each Ship def (`--ship-upgrade-*`); building tiles **reuse** the target producer’s `--ship-upgrade-*` hue.

## Copy

English only. Building rate label is always **tokens/s**. Ship tiles say tokens per click / click power; building tiles name the producer and the mult — never mix currencies. Prestige rows show **Rewrites** costs only.

## Ship It CTA

Each owned Ship upgrade evolves the CTA via `shipItCta` (highest owned wins):

- **Label** — every catalog entry has a distinct `ctaLabel` (never stays as base “Ship It”)
- **Glyph** — emoji from that upgrade beside the label
- **Accent** — button background mixes the upgrade’s `--ship-upgrade-*` hue with deploy teal

Press still uses `ship-press` / `floater-rise`. Size hierarchy unchanged; Ship It stays the dominant primary action. Building upgrades do **not** change the CTA.

## Related views

Owned Ship and building upgrades also appear on the **Achievements** page (`#/achievements`) — see `achievements.md`.
