---
name: implement-issue
description: >-
  Implement a GitHub issue with an execution checklist and proof. Stub until
  roadmap #13 hardens the delivery loop.
---

# implement-issue (stub)

**Status:** thin stub — deepen in issue #13.

**Assignee:** always assign `@joaovictornsv` on the issue (and on the PR via `create-pr`).

## Core rules

1. **Start from latest `main`.** First action: check for a dirty working tree; if dirty, ask the user how to proceed. When clean (or after they decide), `git checkout main && git pull` before implementing.
2. **No issue comments for execution status.** Do not post checklist comments. The issue **body** is the tracker.
3. **Create `## Execution checklist` in the issue body before coding.** Append it; preserve the original problem statement.
4. **Update the checklist in-place** as work progresses (`gh issue edit … --body-file`).
5. **Work item by item.** Mark the current line `(IN PROGRESS)`, implement, prove, then `(DONE)` with proof (or `(BLOCKED)` with a reason).
6. **Assign yourself** at the start. Open the PR with `create-pr` when ready (that skill also assigns `@joaovictornsv`).
7. **Use issue-linked commit messages** when the user asks for a commit (never commit unprompted). Full rules: `git-workflow` skill. Subject is `#<number> <issue title>` from GitHub (`gh issue view <number> --json title -q .title`), then `- ` bullets for what that commit actually changed. Do not require quality checks before committing.

## Checklist format

Append if missing (derive items from acceptance criteria; keep lines concrete + proof):

```markdown
## Execution checklist

- [ ] (TODO) (SYNC) Checkout `main`, pull latest; if dirty tree, ask user how to proceed.
- [ ] (TODO) (PLAN) Confirm scope and acceptance criteria from the issue body.
- [ ] (TODO) (ASSIGN) Assign issue to joaovictornsv.
- [ ] (TODO) (CODE) Implement <specific behavior>. Proof: <focused test/check>.
- [ ] (TODO) (TEST) Add or update unit tests for <behavior>.
- [ ] (TODO) (DOCS) Update matching `docs/modules/*.md` if behavior changed.
- [ ] (TODO) (VERIFY) `pnpm lint && pnpm typecheck && pnpm test && pnpm build`.
- [ ] (TODO) (PR) Open PR with `create-pr` and link it here.
```

Status rules:

| State             | Line form                            |
| ----------------- | ------------------------------------ |
| Not started       | `- [ ] (TODO) ...`                   |
| Active            | `- [ ] (IN PROGRESS) ...`            |
| Done              | `- [x] (DONE) ... Proof: ...`        |
| Blocked           | `- [ ] (BLOCKED) ... Reason: ...`    |
| Split / follow-up | `- [x] (SPLIT) ... Follow-up: <url>` |
| Skipped           | `- [x] (SKIP) ... Reason: ...`       |

Put proof on the checklist line (paths, commands, test counts). Do **not** dump status into issue comments.

## Workflow

### 0. Sync to latest `main` (first action)

Before loading the issue or writing code:

1. Inspect the working tree: `git status`.
2. **If there are uncommitted changes** (staged, unstaged, or relevant untracked files): **stop**. Summarize what is dirty and **ask the user how to proceed** (e.g. stash, commit, discard, keep working from current branch). Do **not** stash, discard, commit, or overwrite without their explicit choice.
3. When the tree is clean (or the user has resolved dirtiness):

```bash
git checkout main
git pull
```

Then create / switch to the feature branch for the issue as usual. Do not start implementation from a stale or dirty tree without the user deciding.

### 1. Load and assign

```bash
gh issue view N --repo joaovictornsv/ship-it --json title,body,assignees,labels
gh issue edit N --repo joaovictornsv/ship-it --add-assignee joaovictornsv
```

### 2. Write or reuse the checklist in the body

```bash
gh issue view N --repo joaovictornsv/ship-it --json body -q .body > /tmp/issue-body-N.md
# Edit /tmp/issue-body-N.md: append or update ## Execution checklist only
gh issue edit N --repo joaovictornsv/ship-it --body-file /tmp/issue-body-N.md
```

If a checklist already exists, reuse it; refine only when vague or stale.

### 3. Execute one item at a time

For each item: mark `(IN PROGRESS)` in the body → implement → focused proof → mark `(DONE)` with proof (or `(BLOCKED)`). Do not wait until the end to sync the body.

When committing (only if the user asks), follow the `git-workflow` skill: `#<number> <issue title>` from GitHub, then `- ` bullets for the changes in that commit. No quality gates required before the commit.

### 4. Closeout

1. Run verify: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`.
2. Open a PR with `create-pr`; put the PR URL on the `(PR)` checklist line as `(DONE)`.
3. Leave the issue body as the single source of checklist truth.

See `AGENTS.md` and `.cursor/check-quality-reference.md`.
