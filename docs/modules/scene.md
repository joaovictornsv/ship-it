# Scene

DOM + CSS living office, LOD caps (24–48), rooms, animation / `prefers-reduced-motion`.

**Status:** stub — issue #7+. Hook wired from shop buys in #6.

## Owned by

- `src/features/scene/` — `onUpgradeOwnedChanged` stub (no sprites yet)

## Hooks (stub)

| API                                | Behavior                       |
| ---------------------------------- | ------------------------------ |
| `onUpgradeOwnedChanged(id, owned)` | No-op until living office (#7) |

Shop calls this after a successful `buyUpgrade` so #7 can attach presence without reshaping the buy path.

## LOD (planned — #7)

- Render at most ~24–48 Dev sprites; above that show a `×N` badge so the scene stays smooth.
- Prefer light CSS motion; respect `prefers-reduced-motion`.
- Buildings/props for non-Dev upgrades can be minimal in #7.

## Milestone densification (planned — #7)

Discrete **scene stages** keyed off **Dev** owned count. Crossing a threshold should shift the office (layout / props / density), not only add another sprite.

| Owned Devs | Stage feel (MVP sketch)                     |
| ---------- | ------------------------------------------- |
| 0          | Empty / sparse office                       |
| 1          | Solo hacker — first desk occupied           |
| 10         | Small team — more desks / mugs / monitors   |
| 25         | Open-plan densification                     |
| 50+        | Crowded office; LOD + badge carry the count |

Implementation notes:

- Data-driven thresholds (constants or catalog field), not hard-coded one-offs in JSX.
- Cheap CSS/DOM variants (stage class, prop set, idle anim) — no new art pipeline in #7.
- Stages are **not** Dev tier promotion (junior → mid → senior); that stays post-MVP.
- Other upgrades rewriting Dev visuals (e.g. CI “hard hats”) are out of scope for #7.
