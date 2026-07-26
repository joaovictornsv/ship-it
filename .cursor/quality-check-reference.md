# Quality check reference (stub)

Shared scope and report template for quality-check tiers. Flesh out in roadmap issue #13.

## Tiers

| Tier                   | Focus                                                    |
| ---------------------- | -------------------------------------------------------- |
| `quality-check`        | Full pipeline before PR                                  |
| `quality-check-verify` | `pnpm test`, lint, typecheck, build                      |
| `quality-check-review` | REVIEW.md / AGENTS patterns, dead code, module-doc drift |
| `quality-check-audit`  | Save/security assumptions + scene/tick perf              |

## Fast path (verify)

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

## Report template (stub)

```text
## Quality check
- verify: pass|fail
- review: pass|fail|skipped
- audit: pass|fail|skipped
Notes:
```
