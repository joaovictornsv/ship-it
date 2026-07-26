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

1. Run every **Agent test plan** command (at minimum `pnpm lint && pnpm typecheck && pnpm test && pnpm build`). Fix failures before opening.
2. Push the branch
3. `gh pr create` with Summary + **Agent test plan** + **Human test plan**; link the issue (`Closes #N` when appropriate); assign yourself.

## Test plan sections

Always split verification into two checklists. Do not mix them.

### Agent test plan — agent owns

Commands an agent can run. Examples: `pnpm test`, `pnpm lint`, `pnpm typecheck`, `pnpm build`, or a chained `pnpm lint && pnpm typecheck && pnpm build`. Optionally note which suites or areas the command covers after an em dash.

**The opening agent must execute these commands and mark them done.** Do not leave agent items unchecked for the human reviewer.

- Run each listed command successfully before (or as part of) opening/updating the PR.
- Write the PR body with `- [x]` for every agent item that passed.
- If a command fails, fix it and re-run; do not check the box until it passes.
- When editing an existing PR body, keep agent boxes in sync with what you actually ran.

```markdown
## Agent test plan

- [x] `pnpm test` — codec round-trip, mismatch load-anyway, storage slot, hydrate
- [x] `pnpm lint && pnpm typecheck && pnpm build`
```

### Human test plan — human owns

Manual UI / playthrough steps only — no shell commands. Write actions a human performs in the browser or DevTools.

**Leave these unchecked (`- [ ]`).** The human reviewer marks them after manual verification. The agent never checks human items.

```markdown
## Human test plan

- [ ] Play: click / buy Espresso, reload — tokens and owned restore
- [ ] Tamper checksum in DevTools / edit export — load warns but still plays
```

Omit a section only if it has nothing useful (rare). Prefer at least one agent command checklist and one human playthrough item when the change is player-facing.

## Create

```bash
# After agent commands succeed — agent items are already checked:
gh pr create --repo joaovictornsv/ship-it \
  --assignee joaovictornsv \
  --title "TITLE" \
  --body "$(cat <<'EOF'
## Summary
…

## Agent test plan
- [x] `pnpm test`
- [x] `pnpm lint && pnpm typecheck && pnpm build`

## Human test plan
- [ ] …

Closes #N
EOF
)"
```

If the PR already exists without an assignee:

```bash
gh pr edit N --repo joaovictornsv/ship-it --add-assignee joaovictornsv
```

Do not force-push to `main`. Do not invent release tags.
