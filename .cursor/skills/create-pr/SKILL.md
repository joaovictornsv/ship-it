---
name: create-pr
description: >-
  Open a Ship It pull request after quality checks with Summary, Agent test
  plan (agent-checked), and Human test plan (left unchecked). Use when opening
  or updating a PR, or when implement-issue reaches the PR step.
---

# create-pr

Open a PR against `main` after quality gates pass. Structured body + assignee.

**Assignee:** always assign `@joaovictornsv` on the PR.

## Before opening

1. Confirm branch is pushed and tracks `origin` (`git push -u origin HEAD` if new).
2. Run **`check-quality`** (see that skill / `.cursor/commands/check-quality.md`):
   - Always: verify (`pnpm lint && pnpm typecheck && pnpm test && pnpm build`)
   - When `src/` changed: review tier (enum + REVIEW.md)
   - When save / checksum / scene LOD / tick touched: audit tier
3. Fix failures before opening. Do not open a red PR.
4. Follow `git-workflow`: no force push, no rebase, no squash, PR-only to `main`.

## Test plan sections

Always split verification into two checklists. Do not mix them.

### Agent test plan — agent owns

Commands an agent can run. Examples: `pnpm test`, `pnpm lint`, `pnpm typecheck`, `pnpm build`, or a chained `pnpm lint && pnpm typecheck && pnpm test && pnpm build`. Optionally note which suites or areas the command covers after an em dash.

**The opening agent must execute these commands and mark them done.** Do not leave agent items unchecked for the human reviewer.

- Run each listed command successfully before (or as part of) opening/updating the PR.
- Write the PR body with `- [x]` for every agent item that passed.
- If a command fails, fix it and re-run; do not check the box until it passes.
- When editing an existing PR body, keep agent boxes in sync with what you actually ran.

```markdown
## Agent test plan

- [x] `pnpm test` — economy / save / feature suites touched by this PR
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

For agent-only / docs-only PRs (no player-facing UI), still include a short Human test plan when useful (e.g. “N/A — docs/skills only; spot-check AGENTS.md links”), or one smoke item. Prefer at least one agent command checklist.

Omit a section only if it has nothing useful (rare).

## Create

```bash
# After agent commands succeed — agent items are already checked:
gh pr create --repo joaovictornsv/ship-it \
  --assignee joaovictornsv \
  --base main \
  --title "TITLE" \
  --body "$(cat <<'EOF'
## Summary
- …
- …

## Agent test plan
- [x] `pnpm lint && pnpm typecheck && pnpm test && pnpm build`

## Human test plan
- [ ] …

Closes #N
EOF
)"
```

Title: short human summary of the change (not necessarily the raw issue title). Body **Summary** is 1–3 bullets of what landed. Use `Closes #N` when this PR fully completes the issue.

If the PR already exists without an assignee:

```bash
gh pr edit N --repo joaovictornsv/ship-it --add-assignee joaovictornsv
```

After create, paste the PR URL onto the issue’s `(PR)` execution-checklist line via `gh issue edit` (body-file), not as a status comment.

## Do not

- Force-push to `main`.
- Invent release tags or ship `create-release` while the roadmap defers it.
- Leave Agent test plan boxes unchecked for the human.
- Ask the human to run `pnpm` / lint / test / build for you.
