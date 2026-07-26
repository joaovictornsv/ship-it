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
