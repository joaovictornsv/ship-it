# Check quality reference (stub)

Shared scope and report template for check-quality tiers. Flesh out in roadmap issue #13.

## Tiers

| Tier            | Focus                                                    |
| --------------- | -------------------------------------------------------- |
| `check-quality` | Full pipeline before PR                                  |
| `verify`        | `pnpm test`, lint, typecheck, build                      |
| `review`        | REVIEW.md / AGENTS patterns, dead code, module-doc drift |
| `audit`         | Save/security assumptions + scene/tick perf              |

## Fast path (verify)

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

## Report template (stub)

```text
## Check quality
- verify: pass|fail
- review: pass|fail|skipped
- audit: pass|fail|skipped
Notes:
```
