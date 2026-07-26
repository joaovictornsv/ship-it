# Check quality reference

Shared scope and report templates for check-quality tiers.

## Scope

Review and audit tiers cover changed files under `src/` (and related `docs/modules/` when behavior changes). Verify runs repo-wide scripts.

## Tiers

| Tier            | Focus                                                                  |
| --------------- | ---------------------------------------------------------------------- |
| `check-quality` | Full pipeline before PR                                                |
| `verify`        | `pnpm lint`, typecheck, test, build                                    |
| `review`        | REVIEW.md / AGENTS patterns, **enum centralization**, module-doc drift |
| `audit`         | Save/security assumptions + scene/tick perf                            |

## Fast path (verify)

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

## Review-tier report template

```text
## Check quality — review
- enum logic: pass | pass (skipped) | fail
- code quality (REVIEW.md): pass | fail
Notes:
```

## Full pipeline report template

```text
## Check quality
- verify: pass|fail
- review: pass|fail|skipped
- audit: pass|fail|skipped
Notes:
```
