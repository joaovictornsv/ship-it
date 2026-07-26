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

1. **No issue comments for execution status.** Do not post checklist comments. The issue **body** is the tracker.
2. **Create `## Execution checklist` in the issue body before coding.** Append it; preserve the original problem statement.
3. **Update the checklist in-place** as work progresses (`gh issue edit … --body-file`).
4. **Work item by item.** Mark the current line `(IN PROGRESS)`, implement, prove, then `(DONE)` with proof (or `(BLOCKED)` with a reason).
5. **Assign yourself** at the start. Open the PR with `create-pr` when ready (that skill also assigns `@joaovictornsv`).
6. **Use issue-linked commit messages** when the user asks for a commit (never commit unprompted):

```text
#<number> <short subject>

- <change in this commit>
- <change in this commit>
```

Example: `#4 Add espresso machine passive income` then `- ` bullets for what that commit actually changed.

## Checklist format

Append if missing (derive items from acceptance criteria; keep lines concrete + proof):

```markdown
## Execution checklist

- [ ] (TODO) (PLAN) Confirm scope and acceptance criteria from the issue body.
- [ ] (TODO) (ASSIGN) Assign issue to joaovictornsv.
- [ ] (TODO) (CODE) Implement <specific behavior>. Proof: <focused test/check>.
- [ ] (TODO) (TEST) Add or update unit tests for <behavior>.
- [ ] (TODO) (DOCS) Update matching `docs/modules/*.md` if behavior changed.
- [ ] (TODO) (VERIFY) `pnpm lint && pnpm typecheck && pnpm test && pnpm build`.
- [ ] (TODO) (PR) Open PR with `create-pr` and link it here.
```

Status rules (match CommitSwimming-style tags):

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

When committing (only if the user asks), use `#<number> <short subject>` on the first line, then `- ` bullets for the changes in that commit.

### 4. Closeout

1. Run verify: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`.
2. Open a PR with `create-pr`; put the PR URL on the `(PR)` checklist line as `(DONE)`.
3. Leave the issue body as the single source of checklist truth.

See `AGENTS.md` and `.cursor/check-quality-reference.md`.
