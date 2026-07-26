---
name: create-issue
description: >-
  Create or update GitHub issues for Ship It from docs/ISSUES.md (roadmap) or
  bugs/follow-ups. Use when filing the next roadmap issue, opening a bug, or
  the user asks to create/update a GitHub issue. Do not invent labels.
---

# create-issue

Open GitHub issues for **Ship It** with a consistent body and **only** allowed labels.

## Before creating

1. Confirm repo remote: `joaovictornsv/ship-it` (or `gh repo view --json nameWithOwner`).
2. Read [`docs/ISSUES.md`](../../../docs/ISSUES.md) for roadmap items and **Suggested labels**.
3. Check existing issues so you do not duplicate: `gh issue list --state all --limit 50`.

## Allowed labels (do not invent)

From `docs/ISSUES.md`:

- `phase:mvp`, `phase:v1`
- `area:economy`, `area:scene`, `area:save`, `area:deploy`, `area:agents`
- `type:feature`

GitHub defaults (`bug`, `documentation`, …) only when they truly fit (e.g. a real bug). Prefer `type:feature` for roadmap work.

## Roadmap issues from `docs/ISSUES.md`

For a numbered section (e.g. **### 3. Core click…**):

1. Use the section **title** as the issue title (strip the leading number if present; keep the human title).
2. Body **must** include these headings (markdown):

```markdown
## Why now

<from Why now>

## Scope

<from Scope — keep bullets>

## Acceptance criteria

<copy the Product | Technical table>

## Depends on

<from Depends on — link GitHub issue numbers when they exist, e.g. #2>

## Module docs

<from Module docs>

## Source

`docs/ISSUES.md` §N
```

3. Pick labels from the allowed list only. Suggested mapping:

| Roadmap # | Labels                                                                |
| --------- | --------------------------------------------------------------------- |
| 3–5       | `type:feature`, `phase:mvp`, `area:economy` (save → also `area:save`) |
| 6         | `type:feature`, `phase:mvp`, `area:economy`                           |
| 7–8       | `type:feature`, `phase:mvp`, `area:scene` (8 also shop UX)            |
| 9         | `type:feature`, `phase:v1`, `area:economy`                            |
| 10–11     | `type:feature`, `phase:v1`, `area:scene`                              |
| 12        | `type:feature`, `phase:v1`, `area:deploy`                             |
| 13        | `type:feature`, `phase:v1`, `area:agents`                             |

4. Create with `gh` (HEREDOC for body):

```bash
gh issue create --repo joaovictornsv/ship-it \
  --title "TITLE" \
  --label "type:feature,phase:mvp,area:economy" \
  --body "$(cat <<'EOF'
…body…
EOF
)"
```

5. Return the issue URL to the user.

Optional helper (parses one roadmap section and prints title/body hints):

```bash
pnpm roadmap:create-issue 3
# or: node --experimental-strip-types scripts/create-issue-from-roadmap.ts 3
```

If the helper is unavailable, parse `docs/ISSUES.md` manually — do not skip the body template.

## Bugs / follow-ups

- Title: short, specific.
- Body: **What**, **Expected**, **Steps / context**, **Acceptance criteria**.
- Labels: `bug` or `type:feature` + the relevant `area:*` / `phase:*`.
- Do not reopen locked PRODUCT/TECHNICAL decisions; point at a follow-up.

## Update an existing issue

```bash
gh issue edit N --repo joaovictornsv/ship-it --body "…"
# or add a comment:
gh issue comment N --repo joaovictornsv/ship-it --body "…"
```

## Do not

- Invent labels outside the allowed set.
- Open #3–#13 by hand-waving without reading `docs/ISSUES.md`.
- Create GitHub Releases / tags as part of this skill.
