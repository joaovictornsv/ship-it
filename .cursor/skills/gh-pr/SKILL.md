---
name: gh-pr
description: >-
  Open a pull request after quality checks with a structured body. Stub until
  roadmap #13.
---

# gh-pr (stub)

**Status:** thin stub — deepen in issue #13.

Before opening:

1. `pnpm lint && pnpm typecheck && pnpm test && pnpm build`
2. Push the branch
3. `gh pr create` with Summary + Test plan; link the issue (`Closes #N` when appropriate)

Do not force-push to `main`. Do not invent release tags.
