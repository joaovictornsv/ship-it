---
name: update-docs
description: >-
  Sync TECHNICAL, PRODUCT, module docs, AGENTS, or REVIEW when decisions or
  APIs change. Stub — use whenever contracts change.
---

# update-docs (stub)

When behavior or contracts change:

1. Update the owning `docs/modules/*.md` in the same PR.
2. Touch `docs/TECHNICAL.md` / `docs/PRODUCT.md` only for locked-decision updates (rare).
3. Keep `AGENTS.md` / `REVIEW.md` pointers accurate.

Self-heal: do not leave stale agent docs.
