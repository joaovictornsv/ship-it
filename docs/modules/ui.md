# UI

Shell chrome, design tokens, typography, spacing, and motion for **Ship It**.

**Status:** active — game HUD + living office redesign (issue #28).

**Owned by**

- `src/styles/index.css` — CSS custom properties + shell background / atmosphere / motion
- `index.html` — Space Grotesk font load
- Feature components under `src/app/`, `src/features/*` — consume tokens via `var(--ship-*)` / Tailwind

Agents and humans that change player-facing UI **must** read this doc and follow it. New GitHub issues that touch UI must require compliance (see `create-issue` / `implement-issue` skills).

## Direction

| Intent | Rule                                                                             |
| ------ | -------------------------------------------------------------------------------- |
| Look   | Cool **slate** + **deploy teal** CTA — shipping / CI chrome, warmer game accents |
| Flavor | Coffee / Espresso stay as **scene props and jokes**, not shell colors            |
| Copy   | English only (product rule)                                                      |
| Stack  | Tailwind utilities + CSS variables — do not invent parallel theme systems        |

## Color tokens

Defined on `:root` in `src/styles/index.css`. Prefer these over raw hex in components.

| Token                           | Value                  | Use                                                   |
| ------------------------------- | ---------------------- | ----------------------------------------------------- |
| `--ship-bg`                     | `#e6edf5`              | Page base (under gradient / grid)                     |
| `--ship-bg-elevated`            | `#f4f7fb`              | Header / panel surfaces                               |
| `--ship-ink`                    | `#122033`              | Primary text                                          |
| `--ship-muted`                  | `#5b6b7c`              | Secondary text, helper copy                           |
| `--ship-accent`                 | `#0f7a74`              | Primary actions (Ship It, buy), focus rings, floaters |
| `--ship-accent-deep`            | `#0a524e`              | Accent press shadow / depth                           |
| `--ship-line`                   | `color-mix(… ink 12%)` | Borders / hairlines                                   |
| `--ship-token`                  | `#d4a017`              | Currency numeral accent in the HUD                    |
| `--ship-token-soft`             | `#f0d78c`              | Soft token wash (optional highlights)                 |
| `--ship-sky`                    | `#9ec5e8`              | Backdrop / office wall wash                           |
| `--ship-warm`                   | `#e8c47c`              | Warm backdrop accent (not cream+terracotta shell)     |
| `--ship-upgrade-espresso`       | `#c47a3a`              | Espresso icon / prop                                  |
| `--ship-upgrade-dev`            | `#0f7a74`              | Dev icon (aligns with accent)                         |
| `--ship-upgrade-code-review`    | `#3d7ea6`              | Code review icon / prop                               |
| `--ship-upgrade-ci-cd`          | `#2a9d6e`              | CI / CD icon / prop                                   |
| `--ship-upgrade-on-call`        | `#d97706`              | On-call icon / prop                                   |
| `--ship-upgrade-rubber-duck`    | `#d4a017`              | Ship upgrade: Rubber duck                             |
| `--ship-upgrade-keyboard`       | `#5b6b7c`              | Ship upgrade: Mechanical keyboard                     |
| `--ship-upgrade-standup`        | `#0f7a74`              | Ship upgrade: Standup                                 |
| `--ship-upgrade-stack-overflow` | `#c47a3a`              | Ship upgrade: Stack Overflow tab                      |
| `--ship-upgrade-sticky-notes`   | `#e8c47c`              | Ship upgrade: Sticky notes                            |
| `--ship-upgrade-dark-mode`      | `#3d5a80`              | Ship upgrade: Dark mode                               |
| `--ship-upgrade-pair`           | `#3d7ea6`              | Ship upgrade: Pair programming                        |
| `--ship-upgrade-lgtm`           | `#2a9d6e`              | Ship upgrade: LGTM stamp                              |
| `--ship-upgrade-pomodoro`       | `#d97706`              | Ship upgrade: Pomodoro                                |
| `--ship-upgrade-green-build`    | `#2a9d6e`              | Ship upgrade: Green build                             |
| `--ship-upgrade-readme`         | `#5b6b7c`              | Ship upgrade: README-driven                           |
| `--ship-upgrade-friday`         | `#0f7a74`              | Ship upgrade: Ship-it Friday                          |

**Do not** reintroduce coffee-brown shell chrome (`#8b5a2b`, cream `#f3eee4`, etc.). Scene mug tint (`--office-mug`) stays local on `.office-scene`.

**Avoid:** purple / indigo default gradients, dark-mode-first shells, neon glow stacks. Scene / shop **producer and Ship-upgrade glyphs** may use emoji for warmth; do not sprinkle emoji into header chrome. Ship It CTA may show a small evolution glyph beside the label (not as header chrome).

### Tailwind usage

```tsx
className =
  'bg-[var(--ship-accent)] text-[var(--ship-ink)] border-[var(--ship-line)]';
```

For translucent mixes, use `color-mix` with underscores in arbitrary values, e.g. `bg-[color-mix(in_srgb,var(--ship-bg-elevated)_88%,transparent)]`.

## Typography

| Role                         | Spec                                                                                                                                                                           |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Family                       | **Space Grotesk** (`index.html` Google Fonts), then `ui-sans-serif, system-ui, sans-serif`                                                                                     |
| Body                         | Inherited ink color; default size from browser / Tailwind `text-base` for helper copy                                                                                          |
| Brand / titles               | `font-semibold` or `font-bold`, `tracking-tight`                                                                                                                               |
| Numbers (bank, costs, rates) | `tabular-nums`                                                                                                                                                                 |
| Hierarchy (shell today)      | Brand `text-lg`; HUD bank `text-3xl`→`text-4xl`; Ship It CTA `text-3xl` (mobile) → `text-2xl` (`lg+`); shop name `text-sm`; meta `text-xs`; header Achievements + Save = icons |

Do not add Inter / Roboto / Arial as the primary UI face. Do not introduce a second display font without updating this doc.

## Spacing & layout

Use Tailwind’s default spacing scale. Prefer this shell rhythm:

| Token-ish     | Tailwind                                                                                 | Use                                                            |
| ------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Page gutter   | `px-4`                                                                                   | Header / main horizontal padding                               |
| Section stack | `gap-5`–`gap-8`                                                                          | Play column: scene → HUD → CTA                                 |
| Cluster       | `gap-2`–`gap-4`                                                                          | Tight groups (HUD + Ship It, header row)                       |
| Header nav    | Brand + **Achievements** (Medal) + **Save** icon buttons                                 | Lightweight hash views (`#/` / `#/achievements` / `#/save`)    |
| HUD           | Tokens + tokens/s docked on the Ship It cluster (`max-w-md`)                             | PRODUCT §4 — currency next to the click target                 |
| Panel pad     | `px-3 py-2` (shop rows); HUD `px-4 py-3`                                                 | Dense Cookie-style buy rows; readable bank                     |
| Content max   | `max-w-6xl` (shell), office stage `max-w-xl`→`max-w-2xl`, shop rail `lg:w-80`            | Scene reads as a stage, not a tiny card                        |
| Main vertical | `py-8`; below `lg` add `pb-28` for the fixed Shop trigger                                | Primary play area + mobile shop clearance                      |
| Ship It CTA   | Mobile: `min-h-36` + `w-full max-w-sm` + `text-3xl`; `lg+`: `min-h-28 min-w-56 text-2xl` | Large phone tap target; desktop stays compact                  |
| Shop drawer   | Fixed bottom trigger (`max-w-md`); sheet `max-h-[min(78dvh,36rem)]`, `rounded-t-2xl`     | Below `lg` only; closed by default so Ship It owns first paint |
| Atmosphere    | `.ship-atmosphere` fixed blobs behind `.ship-shell`                                      | Fills dead space; static under reduced motion                  |

**Radius:** interactive panels `rounded-xl`; stage `rounded-2xl`; small controls `rounded-lg`; primary Ship It CTA `rounded-2xl`.

**Cards:** only when they wrap a clear interaction (e.g. buy row, HUD bank). Prefer token borders (`--ship-line`) over heavy multi-shadow stacks.

**Cursor:** enabled `button`s use `cursor: pointer`; disabled use `cursor: not-allowed` (global in `index.css`).

## Motion

| Name                 | Where                   | Notes                                                                     |
| -------------------- | ----------------------- | ------------------------------------------------------------------------- |
| `ship-press`         | `.ship-it-shipping`     | Brief scale on Ship It click (~180ms)                                     |
| `floater-rise`       | `.click-floater`        | `+N` feedback (~700ms); shorter step-end under `prefers-reduced-motion`   |
| `atmosphere-drift`   | `.ship-atmosphere-blob` | Slow backdrop drift; **off** under reduced motion                         |
| `tps-tick-pulse`     | `.tokens-tps-pulse`     | Soft opacity nudge on tokens/s (~1.6s throttle); off under reduced motion |
| `office-talk-in`     | `.office-talk-bubble`   | Occasional Dev speech bubble above the office                             |
| `buy-spend-flash`    | `.buy-spend-flash`      | Brief brightness flash on buy / spend                                     |
| `office-dev-bob`     | `.office-dev`           | Light Dev idle bob; off under reduced motion                              |
| `office-spawn-pop`   | `.office-dev-spawn`     | Buy spawn celebration on new Dev sprite                                   |
| `office-stage-flash` | `.office-stage-flash`   | Optional inset flash when milestone stage changes                         |
| `shop-drawer-up`     | `.shop-drawer-panel`    | Mobile shop bottom sheet enter (~220ms); off under reduced motion         |
| `tip-fade-in`        | `.play-tip`             | Ephemeral play tip enter                                                  |

Always respect `prefers-reduced-motion` (already in `index.css`). Prefer light CSS motion; no audio in MVP.

Scene-local flavor (e.g. `--office-mug` on `.office-scene`) may use warmer prop colors without promoting them to shell `--ship-*` tokens — see `scene.md`. Per-upgrade hues above are shared shell tokens for shop + props.

## Checklist for UI PRs

- [ ] Uses `--ship-*` tokens (no one-off shell palette)
- [ ] Type stays Space Grotesk + documented sizes
- [ ] Spacing follows the rhythm above (or this doc is updated)
- [ ] Reduced-motion still sane
- [ ] English copy only
- [ ] This file updated if tokens / rules changed

## Out of scope (for now)

- Full design-system components library
- Dark mode theme
- Localized type scales per breakpoint beyond Tailwind defaults
