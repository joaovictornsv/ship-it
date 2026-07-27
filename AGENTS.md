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

| Area           | Path                                                              |
| -------------- | ----------------------------------------------------------------- |
| App shell      | `src/app/`                                                        |
| Features       | `src/features/{click,shop,scene,save,achievements}/`              |
| Pure game      | `src/game/` (`economy`, `achievements`, `tick`, `state`, `types`) |
| Static data    | `src/data/`                                                       |
| Shared lib     | `src/lib/` (`createEnum`, …)                                      |
| Styles         | `src/styles/` + [`docs/modules/ui.md`](./docs/modules/ui.md)      |
| Module docs    | `docs/modules/*.md`                                               |
| Product / tech | `docs/PRODUCT.md`, `docs/TECHNICAL.md`                            |
| Roadmap issues | `docs/ISSUES.md`                                                  |

**Stack (locked):** Vite, React 19, TypeScript strict, Tailwind, Zustand, Vitest, pnpm, Lefthook, Node 24 CI. Scene = DOM + CSS. Saves = versioned + SHA-256 + base64. English-only UI copy.

## Issue → PR loop

Canonical delivery path (hardened in roadmap #13):

1. **`create-issue`** — file work from `docs/ISSUES.md` or a bug (allowed labels only; include **UI rules**).
2. **`implement-issue`** — sync clean `main`, assign, append `## Execution checklist` to the **issue body**, implement item-by-item with proof (no status comments).
3. **`write-tests`** + **`update-docs`** as behavior/contracts change (same PR).
4. **`check-quality`** — verify → review (when `src/` changes) → audit (when save/scene/tick changes). Shared reference: [`.cursor/check-quality-reference.md`](./.cursor/check-quality-reference.md).
5. **`create-pr`** — push branch, open PR with Summary + **Agent test plan** (agent runs and checks) + **Human test plan** (left unchecked); link `Closes #N`; assign `@joaovictornsv`.
6. Domain helpers when needed: `add-upgrade`, `save-migrate`, `balance-pass`, `prestige-change`.
7. **`create-release`** — deferred while the roadmap says not to ship Releases/tags.

**Dry-run:** issue [#13](https://github.com/joaovictornsv/ship-it/issues/13) itself was delivered with this loop (checklist in the issue body → skills/docs PR → `create-pr`).

## Do

- Open / implement issues from `docs/ISSUES.md` in order.
- From roadmap **#3 onward**, create GitHub issues with the **`create-issue`** skill (do not invent labels).
- Update the matching `docs/modules/*.md` in the same PR as behavior changes.
- Follow [`docs/modules/ui.md`](./docs/modules/ui.md) for player-facing UI (palette, type, spacing, motion).
- Keep economy formulas pure and unit-tested.
- Prefer one PR-sized issue.

## Don’t

- Reopen locked PRODUCT / TECHNICAL decisions — file bugs / follow-ups instead.
- Add Playwright / E2E in v1.
- Put secrets in the client.
- Invent GitHub labels beyond those listed in `docs/ISSUES.md`.
- Ship GitHub Releases / tags / a real `create-release` skill while the roadmap says not to.

## Git

Follow `.cursor/skills/git-workflow/SKILL.md`: no force push, no rebase, no
squash, no amend after push, PR-only to `main`, issue-linked commit subjects.
**No exceptions.** Commits are not gated on lint/typecheck/test/build.

## Skills & commands

| Skill / command                             | Status                                                                              |
| ------------------------------------------- | ----------------------------------------------------------------------------------- |
| `git-workflow`                              | **Usable** — git rules + issue-linked commit format                                 |
| `create-issue`                              | **Usable** — open roadmap issues from `docs/ISSUES.md`                              |
| `implement-issue`                           | **Usable** — execution checklist in issue body → proof → PR                         |
| `create-pr`                                 | **Usable** — quality gates + agent/human test plans                                 |
| `check-quality` (+ verify / review / audit) | **Usable** — orchestrated tiers + [reference](./.cursor/check-quality-reference.md) |
| `write-tests`                               | **Usable** — Vitest patterns for economy / saves / pure helpers                     |
| `update-docs`                               | **Usable** — module docs + self-heal                                                |
| `add-upgrade`                               | **Usable** — catalog entry + shop/scene/docs/tests                                  |
| `save-migrate`                              | **Usable** — bump `v`, migrator, tests, `saves.md`                                  |
| `balance-pass`                              | **Usable** — tune costs/CPS/constants + docs/tests                                  |
| `prestige-change`                           | **Usable** — Rewrite rules + prestige docs (+ migrate if needed)                    |
| `create-release`                            | **Deferred** — do not ship while roadmap forbids Releases/tags                      |

Entrypoints: `.cursor/skills/*/SKILL.md`, `.cursor/commands/*.md`, `.cursor/check-quality-reference.md`.

Slash commands: `/create-issue`, `/implement-issue`, `/create-pr`, `/check-quality`, `/verify`, `/review`, `/audit`.

## Self-heal

If a skill or doc is proven stale by implementation, update the canonical doc in the same change or file a follow-up issue.
