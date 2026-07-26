---
name: implement-issue
description: >-
  Implement a GitHub issue with an execution checklist and proof. Stub until
  roadmap #13 hardens the delivery loop.
---

# implement-issue (stub)

**Status:** thin stub — deepen in issue #13.

When implementing an issue:

1. Comment or edit the issue with `## Execution checklist` derived from acceptance criteria.
2. Implement item-by-item; note proof (tests, screenshots, commands).
3. Run verify: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`.
4. Open a PR with `create-pr` (when ready) and link the issue.

See `AGENTS.md` and `.cursor/check-quality-reference.md`.
