---
name: quality-check
description: >-
  Full pre-ship quality pipeline orchestrator. Stub until roadmap #13.
---

# quality-check (stub)

**Status:** thin stub — deepen in issue #13.

Minimum verify (always):

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

See `.cursor/quality-check-reference.md` for tiers (verify / review / audit).
