# Technical requirements & scaffold

Working document for stack, architecture, tooling, and DevOps for **Ship It** (`ship-it`). **Technical stack is locked.** Product identity and economy live in [`PRODUCT.md`](./PRODUCT.md).

| Field               | Value                           |
| ------------------- | ------------------------------- |
| Game                | **Ship It**                     |
| Slug / package lean | `ship-it`                       |
| Quave staging env   | `joaovictornsv-ship-it-staging` |
| Currency (product)  | Tokens (`tokens/s`)             |

## 1. Goals

- Build a **browser-only** developer-themed clicker (SPA).
- Persist progress **locally** with integrity checks (tamper-resistant, not cryptographically secure).
- Keep the codebase small, typed, and easy for agents/humans to extend.
- Ship with basic quality gates (lint, format, typecheck, hooks, CI).
- Deploy to **Quave Cloud** (same pattern as other personal apps: `zcloud-ws/zcloud-deploy-action`).
- Be **agent-pragmatic**: skills + commands + module docs for the full delivery loop (issues → impl → tests → quality checks → PR → release → docs), inspired by CommitSwimming + cards-cli/books-cli.

### Non-goals (v1)

- Multiplayer / real-time sync
- Server-authoritative anti-cheat / leaderboards
- Native apps / offline PWA as a hard requirement
- Monetization / ads
- E2E (Playwright) — unit tests only for v1
- Offline tokens/s while the tab is closed
- Custom domain (use Quave default host for now)
- Quave **production** env (staging only on Quave ONE for now)

## 2. Stack (decided)

| Layer           | Choice                                                     | Notes                                                                                                     |
| --------------- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Runtime         | Browser SPA                                                | No SSR                                                                                                    |
| Language        | **TypeScript** (strict)                                    | Shared types for game state + save format                                                                 |
| Build           | **Vite**                                                   | Static `dist/` for Quave                                                                                  |
| UI              | **React 19**                                               | Shop + scene as components                                                                                |
| State           | **Zustand**                                                | Tick loop + upgrades                                                                                      |
| Styling         | **Tailwind CSS**                                           | Utility-first UI                                                                                          |
| Scene           | **DOM + CSS** (React)                                      | See [§2.1](#21-scene-tech-decision)                                                                       |
| Persistence     | `localStorage` + versioned save + **SHA-256** + **base64** | Export/import in MVP                                                                                      |
| Package manager | **pnpm**                                                   | Lockfile required                                                                                         |
| Node (CI)       | **24**                                                     | No hard local `.nvmrc` pin; `engines` may suggest `>=24`                                                  |
| Hooks           | **Lefthook**                                               | pre-commit: format, lint, **typecheck**                                                                   |
| Tests           | **Vitest** (unit only for v1)                              | Economy + save + migrations                                                                               |
| Docs / UI copy  | **English only**                                           |                                                                                                           |
| Deploy          | **Quave Cloud**                                            | Static Dockerfile; staging env **`joaovictornsv-ship-it-staging`**; no Quave production; no custom domain |
| Repo shape      | **Single package** for v1                                  | See [§2.2](#22-monorepo-vs-single-package)                                                                |

### 2.1 Scene tech decision

**Choice: DOM + CSS (React components), not Canvas/WebGL.**

| Option        | Fit for this game                                                                                         |
| ------------- | --------------------------------------------------------------------------------------------------------- |
| **DOM + CSS** | Best match: Cookie Clicker–like crowds, Tailwind, hover/tooltips on contributor skins, easy accessibility |
| SVG           | Good for icons/props; awkward as the only scene for dozens of characters                                  |
| Canvas        | Better for hundreds/thousands of particles; worse DX with React/Tailwind; harder hit-testing/a11y         |

**Rules of thumb:**

- Spawn Dev (and other) entities as light DOM nodes (or CSS sprites).
- **LOD / cap**: render at most N characters (e.g. 24–48); above that show a count badge (`×137`) so the scene stays smooth.
- Use CSS transforms/animations sparingly; respect `prefers-reduced-motion`.

Revisit Canvas only if profiling shows DOM cannot handle the desired density.

### 2.2 Monorepo vs single package

|            | **Single package** (chosen for v1)                                | **Monorepo**                                                            |
| ---------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------- |
| What it is | One `package.json`, one app                                       | Multiple packages in one git repo (e.g. `apps/web`, `packages/economy`) |
| Pros       | Simple scripts, simple CI, simple Quave deploy                    | Shared code/versioning across apps/tools; clearer boundaries later      |
| Cons       | Sharing code with a future second app means copy or extract later | More tooling (pnpm workspaces, path aliases, longer CI)                 |

**Decision:** stay **single package** until there is a real second consumer (e.g. a balance CLI or admin tool). Extract a workspace then — not before.

### Suggested app layout

```text
clicker-game/   # repo folder; npm package / title: ship-it / "Ship It"
├── docs/
│   ├── TECHNICAL.md              # this file
│   ├── PRODUCT.md                # theme, features, economy decisions
│   ├── modules/                  # living module docs (see §5.2)
│   │   ├── economy.md
│   │   ├── upgrades.md
│   │   ├── saves.md
│   │   ├── security.md
│   │   ├── scene.md
│   │   ├── shop.md
│   │   ├── prestige.md
│   │   └── contributors.md
│   └── adr/                      # optional short architecture decisions
├── public/
│   └── contributors/
├── src/
│   ├── app/
│   ├── features/
│   │   ├── click/
│   │   ├── shop/
│   │   ├── scene/
│   │   └── save/
│   ├── game/
│   │   ├── state.ts
│   │   ├── tick.ts
│   │   ├── economy.ts
│   │   └── types.ts
│   ├── data/
│   │   ├── upgrades.ts
│   │   └── contributors.ts
│   ├── styles/
│   └── main.tsx
├── scripts/
├── .github/workflows/
│   ├── ci.yml
│   └── deploy.yml
├── .cursor/
│   ├── rules/
│   ├── commands/                 # slash-style quality / flow entrypoints
│   ├── skills/                   # CommitSwimming-style delivery skills
│   └── check-quality-reference.md
├── Dockerfile                    # lipanski/docker-static-website (blog-html style)
├── httpd.conf                    # SPA fallback → index.html if needed
├── lefthook.yml
├── AGENTS.md
├── REVIEW.md                     # coding/review standards (lightweight)
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── vite.config.ts
└── README.md
```

**Vite `base`:** `/` (default). No custom domain for now — Quave default hostname is enough.

## 3. Game / save architecture

### In-memory state (canonical)

- Currency (**tokens**), upgrade owned counts, prestige (**Rewrites**), timestamps (`lastTickAt`, `totalPlayMs`), settings.
- Production derived from owned upgrades + modifiers (pure functions in `economy.ts`); UI rate = **tokens/s**.
- **No offline accrual** while the tab is closed (v1): on resume, update `lastTickAt` without granting away-time tokens/s.

### Persistence contract

```ts
type SaveFile = {
  v: number; // schema version
  savedAt: number; // epoch ms
  state: GameState; // versioned shape
  checksum: string; // integrity over canonical payload
};
```

### Requirements

1. **Debounced autosave** (e.g. 1–2s after change) + save on `visibilitychange` / `pagehide`.
2. **Schema versioning** with explicit migrations (`v1 → v2`); support renames / split upgrade IDs via migrators.
3. **SHA-256 checksum** on load over canonical `state` JSON (stable key order) via Web Crypto — see [§3.1](#31-checksum--obfuscation-decided).
4. **Checksum mismatch:** still **load the state** (“load anyway”), but surface a clear warning in UI (and optionally mark `saveUntrusted: true`).
5. **Base64-wrap** the persisted / exported blob (decode → parse → verify checksum on load).
6. **Plausibility checks** (soft): optional warnings; do not block play in v1.
7. **Export / import** of the save blob in **MVP** (download / paste or file upload).
8. **Single save slot** only (no multi-slot UI).

### 3.1 Checksum & obfuscation (decided)

| Concern             | Decision                                                                 |
| ------------------- | ------------------------------------------------------------------------ |
| Integrity           | **SHA-256** of canonical `state` JSON                                    |
| Wire/storage format | Full `SaveFile` JSON → **base64** string in `localStorage` / export file |
| Failed checksum     | Load anyway + warn                                                       |
| Not used            | HMAC, compression                                                        |

Deterrence only — not anti-cheat. HMAC / compress can be revisited later if needed.

## 4. Quality & DevOps

### Local scripts (expected)

| Script                    | Purpose                                       |
| ------------------------- | --------------------------------------------- |
| `dev`                     | Vite dev server                               |
| `build`                   | `tsc --noEmit` + production build             |
| `preview`                 | Preview production build                      |
| `lint`                    | ESLint                                        |
| `format` / `format:check` | Prettier                                      |
| `typecheck`               | TypeScript only                               |
| `test`                    | Vitest unit tests                             |
| `generate:contributors`   | Optional: bake static contributor JSON/assets |

### Lefthook

- **pre-commit:** format + lint on staged files **and typecheck**
- **No commitlint** / conventional-commit enforcement

### CI (GitHub Actions)

On PR + `main`:

1. Checkout + setup pnpm + **Node 24**
2. `pnpm install --frozen-lockfile`
3. Lint
4. Typecheck
5. Unit tests
6. Production build

### Deploy (Quave Cloud)

1. Build `pnpm build` → `dist/`.
2. **Dockerfile:** `lipanski/docker-static-website` (or equivalent) serving `dist/` + `httpd.conf` SPA fallback — same idea as `blog-html`.
3. Deploy via `zcloud-ws/zcloud-deploy-action@main` with `secrets.QUAVE_CLOUD_ENV_TOKEN`.
4. Quave env name: **`joaovictornsv-ship-it-staging`** (locked with game name in [PRODUCT.md](./PRODUCT.md)).
5. **No custom domain** for v1.
6. **No Quave production env for now** — only staging on Quave ONE; promote to production later when ready.

### Environments

| Env                   | Where                          | Notes                                           |
| --------------------- | ------------------------------ | ----------------------------------------------- |
| `development` / local | Developer machine (`pnpm dev`) | Vite; not on Quave                              |
| `staging`             | Quave ONE                      | Only hosted env for now; default Quave hostname |
| `production`          | —                              | **Out of scope for now** (add Quave prod later) |

## 5. Agent / Cursor setup (CommitSwimming-inspired)

Be pragmatic: **skills for the whole delivery loop**, not only game-domain tasks. Pattern mix:

- **CommitSwimming:** `create-issue`, `create-pr`, `implement-issue`, multi-tier **check-quality** commands + reference
- **cards-cli / books-cli:** thin always-on rules + focused `SKILL.md` (+ `reference.md` / `examples.md` when useful)

### 5.1 Core files

| Path                                    | Purpose                                                                       |
| --------------------------------------- | ----------------------------------------------------------------------------- |
| `AGENTS.md`                             | How to run, architecture map, do/don’t, pointers to module docs               |
| `REVIEW.md`                             | Coding/review standards (short; grow as pain appears)                         |
| `.cursor/rules/`                        | Always-on routing (stack, English copy, economy purity, “update module docs”) |
| `.cursor/skills/`                       | Delivery + domain skills (below)                                              |
| `.cursor/commands/`                     | Slash entrypoints that point at skills / quality tiers                        |
| `.cursor/check-quality-reference.md`    | Shared scope, report template, fast-path skips                                |
| `docs/TECHNICAL.md` / `docs/PRODUCT.md` | Product/tech decisions                                                        |
| `docs/modules/*.md`                     | Per-module source of truth                                                    |

### 5.2 Module docs (required)

Each major game area gets a living doc. Skills that touch that area **must** read and update it.

| Doc                            | Owns                                                              |
| ------------------------------ | ----------------------------------------------------------------- |
| `docs/modules/economy.md`      | Formulas, cost curves, tokens/s, click power, number formatting   |
| `docs/modules/upgrades.md`     | Upgrade IDs (Dev, Espresso machine, …), tiers, copy, shop ↔ scene |
| `docs/modules/saves.md`        | Save schema, migrations, export/import, checksum/base64           |
| `docs/modules/security.md`     | Threat model (browser), deterrence limits, contributor data rules |
| `docs/modules/scene.md`        | DOM scene, LOD caps, rooms, animation / reduced-motion            |
| `docs/modules/shop.md`         | Shop UX (right rail + mobile drawer), buy affordances             |
| `docs/modules/prestige.md`     | **Rewrite** soft reset, Rewrites currency, what resets vs keeps   |
| `docs/modules/contributors.md` | Static skin pipeline, opt-in, fallbacks, attribution              |

Stub these during scaffold; fill as the module lands. Prefer updating the module doc in the same PR as behavior changes.

### 5.3 Skills catalog (plan)

Ship skills early (scaffold / first issues), then deepen them. Adapt CommitSwimming flows to this single-package SPA (no Meteor boards; simpler project routing).

#### Delivery / process

| Skill             | Use when                                                                             |
| ----------------- | ------------------------------------------------------------------------------------ |
| `create-issue`    | Create/update GitHub issues for phases and bugs (labels, templates)                  |
| `implement-issue` | Implement an issue: execution checklist in issue body → item-by-item proof → PR link |
| `create-pr`       | Open PRs after check-quality; structured body + agent/human test plans               |
| `create-release`  | Version bump, changelog, GitHub release, tag; never invent secrets                   |
| `update-docs`     | Sync TECHNICAL/PRODUCT/module docs / AGENTS/REVIEW when decisions or APIs change     |
| `write-tests`     | Add/extend Vitest coverage for economy, saves, migrations, pure helpers              |
| `check-quality`   | Full pre-ship pipeline (orchestrator)                                                |

#### Check-quality tiers (commands + shared reference)

Mirror CommitSwimming’s split:

| Command / tier  | Focus                                                                        |
| --------------- | ---------------------------------------------------------------------------- |
| `check-quality` | Full pipeline before PR                                                      |
| `verify`        | `pnpm test`, lint, typecheck, build                                          |
| `review`        | REVIEW.md / AGENTS patterns, dead code, naming, module-doc drift             |
| `audit`         | Security (save tamper assumptions, no secrets) + perf (scene LOD, tick cost) |

#### Game-domain

| Skill             | Use when                                                        |
| ----------------- | --------------------------------------------------------------- |
| `add-upgrade`     | New upgrade definition + shop + scene hook + module doc + tests |
| `save-migrate`    | Bump save `v`, migrator, tests, `saves.md`                      |
| `balance-pass`    | Adjust costs/CPS with checklist + economy doc + tests           |
| `prestige-change` | Soft-reset rule changes + prestige doc + migration if needed    |

**Self-heal rule (from CommitSwimming):** if implementation proves a skill/doc stale, update the canonical doc in the same change or file a follow-up issue — do not leave agents lying.

### 5.4 Issue → PR loop (expected)

1. `create-issue` — file work with clear acceptance criteria
2. `implement-issue` — append `## Execution checklist`, implement item-by-item with proof
3. `write-tests` + focused `verify` as you go
4. Full `check-quality` before PR
5. `create-pr` — open PR, link back on the issue
6. `update-docs` when behavior/contracts change
7. `create-release` when shipping a versioned milestone

## 6. Testing strategy (v1)

- **Unit only (Vitest):** cost curves, CPS totals, checksum round-trip, migrations, export/import parse.
- Inject a clock for any time-based logic.
- **No Playwright** in v1.
- Prefer the `write-tests` skill over ad-hoc untested formulas.

## 7. Security & privacy

- Checksum ± obfuscation = **deterrence**, not security (details in `docs/modules/security.md`).
- No private API keys in the client.
- Contributor data: **static**, public avatars/metadata only; attribution page; fallback generic skins always available.
- Client-only: no leaderboards backend.
- No PII collection in v1.

## 8. Open questions

### Resolved (technical + identity + prestige design)

- [x] Game name / slug / npm / `<title>` / Quave staging → **Ship It** / `ship-it` / `Ship It` / `joaovictornsv-ship-it-staging`
- [x] Currency → tokens / tokens/s; prestige → Rewrite / Rewrites (see PRODUCT §7)
- [x] Rewrite unlock → ≥1 Rewrite from `floor(sqrt(tokensEarnedThisRun / K))`; rooms **kept**
- [x] Rewrites → banked tokens/s mult + shop: Postmortem / Muscle memory / Stub repo
- [x] Espresso machine → small tokens/s producer
- [x] Styling: **Tailwind**
- [x] Scene: **DOM + CSS**
- [x] Offline progress: **none** in v1
- [x] Export/import: **MVP**
- [x] Prestige: **yes** (v1)
- [x] Package manager: **pnpm**
- [x] Hooks: **Lefthook** + typecheck on **pre-commit**
- [x] Commitlint: **no**
- [x] CI Node: **24** (no hard local pin)
- [x] Tests: **Vitest unit only** for v1
- [x] Deploy: **Quave Cloud** — **local + staging only** (no Quave production yet)
- [x] Static Dockerfile: **yes** (`lipanski/docker-static-website` style)
- [x] Custom domain: **no** for now; Vite `base` = `/`
- [x] Repo shape: **single package**
- [x] Checksum: **SHA-256** + **base64**
- [x] Checksum failure: **load anyway** + warn
- [x] Migrations for renames/split IDs: **yes**
- [x] Contributors: **static** + fallbacks
- [x] Backend/leaderboards: **client-only**
- [x] Agents: **AGENTS.md + rules + skills + check-quality + module docs** (CommitSwimming + CLI pattern)
- [x] Language: **English only**

_(Exact `K` and % values are balance constants — tune in playtests, not product open questions.)_

## 9. Implementation phases (→ GitHub issues next)

Product + technical decisions are locked. Next: scaffold and issues.

1. **Scaffold** — Vite + React + TS + Tailwind + pnpm, ESLint/Prettier, Lefthook, Vitest, CI (Node 24), Dockerfile stubs, README titled Ship It, `AGENTS.md`, `REVIEW.md`, Cursor rules, **skill/command stubs**, empty `docs/modules/*`
2. **Core loop + save** — Ship It click, tokens, one upgrade, tokens/s tick, autosave + SHA-256 + base64 + export/import + `saves.md` / `security.md`
3. **Shop + economy** — multiple upgrades (Espresso machine, Dev, …), cost curves, tests + module docs
4. **Scene** — DOM Devs/buildings + LOD + rooms + `scene.md`
5. **Prestige (Rewrite)** — soft reset + Rewrites bank/shop per PRODUCT §7 + `prestige.md` + migration if needed
6. **Contributor skins** — static pipeline + `contributors.md`
7. **Quave staging deploy** — Dockerfile + deploy workflow → `joaovictornsv-ship-it-staging`
8. **Agent hardening** — flesh out create-issue / implement-issue / create-pr / create-release / check-quality against real workflow

Ready to open GitHub issues for these phases when you ask.

---

_Last updated: 2026-07-26 — living document._
