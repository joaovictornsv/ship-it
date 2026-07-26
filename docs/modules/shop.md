# Shop

Shop UX: desktop right rail + mobile bottom drawer; buy affordances; joke copy.

**Status:** active — desktop right-rail shop + early ladder (issue #6). Mobile drawer in #8.

## Owned by

- `src/features/shop/` — `ShopRail`, `ShopRow`, `ShopUpgradeIcon`, `useProductionTick`
- `src/features/scene/hooks.ts` — stub `onUpgradeOwnedChanged` (wired on buy; scene in #7)

## Layout

| Viewport    | Behavior                                                              |
| ----------- | --------------------------------------------------------------------- |
| `lg` and up | Right-rail shop beside the Ship It play column (`max-w-6xl` shell)    |
| Below `lg`  | Shop stacks under the play column (drawer / bottom sheet lands in #8) |

## Shop row

Each catalog upgrade renders as an interactive row (card only because it wraps buy):

- Free-license **Lucide** icon (`ShopUpgradeIcon`)
- Name + joke blurb
- Owned count + **tokens/s** each
- Buy control showing compact cost (`formatTokensCompact` — K / M / B)

## Copy

English only. Rate label is always **tokens/s**.
