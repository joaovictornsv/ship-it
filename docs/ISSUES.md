# Ship It — GitHub issues roadmap

Sequenced backlog so **product fantasy** and **technical foundations** grow together. Decisions live in [`PRODUCT.md`](./PRODUCT.md) and [`TECHNICAL.md`](./TECHNICAL.md); this file turns them into openable issues.

**How to use**

1. Open issues **in order**. Prefer one PR per issue; keep acceptance criteria in the issue body.
2. **Bootstrap (#1–#2):** create these without the skill (repo does not exist yet / skill does not exist yet).
3. **From #3 onward:** create each GitHub issue with the **`create-issue` skill** shipped in #2, using this file as the source (title, why now, scope, acceptance criteria, depends on, module docs). Do not invent labels.
4. Exact costs / prestige `K` / % values are **playtest-tuned** — not separate product issues.
5. Do not reopen locked product/tech decisions; file bugs/follow-ups instead.
6. Ship via PRs and staging only. Do not add GitHub Releases, git tags, or a `release` skill while this roadmap is in progress.

## Suggested labels

Use only these (plus GitHub defaults when truly needed). Do not invent new labels in `create-issue`.

| Label          | Use                                  |
| -------------- | ------------------------------------ |
| `phase:mvp`    | MVP playable loop (#2–#8)            |
| `phase:v1`     | Beyond MVP toward v1 (#9–#13)        |
| `area:economy` | Tokens, upgrades, formulas           |
| `area:scene`   | Living office / LOD / rooms          |
| `area:save`    | Autosave / export / migrate          |
| `area:deploy`  | Dockerfile / Quave / CI deploy       |
| `area:agents`  | Cursor skills / delivery loop        |
| `type:feature` | New player-facing or tech capability |

---

## Evolution overview

```text
Empty GitHub repo
  → Scaffold SPA + create-issue skill (and other agent stubs)
  → [create remaining issues via create-issue]
  → Click Ship It (tokens)
  → Buy Espresso machine (tokens/s)
  → Trust save (autosave + export)
  → Shop + early ladder (incl. Dev)
  → Living office (visible Devs + LOD)
  → Mobile shop + leaner scene
  → Rewrite prestige
  → Contributor skins + attribution
  → Unlockable rooms
  → Quave staging URL
  → Harden agent delivery loop
```

Each step below pairs a **player-facing beat** with the **technical contract** that makes it durable.

---

## Issues (open in order)

### 1. Create empty GitHub repository

**Why now:** Local work needs a remote home before scaffold, CI, and issues live anywhere durable. Start empty so the first meaningful commit can be docs + scaffold without fighting a GitHub template tree.

**Scope**

- Create GitHub repo named **`ship-it`** (owner as appropriate; public or private per preference).
- **Initially empty** — no README, no `.gitignore`, no license from the GitHub “create repository” template.
- Add remote to the local repo and document clone/push URL when done.
- Do **not** push app scaffold in this issue; push only after issue 2 (or a tiny docs-only first commit if desired).

**Acceptance criteria**

| Product                                                                                   | Technical                                                                             |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Game identity is reserved as the GitHub slug `ship-it` (matches package / PRODUCT naming) | Empty remote exists; `git remote -v` points at it; no template files forced by GitHub |
| —                                                                                         | Local git can push when ready; Issues available for this roadmap                      |

**Depends on:** —  
**Module docs:** —

**Create how:** manually (`gh repo create` or GitHub UI). No skill yet.

---

### 2. Scaffold Ship It SPA

**Why now:** Need a typed Vite app and quality gates before any game loop. Agent skills land here so the rest of the roadmap can be filed and executed with the delivery loop.

**Scope**

- Vite + React 19 + TypeScript (strict) + Tailwind + pnpm; Node **24** in CI; `engines` may suggest `>=24`.
- ESLint, Prettier, Lefthook (pre-commit: format, lint, **typecheck**), Vitest wired.
- CI workflow: install (frozen lockfile), lint, typecheck, test, build.
- Dockerfile / `httpd.conf` stubs for static SPA (deploy wired later).
- README titled **Ship It**; `AGENTS.md`; `REVIEW.md`; `.cursor/rules/` + skill/command stubs; empty `docs/modules/*`.
- **Ship a usable `create-issue` skill** (not a dead stub): enough to open roadmap issues from this file with title, body (why / scope / acceptance / depends / module docs), and no label invention.
- Other delivery skills may remain thin stubs (`implement-issue`, `create-pr`, `check-quality`, …) until #13 hardens them.
- App shell renders (placeholder layout OK); HTML `<title>` = `Ship It`.

**Acceptance criteria**

| Product                                                          | Technical                                                                                                                       |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Opening the app shows a blank/chrome shell clearly named Ship It | `pnpm dev` / `build` / `lint` / `typecheck` / `test` work; CI green on PR/`main`                                                |
| English-only UI copy convention documented                       | Layout matches TECHNICAL suggested tree (features/, game/, data/, …); module doc stubs exist                                    |
| —                                                                | `create-issue` can create the next roadmap issue (#3) from `docs/ISSUES.md` without hand-writing `gh issue create` from scratch |

**Depends on:** #1  
**Module docs:** stub all of TECHNICAL §5.2

**Create how:** manually (or any one-off `gh issue create`). After this lands, **stop creating issues by hand**.

**After merge:** use `create-issue` to open **#3–#13** (and deferred items when wanted) from this roadmap, one at a time or in a batch — still respecting depends-on order for _implementation_.

---

### 3. Core click: Ship It → tokens

**Why now:** First fantasy beat — one primary action on first paint.

**Scope**

- Dominant **Ship It** button; click earns **tokens**; floating `+N` feedback.
- Tokens bank in header (or equivalent); Zustand store + shared types.
- **No audio.** Brief ship animation OK (respect reduced-motion later if easy).

**Acceptance criteria**

| Product                                     | Technical                                                                 |
| ------------------------------------------- | ------------------------------------------------------------------------- |
| First 30s path starts: click → tokens go up | Click path is typed; state lives in Zustand; no localStorage yet required |
| Button dominates first paint                | `click` feature module under `src/features/click/`                        |

**Depends on:** #2  
**Module docs:** start `economy.md` (click power / bank)

**Create how:** `create-issue` skill (after #2).

---

### 4. First producer: Espresso machine + tokens/s tick

**Why now:** Prove “buy → tokens/s moves” before a full shop. Espresso machine is the locked early producer (not a click-power building).

**Scope**

- Buy **Espresso machine** with tokens; Cookie-style rising cost for owned count.
- Passive **tokens/s** tick while tab open; **no offline accrual**.
- Minimal buy UI (even a single row) is enough; full shop rail comes later.
- Unit tests for cost curve and tokens/s total; injectable clock for tick logic.

**Acceptance criteria**

| Product                                                   | Technical                                                             |
| --------------------------------------------------------- | --------------------------------------------------------------------- |
| Buy machine → tokens/s increases and bank grows over time | Pure functions in `economy.ts`; Vitest covers cost + production       |
| Espresso copy reads naturally in tokens                   | `upgrades.md` documents upgrade ID + role; no offline grant on resume |

**Depends on:** #3  
**Module docs:** `economy.md`, `upgrades.md`

**Create how:** `create-issue` skill.

---

### 5. Trust the run: autosave, checksum, export/import

**Why now:** Success criterion #3 — reload restores progress; player trusts the save.

**Scope**

- Versioned `SaveFile`; debounced autosave + save on `visibilitychange` / `pagehide`.
- SHA-256 checksum over canonical state JSON; persist/export as **base64**.
- Checksum mismatch: **load anyway** + clear UI warning (`saveUntrusted` OK).
- Export / import (download and paste or file upload); **single save slot**.
- Soft plausibility checks optional; do not block play.

**Acceptance criteria**

| Product                                                            | Technical                                                                         |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| Reload restores tokens / owned upgrades; export/import round-trips | Migrations hook ready (`v`); `saves.md` + `security.md` describe deterrence model |
| Tampered save warns but still plays                                | Vitest: checksum round-trip, mismatch path, parse/export                          |

**Depends on:** #4  
**Module docs:** `saves.md`, `security.md`

**Create how:** `create-issue` skill.

---

### 6. Shop rail + early upgrade ladder (incl. Dev)

**Why now:** Meaningful choices in the first 10 minutes; Devs are the flagship producer line.

**Scope**

- Right-rail shop on desktop: icon, name, joke blurb, owned count, cost, buy.
- **3–5** buyable upgrades with Cookie-style costs, including Espresso machine + **Dev**.
- Common number formatting (K, M, B — no scientific notation in main UI).
- Free-license icons for shop rows / chrome.
- Catalog in `src/data/upgrades.ts`; scene hooks can be stubs until #7.

**Acceptance criteria**

| Product                                                | Technical                                                      |
| ------------------------------------------------------ | -------------------------------------------------------------- |
| Shop has meaningful early choices; humor in one-liners | Upgrade IDs stable; economy tests cover multi-upgrade tokens/s |
| Rate label is **tokens/s**                             | `shop.md` + `upgrades.md` updated; formatting helper tested    |

**Depends on:** #5  
**Module docs:** `shop.md`, `upgrades.md`, `economy.md`

**Create how:** `create-issue` skill.

---

### 7. Living office: visible Devs + LOD

**Why now:** Cookie Clicker presence — numbers alone are not enough. Critical MVP fantasy.

**Scope**

- Shared DOM+CSS scene; buying a Dev spawns a visible character.
- Cap rendered sprites (~24–48) + `×N` badge / LOD at high counts.
- Sparse empty office → denser as owned count grows (buildings/props for non-Dev can be minimal).
- Prefer light CSS motion; respect `prefers-reduced-motion`.

**Acceptance criteria**

| Product                                                               | Technical                                            |
| --------------------------------------------------------------------- | ---------------------------------------------------- |
| Buy Dev → see a Dev appear; scene readable at 0 / 10 / 100+ (via LOD) | Scene feature under `src/features/scene/`; no Canvas |
| First 30s path complete: click → buy → tokens/s **and** presence      | `scene.md` documents LOD rules                       |

**Depends on:** #6  
**Module docs:** `scene.md`

**Create how:** `create-issue` skill.

---

### 8. Responsive shop + mobile scene lean

**Why now:** Portfolio + friends will open on phones; MVP requires drawer shop + large tap target.

**Scope**

- Desktop: shop right rail; mobile: bottom sheet / drawer.
- Large Ship It tap target; fewer scene sprites on small viewports.
- Layout still one primary action on first paint.

**Acceptance criteria**

| Product                                                       | Technical                                        |
| ------------------------------------------------------------- | ------------------------------------------------ |
| Playable on phone: buy from drawer, click Ship It comfortably | Breakpoints documented in `shop.md` / `scene.md` |
| Scene does not melt mobile performance                        | Mobile sprite budget explicit in `scene.md`      |

**Depends on:** #7  
**Module docs:** `shop.md`, `scene.md`

**Create how:** `create-issue` skill.

---

### 9. Rewrite prestige + Rewrites shop

**Why now:** Soft-reset joke + power spike; v1 differentiator after the core loop feels good.

**Scope**

- Track **tokens earned this run** (not bank); unlock Rewrite when projected gain ≥ 1 Rewrite.
- `rewritesGained = floor(sqrt(tokensEarnedThisRun / K))` (`K` tunable).
- Soft reset: clear token bank + owned upgrades + run tokens/s; **keep** Rewrites bank, prestige upgrades, cosmetics, **rooms** (when rooms exist).
- Banked Rewrites grant passive tokens/s mult; small shop: **Postmortem**, **Muscle memory**, **Stub repo**.
- Confirm dialog: tokens lost vs Rewrites gained + new power.
- Save migration if schema needs prestige fields.

**Acceptance criteria**

| Product                                                                                   | Technical                                             |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| First Rewrite feels like a joke _and_ a power spike (~20–40 min target for first Rewrite) | Prestige pure helpers + tests; `prestige.md` complete |
| Prestige currency never buys normal shop rows                                             | Migration tested if `v` bumps                         |

**Depends on:** #8 (MVP loop solid first)  
**Module docs:** `prestige.md`, `economy.md`, `saves.md`

**Create how:** `create-issue` skill.

---

### 10. Contributor skins pipeline

**Why now:** Emotional center — someone who knows the repo smiles when they spot a skin.

**Scope**

- Static JSON/assets under `public/contributors/` (+ `src/data/contributors.ts`).
- Opt-in pool; fallback generic skins; Dependabot-style bots OK as joke skins.
- Avatars as-is for v1; hover shows contributor name; attribution page/UI.
- Optional `pnpm generate:contributors` script.

**Acceptance criteria**

| Product                                                             | Technical                                                                     |
| ------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Office can show contributor skins; hover names; attribution visible | Static-only pipeline; no private API keys; `contributors.md` + security notes |
| Missing/unavailable → fallback skins always work                    | Fallback path tested or manually verified                                     |

**Depends on:** #7 (scene), ideally #9 not strictly required  
**Module docs:** `contributors.md`, `security.md`, `scene.md`

**Create how:** `create-issue` skill.

---

### 11. Unlockable rooms

**Why now:** Empty → busy office fantasy; rooms **kept** after Rewrite (losing the map feels punishing).

**Scope**

- Unlock rooms over progression (office → later spaces as designed).
- Wire keep-list with Rewrite reset rules.
- Scene densifies with props/buildings for non-Dev upgrades as the ladder expands.

**Acceptance criteria**

| Product                                                                  | Technical                                                       |
| ------------------------------------------------------------------------ | --------------------------------------------------------------- |
| Scene looks different at minute 1 vs later; rooms persist across Rewrite | Unlock rules in data + scene; prestige keep-list includes rooms |
| Map remains readable                                                     | `scene.md` + `prestige.md` updated                              |

**Depends on:** #7, #9  
**Module docs:** `scene.md`, `prestige.md`, `upgrades.md`

**Create how:** `create-issue` skill.

---

### 12. Quave Cloud staging deploy

**Why now:** Shareable URL for portfolio/friends; TECHNICAL deploy pattern locked.

**Scope**

- Production `pnpm build` → `dist/`; Dockerfile (`lipanski/docker-static-website` style) + SPA `httpd.conf`.
- GitHub Action with `zcloud-ws/zcloud-deploy-action@main` + `secrets.QUAVE_CLOUD_ENV_TOKEN`.
- Target env: **`joaovictornsv-ship-it-staging`**; no custom domain; no Quave production yet.
- Vite `base` = `/`.

**Acceptance criteria**

| Product                                                         | Technical                                                         |
| --------------------------------------------------------------- | ----------------------------------------------------------------- |
| Staging URL loads Ship It and the loop works in a clean browser | Deploy workflow green; env name matches PRODUCT/TECHNICAL         |
| —                                                               | No secrets in client; README documents staging URL when available |

**Depends on:** #2 (Dockerfile stub), preferably playable MVP (#8+)  
**Module docs:** mention in TECHNICAL / README (no dedicated module)

**Create how:** `create-issue` skill.

---

### 13. Agent delivery loop hardening

**Why now:** Scaffold shipped a usable `create-issue` plus thin stubs; harden the issue→implement→PR loop against real workflow.

**Scope**

- Flesh skills: `implement-issue`, `create-pr`, `update-docs`, `write-tests`, `check-quality` (+ verify/review/audit tiers); deepen `create-issue` if gaps showed up.
- Domain skills as needed: `add-upgrade`, `save-migrate`, `balance-pass`, `prestige-change`.
- Shared `.cursor/check-quality-reference.md`; self-heal rule: fix stale docs in the same change or file a follow-up.

**Acceptance criteria**

| Product                                                                     | Technical                                                                                                 |
| --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Faster, consistent delivery of remaining polish without reinventing process | Skills/commands cover issue→PR quality gates; a dry-run of issue→PR documented or proven on a small chore |
| —                                                                           | `AGENTS.md` points at the real entrypoints                                                                |

**Depends on:** #2; best after a few real PRs (#3–#8)  
**Module docs:** update `AGENTS.md` / skill docs as needed

**Create how:** `create-issue` skill.

---

## Deferred / wishlist (do not block v1)

File with `create-issue` when ready. Product detail in PRODUCT §8 Later.

| Idea                                       | Notes                                                 |
| ------------------------------------------ | ----------------------------------------------------- |
| Light motion polish pass                   | v1 polish; still **no audio** until sound toggle      |
| Balance playtest pass                      | Tune `K`, costs, prestige %; use `balance-pass` skill |
| Dev tier super-upgrade                     | Promote whole owned stack in place                    |
| Custom pixel art                           | Replace stock icons where it matters                  |
| Achievements / incidents / SEV mini-events | Narrative/events later                                |
| Seasonal skins / hackathon modes           | Cosmetics                                             |
| Offline progress                           | Explicitly deferred                                   |
| Sound toggle                               | Post-MVP audio                                        |
| Accessibility pass                         | Reduce motion (beyond baseline), keyboard shop        |
| Leaderboard / localization                 | Out of scope (client-only; English only)              |

---

## Mapping to docs

| Roadmap issues               | PRODUCT          | TECHNICAL                  |
| ---------------------------- | ---------------- | -------------------------- |
| #1 Bootstrap                 | Naming / slug    | Remote for CI/deploy later |
| #2 Scaffold + `create-issue` | —                | Phase 1 + agent stubs (§5) |
| #3–#8                        | MVP checklist §8 | Phases 2–4 + save §3       |
| #9–#11                       | v1 checklist §8  | Phases 5–6                 |
| #12                          | Staging env name | Phase 7 deploy             |
| #13                          | —                | Phase 8 agent hardening    |

---

_Last updated: 2026-07-26 — living document; open issues on GitHub when ready._
