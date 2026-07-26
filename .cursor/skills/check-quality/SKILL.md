---
name: check-quality
description: >-
  Full pre-ship quality pipeline orchestrator. Verify + review (incl. enum
  logic) + audit. Deepen remaining stubs in roadmap issue #13.
---

# check-quality

**Status:** verify solid; review tier includes **enum logic centralization** (see `.cursor/commands/review.md`). Audit / full orchestration deepen in #13.

Minimum verify (always):

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

See `.cursor/check-quality-reference.md` for tiers (verify / review / audit).
