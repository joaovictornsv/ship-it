---
name: create-pr
description: >-
  Open a pull request after quality checks with a structured body. Stub until
  roadmap #13.
---

# create-pr (stub)

**Status:** thin stub — deepen in issue #13.

**Assignee:** always assign `@joaovictornsv` on the PR.

Before opening:

1. `pnpm lint && pnpm typecheck && pnpm test && pnpm build`
2. Push the branch
3. `gh pr create` with Summary + Test plan; link the issue (`Closes #N` when appropriate); assign yourself:

```bash
gh pr create --repo joaovictornsv/ship-it \
  --assignee joaovictornsv \
  --title "TITLE" \
  --body "$(cat <<'EOF'
## Summary
…

## Test plan
…

Closes #N
EOF
)"
```

If the PR already exists without an assignee:

```bash
gh pr edit N --repo joaovictornsv/ship-it --add-assignee joaovictornsv
```

Do not force-push to `main`. Do not invent release tags.
