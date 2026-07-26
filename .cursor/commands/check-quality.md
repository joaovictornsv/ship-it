# Check quality (full)

Orchestrates verify → review → (optional) audit before a PR.

Read [`.cursor/check-quality-reference.md`](../check-quality-reference.md) for
scope and report templates.

## Pipeline (run in this order)

### 1. Verify

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

If verify fails, **stop** — do not run review.

### 2. Review

Follow [`.cursor/commands/review.md`](./review.md):

1. Enum logic centralization
2. REVIEW.md code quality

### 3. Audit (optional / when save or scene touched)

Follow [`.cursor/commands/audit.md`](./audit.md) when the change touches saves,
checksums, security assumptions, scene LOD, or the tick loop.

## Final report

Emit the full pipeline report from the reference doc.
