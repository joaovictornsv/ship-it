# Verify (check-quality tier)

Fast gate: lint, types, unit tests, production build.

Skill: [`.cursor/skills/check-quality/SKILL.md`](../skills/check-quality/SKILL.md).
Reference: [`.cursor/check-quality-reference.md`](../check-quality-reference.md).

## Run

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

- Prefer `pnpm` scripts (CI uses Node 24 + frozen lockfile).
- On failure: fix, re-run the full chain; do not proceed to review/audit or open a PR.
- Focused iteration: `pnpm exec vitest run path/to/file.test.ts`, then re-run the full verify before PR.

## Report

Note verify as `pass` or `fail` in the check-quality report (or alone as a one-liner).
