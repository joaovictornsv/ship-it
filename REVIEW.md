# REVIEW.md — Ship It

Lightweight coding and review standards. Grow when pain appears.

## Must

- TypeScript **strict**; no `any` without a one-line justification comment.
- UI copy **English only**.
- Pure economy / save helpers stay free of React / DOM.
- Module docs updated when contracts change (`docs/modules/`).
- New formulas / migrations get Vitest coverage.

## Prefer

- Small PRs aligned to one `docs/ISSUES.md` item.
- Named exports for components and pure helpers.
- Clear acceptance criteria checked off in the issue / PR.

## Avoid

- Premature Canvas / WebGL for the scene.
- Offline accrual while the tab is closed (v1).
- New dependencies without a PRODUCT/TECHNICAL need.
- Inventing labels, release tags, or product decisions in PRs.

## Checklist (human or agent)

1. `pnpm lint` / `typecheck` / `test` / `build` green
2. Related module doc touched if behavior changed
3. No secrets in client or CI logs
4. Issue linked; acceptance criteria addressed
