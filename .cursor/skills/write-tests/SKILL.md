---
name: write-tests
description: >-
  Add or extend Vitest coverage for economy, saves, migrations, and pure
  helpers. Use when adding formulas, save logic, or pure feature helpers.
---

# write-tests

Prefer **Vitest unit tests** next to pure modules. No Playwright / E2E in v1.

## When to add tests

| Area                 | Cover                                                                               |
| -------------------- | ----------------------------------------------------------------------------------- |
| Economy formulas     | cost curves, tokens/s, click power, bulk/max-affordable, prestige gains / mults     |
| Saves                | codec round-trip, checksum mismatch → load anyway, storage slot, hydrate edge cases |
| Migrations           | each `v → v+1` migrator; unknown newer `v` throws; fields default correctly         |
| Pure feature helpers | shop queues, affordability, LOD caps, formatters, enum helpers                      |
| React (sparingly)    | only when behavior is awkward to unit without a thin component test already in repo |

## Patterns

1. **Colocate:** `foo.ts` → `foo.test.ts` (same folder).
2. **Pure first:** test `src/game/economy.ts`, `src/features/save/*`, and feature helpers without mounting the app.
3. **Inject a clock** for time-based logic (tick, autosave windows) — do not rely on real wall time.
4. **Stable fixtures:** build minimal `GameState` / owned maps; avoid full Zustand when a pure function suffices.
5. **Name by behavior:** `it('loads anyway when checksum mismatches')`, not `it('works')`.
6. **Keep formulas free of React/DOM** — if you need DOM to test a formula, the formula is in the wrong place.

## Commands

```bash
pnpm test                 # full suite
pnpm exec vitest run path/to/file.test.ts   # focused
```

## Do not

- Add Playwright or browser E2E in v1.
- Snapshot huge DOM trees without need.
- Leave new branching in `economy.ts` / migrators untested.

## Proof

Cite the test file and a short count or assertion names on the issue checklist / PR Agent test plan.
