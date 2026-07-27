# Check quality (full)

Orchestrates verify → review → (optional) audit before a PR.

Read [`.cursor/check-quality-reference.md`](../check-quality-reference.md) for
scope, skip rules, and report templates. Skill:
[`.cursor/skills/check-quality/SKILL.md`](../skills/check-quality/SKILL.md).

## Pipeline (run in this order)

### 1. Verify

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

If verify fails, **stop** — do not run review.

### 2. Review

Follow [`.cursor/commands/review.md`](./review.md) when `src/` (or behavior
module docs) changed. Otherwise mark review **skipped**.

1. Enum logic centralization
2. REVIEW.md code quality

### 3. Audit (when save or scene/tick touched)

Follow [`.cursor/commands/audit.md`](./audit.md) when the change touches saves,
checksums, security assumptions, scene LOD, or the tick loop. Otherwise mark
audit **skipped**.

## Final report

Emit the full pipeline report from the reference doc.
