# Scene

DOM + CSS living office, LOD caps (24–48 desktop lean; leaner on mobile), rooms, animation / `prefers-reduced-motion`.

**Status:** active — desk-grid office + icon sprites (issue #28); mobile sprite lean from #8.

## Owned by

- `src/features/scene/` — `OfficeScene`, `DevSprite`, LOD / stage helpers, `sceneEvents`, `onUpgradeOwnedChanged`
- `src/app/breakpoints.ts` / `useMediaQuery` — desktop vs mobile sprite budget
- `src/styles/index.css` — `.office-*` desk farm, stage density, bob / spawn / stage flash
- `src/app/PlayView.tsx` — mounts `OfficeScene` as the play stage above the HUD + Ship It cluster

## Presence

| Source                         | Behavior                                                       |
| ------------------------------ | -------------------------------------------------------------- |
| Zustand `owned[dev]`           | `OfficeScene` subscribes; hydrate / buy both update the crowd  |
| `onUpgradeOwnedChanged(id, n)` | Notifies `sceneEvents` → spawn pop on Dev buy                  |
| `owned[espresso-machine]` etc. | Colored prop chips in the props rail (espresso, PR, CI, pager) |

Buying a Dev increases tokens/s **and** spawns a visible character (until the LOD cap).

## Desk farm + sprites

| Rule               | Value                                                                      |
| ------------------ | -------------------------------------------------------------------------- |
| Layout             | CSS Grid `.office-desk-farm` — occupied cells get a Dev + desk surface     |
| Empty desks        | Stage-driven minimum desk count so the office densifies before the LOD cap |
| Dev sprite         | Lucide `LaptopMinimal` (recognizable icon, not stick-figure CSS)           |
| Breakpoint         | Same as shop: Tailwind `lg` / `min-width: 1024px` (`DESKTOP_MEDIA_QUERY`)  |
| Desktop sprite cap | `SCENE_SPRITE_CAP = 32` (mid-range of 24–48 lean)                          |
| Mobile sprite cap  | `SCENE_SPRITE_CAP_MOBILE = 16` (below `lg`)                                |
| Cap helper         | `sceneSpriteCap(isDesktop)`                                                |
| Visible sprites    | `min(owned, cap)` via `visibleDevCount`                                    |
| Badge              | When `owned > cap`, show `×{owned}` so 100+ stays readable                 |
| Stage panel        | `max-w-xl` → `sm:max-w-2xl`, `rounded-2xl` — reads as a stage              |

Helpers: `src/features/scene/lod.ts` (unit-tested).

### Contributor skins (#10 extension point)

`DevSprite` documents the swap point: keep the desk-cell layout contract and replace the Lucide glyph (or wrap the component) with a skin-aware renderer fed by the opt-in contributor pool. `sceneEvents` / `onUpgradeOwnedChanged` stay the buy-side hook for spawn FX.

## Milestone densification

Discrete **scene stages** keyed off **Dev** owned count. Crossing a threshold shifts the office (empty desk count / floor tint), not only +1 sprite. Stage changes briefly flash the panel (`.office-stage-flash`).

| Owned Devs | Stage id     | Feel                                    |
| ---------- | ------------ | --------------------------------------- |
| 0          | `empty`      | Sparse office — faint empty desk        |
| 1          | `solo`       | Solo hacker — first desk occupied       |
| 10         | `small-team` | Small team — more desks visible         |
| 25         | `open-plan`  | Open-plan densification — full desk set |
| 50+        | `crowded`    | Crowded office; LOD + badge carry count |

- Data-driven: `SCENE_STAGES` / `sceneStageForOwned` in `src/features/scene/stages.ts`.
- Cheap CSS variants (`.office-stage-*`) — no art pipeline in #7 / #28.
- Stages are **not** Dev tier promotion (junior → mid → senior).

## Motion

| Name                 | Where                  | Notes                                                            |
| -------------------- | ---------------------- | ---------------------------------------------------------------- |
| `office-dev-bob`     | `.office-dev`          | Light idle bob (~2.4s); **off** under `prefers-reduced-motion`   |
| `office-spawn-pop`   | `.office-dev-spawn`    | Short celebration when a Dev is bought                           |
| `office-stage-flash` | `.office-stage-flash`  | Inset flash on milestone stage change                            |
| Desk opacity         | `.office-desk-surface` | Short opacity ease when stage changes; none under reduced motion |

Shell motion (`ship-press`, `floater-rise`, `shop-drawer-up`, atmosphere, HUD pulse) stays documented in `ui.md`. Scene mug tint (`--office-mug`) is **local** to `.office-scene` — not a global shell token. Upgrade prop hues use `--ship-upgrade-*`.

## Out of scope (here)

- Unlockable rooms / prestige keep-list (#11)
- Contributor skins implementation (#10)
- Pixel art pipeline
