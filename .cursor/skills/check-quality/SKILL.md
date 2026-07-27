---
name: check-quality
description: >-
  Full pre-ship quality pipeline: verify, then review (incl. enum logic), then
  optional audit. Use before opening a PR or when the user runs /check-quality,
  /verify, /review, or /audit.
---

# check-quality

Orchestrate quality tiers before a PR. Shared scope and report templates live in
[`.cursor/check-quality-reference.md`](../../check-quality-reference.md).

Entrypoint: [`.cursor/commands/check-quality.md`](../../commands/check-quality.md).

## Pipeline (always this order)

### 1. Verify (required)

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

If verify fails, **stop** — do not run review or audit. Fix and re-run.

Command: [`.cursor/commands/verify.md`](../../commands/verify.md).

### 2. Review (when `src/` or behavior docs changed)

Follow [`.cursor/commands/review.md`](../../commands/review.md):

1. Enum / catalog centralization (per-value fields on defs, not parallel maps)
2. REVIEW.md code quality on changed files

If the change is docs/skills-only with no `src/` diff, mark review **skipped** in the report.

### 3. Audit (when save, security, scene LOD, or tick touched)

Follow [`.cursor/commands/audit.md`](../../commands/audit.md). Otherwise mark audit **skipped**.

## Final report

Emit the full pipeline template from the reference doc. Example:

```text
## Check quality
- verify: pass
- review: pass | skipped
- audit: pass | skipped
Notes:
```

## Relation to create-pr

`create-pr` expects verify green (and review/audit when applicable) before
`gh pr create`. Agent test plan boxes on the PR mirror the verify commands you ran.
