# UI

Shell chrome, design tokens, typography, spacing, and motion for **Ship It**.

**Status:** active — shipping / CI dock palette (tokens currency era).

**Owned by**

- `src/styles/index.css` — CSS custom properties + shell background / motion
- `index.html` — Space Grotesk font load
- Feature components under `src/app/`, `src/features/*` — consume tokens via `var(--ship-*)` / Tailwind

Agents and humans that change player-facing UI **must** read this doc and follow it. New GitHub issues that touch UI must require compliance (see `create-issue` / `implement-issue` skills).

## Direction

| Intent | Rule                                                                           |
| ------ | ------------------------------------------------------------------------------ |
| Look   | Cool **slate** + **deploy teal** — shipping / CI chrome, not coffee-shop brown |
| Flavor | Coffee / Espresso stay as **scene props and jokes**, not shell colors          |
| Copy   | English only (product rule)                                                    |
| Stack  | Tailwind utilities + CSS variables — do not invent parallel theme systems      |

## Color tokens

Defined on `:root` in `src/styles/index.css`. Prefer these over raw hex in components.

| Token                | Value                  | Use                                                   |
| -------------------- | ---------------------- | ----------------------------------------------------- |
| `--ship-bg`          | `#e6edf5`              | Page base (under gradient / grid)                     |
| `--ship-bg-elevated` | `#f4f7fb`              | Header / panel surfaces                               |
| `--ship-ink`         | `#122033`              | Primary text                                          |
| `--ship-muted`       | `#5b6b7c`              | Secondary text, helper copy                           |
| `--ship-accent`      | `#0f7a74`              | Primary actions (Ship It, buy), focus rings, floaters |
| `--ship-accent-deep` | `#0a524e`              | Accent press shadow / depth                           |
| `--ship-line`        | `color-mix(… ink 12%)` | Borders / hairlines                                   |

**Do not** reintroduce coffee-brown (`#8b5a2b`, cream `#f3eee4`, etc.) for shell chrome. Scene art may use warmer props later; keep them out of global tokens unless this doc is updated.

**Avoid:** purple / indigo default gradients, dark-mode-first shells, neon glow stacks, emoji-as-chrome.

### Tailwind usage

```tsx
className =
  'bg-[var(--ship-accent)] text-[var(--ship-ink)] border-[var(--ship-line)]';
```

For translucent mixes, use `color-mix` with underscores in arbitrary values, e.g. `bg-[color-mix(in_srgb,var(--ship-bg-elevated)_88%,transparent)]`.

## Typography

| Role                         | Spec                                                                                                                            |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Family                       | **Space Grotesk** (`index.html` Google Fonts), then `ui-sans-serif, system-ui, sans-serif`                                      |
| Body                         | Inherited ink color; default size from browser / Tailwind `text-base` for helper copy                                           |
| Brand / titles               | `font-semibold` or `font-bold`, `tracking-tight`                                                                                |
| Numbers (bank, costs, rates) | `tabular-nums`                                                                                                                  |
| Hierarchy (shell today)      | Brand `text-lg`; Ship It CTA `text-2xl`; body `text-base`; meta `text-sm` / `text-xs`; header nav links `text-sm font-semibold` |

Do not add Inter / Roboto / Arial as the primary UI face. Do not introduce a second display font without updating this doc.

## Spacing & layout

Use Tailwind’s default spacing scale. Prefer this shell rhythm:

| Token-ish     | Tailwind                                                                                     | Use                                                                |
| ------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Page gutter   | `px-4`                                                                                       | Header / main horizontal padding                                   |
| Section stack | `gap-8`                                                                                      | Main column between CTA / shop                                     |
| Cluster       | `gap-2`–`gap-4`                                                                              | Tight groups (title + helper, header row)                          |
| Header nav    | Brand + `gap-3` text links (**Save** / **Back to play**)                                     | Lightweight hash views (`#/` / `#/save`); no router dependency yet |
| Panel pad     | `px-4 py-3`                                                                                  | Shop / card-like interactive rows                                  |
| Content max   | `max-w-6xl` (shell), `max-w-md` (single shop row / Save panel), `max-w-sm` (helper sentence) |
| Main vertical | `py-10`                                                                                      | Primary play / Save area breathing room                            |

**Radius:** interactive panels `rounded-xl`; small controls `rounded-lg`; primary Ship It CTA `rounded-2xl`.

**Cards:** only when they wrap a clear interaction (e.g. buy row). Prefer token borders (`--ship-line`) over heavy multi-shadow stacks.

## Motion

| Name           | Where               | Notes                                                                   |
| -------------- | ------------------- | ----------------------------------------------------------------------- |
| `ship-press`   | `.ship-it-shipping` | Brief scale on Ship It click (~180ms)                                   |
| `floater-rise` | `.click-floater`    | `+N` feedback (~700ms); shorter step-end under `prefers-reduced-motion` |

Always respect `prefers-reduced-motion` (already in `index.css`). Prefer light CSS motion; no audio in MVP.

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
