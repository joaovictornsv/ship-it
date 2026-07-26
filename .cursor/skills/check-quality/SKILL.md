---
name: check-quality
description: >-
  Full pre-ship quality pipeline: verify, then review (incl. enum logic), then
  optional audit. Deepen remaining stubs in roadmap issue #13.
---

# check-quality

**Status:** verify + review (enum centralization) wired. Audit / richer
orchestration deepen in #13.

Entrypoint: [`.cursor/commands/check-quality.md`](../../commands/check-quality.md).

Minimum verify (always):

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

After verify passes, run the review tier (enum logic + REVIEW.md) per
`.cursor/commands/review.md`. See `.cursor/check-quality-reference.md` for
tiers and report templates.
