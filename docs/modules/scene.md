# Scene

DOM + CSS living office, LOD caps (24–48), rooms, animation / `prefers-reduced-motion`.

**Status:** active — visible Devs + LOD + milestone stages (issue #7). Mobile sprite lean in #8.

## Owned by

- `src/features/scene/` — `OfficeScene`, LOD / stage helpers, `onUpgradeOwnedChanged` buy notify
- `src/styles/index.css` — `.office-*` layout, stage desk density, Dev idle bob
- `src/app/PlayView.tsx` — mounts `OfficeScene` above Ship It

## Presence

| Source                         | Behavior                                                               |
| ------------------------------ | ---------------------------------------------------------------------- |
| Zustand `owned[dev]`           | `OfficeScene` subscribes; hydrate / buy both update the crowd          |
| `onUpgradeOwnedChanged(id, n)` | Still called after successful buy (extension point for spawn FX later) |
| `owned[espresso-machine]`      | Minimal coffee prop (+ `×N` when > 1); not a full building yet         |

Buying a Dev increases tokens/s **and** spawns a visible character (until the LOD cap).

## LOD

| Rule            | Value                                                     |
| --------------- | --------------------------------------------------------- |
| Sprite cap      | `SCENE_SPRITE_CAP = 32` (mid-range of 24–48 lean)         |
| Visible sprites | `min(owned, 32)` via `visibleDevCount`                    |
| Badge           | When `owned > 32`, show `×{owned}` so 100+ stays readable |
| Slots           | Deterministic `DEV_SLOTS` positions — no Canvas           |

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

Shell motion (`ship-press`, `floater-rise`) stays documented in `ui.md`. Scene mug tint (`--office-mug`) is **local** to `.office-scene` — not a global shell token.

## Out of scope (here)

- Mobile sprite budget / leaner scene (#8)
- Unlockable rooms / prestige keep-list (#11)
- Contributor skins (#10)
- Pixel art pipeline
