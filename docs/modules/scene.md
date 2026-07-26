# Scene

DOM + CSS living office, LOD caps (24–48 desktop lean; leaner on mobile), rooms, animation / `prefers-reduced-motion`.

**Status:** active — living office + mobile sprite lean (issue #8).

## Owned by

- `src/features/scene/` — `OfficeScene`, LOD / stage helpers, `onUpgradeOwnedChanged` buy notify
- `src/app/breakpoints.ts` / `useMediaQuery` — desktop vs mobile sprite budget
- `src/styles/index.css` — `.office-*` layout, stage desk density, Dev idle bob
- `src/app/PlayView.tsx` — mounts `OfficeScene` above Ship It

## Presence

| Source                         | Behavior                                                               |
| ------------------------------ | ---------------------------------------------------------------------- |
| Zustand `owned[dev]`           | `OfficeScene` subscribes; hydrate / buy both update the crowd          |
| `onUpgradeOwnedChanged(id, n)` | Still called after successful buy (extension point for spawn FX later) |
| `owned[espresso-machine]`      | Minimal coffee prop (+ `×N` when > 1); not a full building yet         |

Buying a Dev increases tokens/s **and** spawns a visible character (until the LOD cap).

## LOD / sprite budget

| Rule               | Value                                                                     |
| ------------------ | ------------------------------------------------------------------------- |
| Breakpoint         | Same as shop: Tailwind `lg` / `min-width: 1024px` (`DESKTOP_MEDIA_QUERY`) |
| Desktop sprite cap | `SCENE_SPRITE_CAP = 32` (mid-range of 24–48 lean)                         |
| Mobile sprite cap  | `SCENE_SPRITE_CAP_MOBILE = 16` (below `lg`)                               |
| Cap helper         | `sceneSpriteCap(isDesktop)`                                               |
| Visible sprites    | `min(owned, cap)` via `visibleDevCount`                                   |
| Badge              | When `owned > cap`, show `×{owned}` so 100+ stays readable                |
| Slots              | Deterministic `DEV_SLOTS` positions — no Canvas                           |

Helpers: `src/features/scene/lod.ts` (unit-tested).

## Milestone densification

Discrete **scene stages** keyed off **Dev** owned count. Crossing a threshold shifts the office (desks / floor tint / density), not only +1 sprite.

| Owned Devs | Stage id     | Feel                                    |
| ---------- | ------------ | --------------------------------------- |
| 0          | `empty`      | Sparse office — faint empty desk        |
| 1          | `solo`       | Solo hacker — first desk occupied       |
| 10         | `small-team` | Small team — more desks visible         |
| 25         | `open-plan`  | Open-plan densification — full desk set |
| 50+        | `crowded`    | Crowded office; LOD + badge carry count |

- Data-driven: `SCENE_STAGES` / `sceneStageForOwned` in `src/features/scene/stages.ts`.
- Cheap CSS variants (`.office-stage-*`) — no art pipeline in #7.
- Stages are **not** Dev tier promotion (junior → mid → senior).
- Other upgrades rewriting Dev visuals (e.g. CI “hard hats”) are out of scope for #7.

## Motion

| Name             | Where          | Notes                                                            |
| ---------------- | -------------- | ---------------------------------------------------------------- |
| `office-dev-bob` | `.office-dev`  | Light idle bob (~2.4s); **off** under `prefers-reduced-motion`   |
| Desk opacity     | `.office-desk` | Short opacity ease when stage changes; none under reduced motion |

Shell motion (`ship-press`, `floater-rise`, `shop-drawer-up`) stays documented in `ui.md`. Scene mug tint (`--office-mug`) is **local** to `.office-scene` — not a global shell token.

## Out of scope (here)

- Unlockable rooms / prestige keep-list (#11)
- Contributor skins (#10)
- Pixel art pipeline
