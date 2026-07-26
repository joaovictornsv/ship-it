---
name: check-quality
description: >-
  Full pre-ship quality pipeline orchestrator. Stub until roadmap #13.
---

# check-quality (stub)

**Status:** thin stub — deepen in issue #13.

Minimum verify (always):

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

See `.cursor/check-quality-reference.md` for tiers (verify / review / audit).
