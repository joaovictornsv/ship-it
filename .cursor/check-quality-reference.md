# Check quality reference

Shared scope and report templates for check-quality tiers.

## Scope

| Tier   | Scope                                                                          |
| ------ | ------------------------------------------------------------------------------ |
| verify | Repo-wide scripts (lint, typecheck, test, build)                               |
| review | Changed files under `src/` (+ matching `docs/modules/` when contracts move)    |
| audit  | Save/security assumptions and/or scene LOD + tick cost when those areas change |

## Tiers

| Tier            | Focus                                                                  |
| --------------- | ---------------------------------------------------------------------- |
| `check-quality` | Full pipeline before PR                                                |
| `verify`        | `pnpm lint`, typecheck, test, build                                    |
| `review`        | REVIEW.md / AGENTS patterns, **enum centralization**, module-doc drift |
| `audit`         | Save/security assumptions + scene/tick perf                            |

## When to run which tier

| Change kind                                   | verify | review | audit             |
| --------------------------------------------- | ------ | ------ | ----------------- |
| Docs / skills / AGENTS only                   | yes    | skip   | skip              |
| `src/` feature or game logic                  | yes    | yes    | skip unless below |
| Save codec, migrator, checksum, export/import | yes    | yes    | yes (security)    |
| Scene LOD, rooms, tick loop, production raf   | yes    | yes    | yes (perf)        |
| Both save and scene                           | yes    | yes    | yes (both)        |

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

## Audit-tier report template

```text
## Check quality — audit
- security (saves / secrets): pass | pass (skipped) | fail
- perf (scene LOD / tick): pass | pass (skipped) | fail
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
