---
name: update-docs
description: >-
  Sync TECHNICAL, PRODUCT, module docs, AGENTS, or REVIEW when decisions or
  APIs change. Use whenever behavior, contracts, skills, or chrome tokens
  change in the same PR.
---

# update-docs

Keep docs honest with the code in the **same change**. Prefer updating the
canonical doc over leaving agents with stale instructions.

## When to run

| Change                                            | Update                                                                               |
| ------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Game formula / cost / CPS / click / prestige math | `docs/modules/economy.md` (+ `prestige.md` when Rewrite rules move)                  |
| Producer / Ship / building / prestige catalog     | `docs/modules/upgrades.md` (+ `shop.md` / `scene.md` if UX or presence changes)      |
| Save schema, migrator, export/import, checksum    | `docs/modules/saves.md` (+ `security.md` if threat model moves)                      |
| Scene LOD, rooms, DOM presence, motion            | `docs/modules/scene.md`                                                              |
| Shop rail / drawer / buy affordances              | `docs/modules/shop.md`                                                               |
| Shell palette, type, spacing, motion tokens       | `docs/modules/ui.md` + `src/styles/index.css` together                               |
| Prestige keep/reset / Rewrites UX                 | `docs/modules/prestige.md`                                                           |
| Contributor skins / attribution                   | `docs/modules/contributors.md`                                                       |
| Achievements                                      | `docs/modules/achievements.md`                                                       |
| Agent skills / commands / delivery loop           | `AGENTS.md` (+ skill `SKILL.md` / `.cursor/check-quality-reference.md`)              |
| Locked product or tech decision (rare)            | `docs/PRODUCT.md` / `docs/TECHNICAL.md` — do **not** reopen casually; file follow-up |
| Coding standards pain                             | `REVIEW.md`                                                                          |

## Checklist

1. Identify the owning module doc(s) from the table (or `docs/TECHNICAL.md` §5.2).
2. Update the doc to match **shipped** behavior (IDs, formulas, UI copy notes, file owners).
3. If tokens / chrome change, update `ui.md` and CSS vars in the same PR.
4. If a skill or command proved stale while implementing, fix that skill in the same change (**self-heal**) or file a follow-up issue with `create-issue`.
5. Do not invent product decisions in docs — point at PRODUCT/TECHNICAL or open a follow-up.

## Self-heal rule

If implementation proves a skill, command, `AGENTS.md` row, or module doc stale: **update the canonical file in this PR** or file a follow-up issue. Do not leave agents lying.

## Proof

On the issue / PR checklist, cite paths touched (e.g. `docs/modules/shop.md`, `AGENTS.md`).
