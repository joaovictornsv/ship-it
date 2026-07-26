# AGENTS.md — Ship It

How agents (and humans) work in this repo.

## Run

```bash
pnpm install
pnpm dev          # app
pnpm test         # Vitest
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

Lefthook runs format + lint (staged) + typecheck on pre-commit (`pnpm exec lefthook install` once after clone).

## Architecture map

| Area           | Path                                              |
| -------------- | ------------------------------------------------- |
| App shell      | `src/app/`                                        |
| Features       | `src/features/{click,shop,scene,save}/`           |
| Pure game      | `src/game/` (`economy`, `tick`, `state`, `types`) |
| Static data    | `src/data/`                                       |
| Styles         | `src/styles/`                                     |
| Module docs    | `docs/modules/*.md`                               |
| Product / tech | `docs/PRODUCT.md`, `docs/TECHNICAL.md`            |
| Roadmap issues | `docs/ISSUES.md`                                  |

**Stack (locked):** Vite, React 19, TypeScript strict, Tailwind, Zustand, Vitest, pnpm, Lefthook, Node 24 CI. Scene = DOM + CSS. Saves = versioned + SHA-256 + base64. English-only UI copy.

## Do

- Open / implement issues from `docs/ISSUES.md` in order.
- From roadmap **#3 onward**, create GitHub issues with the **`create-issue`** skill (do not invent labels).
- Update the matching `docs/modules/*.md` in the same PR as behavior changes.
- Keep economy formulas pure and unit-tested.
- Prefer one PR-sized issue.

## Don’t

- Reopen locked PRODUCT / TECHNICAL decisions — file bugs / follow-ups instead.
- Add Playwright / E2E in v1.
- Put secrets in the client.
- Invent GitHub labels beyond those listed in `docs/ISSUES.md`.
- Ship GitHub Releases / tags / a real `create-release` skill while the roadmap says not to.

## Skills & commands

| Skill / command                             | Status                                                 |
| ------------------------------------------- | ------------------------------------------------------ |
| `create-issue`                              | **Usable** — open roadmap issues from `docs/ISSUES.md` |
| `implement-issue`                           | Stub until #13                                         |
| `create-pr`                                 | Stub until #13                                         |
| `check-quality` (+ verify / review / audit) | Stub until #13                                         |
| `write-tests` / `update-docs`               | Stub until #13                                         |
| Domain skills (`add-upgrade`, …)            | Stub until needed / #13                                |

Entrypoints: `.cursor/skills/`, `.cursor/commands/`, `.cursor/check-quality-reference.md`.

## Self-heal

If a skill or doc is proven stale by implementation, update the canonical doc in the same change or file a follow-up issue.
