# Product, theme & features

Working document for game fantasy, UX, and feature ideas. Technical stack lives in [`TECHNICAL.md`](./TECHNICAL.md).

## 1. Elevator pitch

A **developer-themed idle clicker**: you click to earn **tokens**, hire **Devs** and buy tools/infra, and watch your office densify — Cookie Clicker energy, software world flavor.

| Field                   | Value                                                |
| ----------------------- | ---------------------------------------------------- |
| **Game name**           | **Ship It**                                          |
| **Slug / npm package**  | `ship-it`                                            |
| **HTML `<title>`**      | `Ship It`                                            |
| **Quave env (staging)** | `joaovictornsv-ship-it-staging`                      |
| **Primary currency**    | Tokens                                               |
| **Prestige**            | Cookie-style soft reset — **Rewrite** / **Rewrites** |

## 2. Fantasy & tone

- **Tone:** playful, slightly satirical, affectionate toward software culture (coffee, PRs, incidents, rewrites).
- **Not:** mean-spirited mockery of real people; contributor “skins” should feel like a homage.
- **Fantasy spine:** you start as a solo hacker and grow into a chaotic but productive engineering org / platform — then **rewrite** and do it again, wiser (permanent mults).
- **Audience:** portfolio + friends (not itch.io / broad market first).
- **Narrative:** pure systemic humor for now (no story unlock messages). Incidents / SEV events → later.
- **Shell palette:** cool slate + **deploy teal** CTA (shipping / CI chrome), with warmer **token gold** / sky accents for game juice. Coffee stays as scene flavor (Espresso, mugs), not the shell chrome. Canonical tokens / type / spacing: [`docs/modules/ui.md`](./modules/ui.md) (`src/styles/index.css`).

### Core fantasy loop

1. Click to earn **tokens**.
2. Spend tokens on upgrades that produce tokens over time (**tokens/s**).
3. See those upgrades **appear in the world** (not only as numbers).
4. Unlock bigger systems (CI, cloud, AI agents…) and **Rewrite** (prestige) in v1.

## 3. Currency & click target

### Primary currency (locked)

**Tokens** — coin-like, spendable, cute. Shop copy reads naturally (“hire a Dev for 100 tokens”).

Rate label in UI: **tokens/s** (not abstract “CPS”, unless used as an internal synonym).

Commits / deploys / LoC stay as optional flavor or click FX only — not the bank.

### Early upgrade naming (no collision)

Currency is tokens; the early producer is **not** named “Coffee”.

| Role          | Name                 | Notes                                           |
| ------------- | -------------------- | ----------------------------------------------- |
| Currency      | Tokens               | Bank + costs                                    |
| Early upgrade | **Espresso machine** | Cheap tokens/s producer; scene = machine / mugs |

### Main click target (locked lean)

Giant **Ship It** button (matches the game name). Brief ship animation + floating `+N` tokens.

**No audio in MVP** (sound later, optional).

## 4. Cookie Clicker–style presence (critical)

Numbers alone are not enough. Owned automation should **show up on screen**, like Cookie Clicker’s grandmas, farms, temples, etc.

### Principle

> Every producer upgrade has a **visual population** or **building footprint** in a shared scene.

Examples:

| Upgrade          | Visual presence                                           |
| ---------------- | --------------------------------------------------------- |
| Espresso machine | Machine / mugs                                            |
| **Dev**          | Character walking / typing in the office (flagship crowd) |
| CI pipeline      | Conveyor / build bots                                     |
| Cloud            | Floating servers / region markers                         |
| AI agents        | Small robots opening PRs                                  |

### Layout

- **Header:** brand mark + Save affordance only (no token meta in the bar)
- **Left / center:** living **office stage**, then tokens + tokens/s HUD docked on the **Ship It** cluster
- **Middle / background:** animated atmosphere behind play; scene densifies as you buy; unlockable rooms over time (office → datacenter → …)
- **Shop:** right rail on web; bottom drawer / sheet on mobile — scan-first buy rows

Scene starts sparse (empty office) and becomes crowded / gloriously messy.

### Initial UI assets

- **MVP:** free-license icon sets (e.g. Lucide, Phosphor, Heroicons, Game-icons.net, Kenney) for shop rows and UI chrome.
- **Later:** custom pixel art for scene characters, rooms, and key props (art direction = **pixel**).

## 5. Upgrade pillar: “Devs” (grandma analog)

**Devs** are the flagship producer line — the emotional center of the game, like grandmas. **No separate Intern tier**.

### Behavior

- Buying +1 Dev increases tokens/s and **spawns one more visible character** in the scene.
- **Max rendered** sprites with LOD / `×N` badge at high counts (tech lean: 24–48).
- Devs can have **skins / variants** so the crowd feels alive.

### Tier promotion (later, post-MVP)

One Dev tier at start. Later: a **super-upgrade** that promotes the whole owned stack in place (e.g. 100 juniors → 100 mids) without re-buying — Cookie-style building upgrades / “transmute the crowd.” Exact names (Junior / Mid / Senior) TBD when that system ships.

### Contributor skins

Idea: base Dev sprites can use **skins inspired by repository contributors** (avatars as-is initially; stylized pixel variants later).

Goals:

- Celebrate people who contribute to _this_ game repo
- Make each playthrough’s “office” feel a bit more personal / communal
- Stay respectful: **opt-in** framing, no mockery, clear that it’s a tribute

Rules (decided):

- Skin pool = opt-in contributors (e.g. CONTRIBUTORS file / consent list) from this project
- Fallback pool = generic pixel / illustrated devs if unavailable
- Avatars usable **as-is** for v1 pipeline; custom pixel portraits later
- **Dependabot (and similar bots)** allowed as joke skins
- Show **contributor name on hover**
- Attribution page / UI for skins
- Rare / unlockable skins tied to milestones (optional later)

## 6. Broader upgrade tree (draft)

Ordered roughly early → late. Names are placeholders. Non-Dev upgrades use **buildings / props** (and optional small crowds), not only numbers.

| Tier | Upgrade                | Fantasy                         | Scene beat      |
| ---- | ---------------------- | ------------------------------- | --------------- |
| 0    | Manual click / Ship It | You                             | Big button      |
| 1    | **Espresso machine**   | Cheap tokens/s (first building) | Machine / mugs  |
| 2    | **Dev**                | Core tokens/s, skins            | Growing team    |
| 3    | Code review            | Multiplier or tokens/s          | Pair at monitor |
| 4    | CI / CD                | Automation                      | Pipeline bots   |
| 5    | On-call / SRE          | Spiky flavor later              | Pager lights    |
| 6    | Microservices          | Many small producers            | Service boxes   |
| 7    | Cloud regions          | Big tokens/s                    | Map / racks     |
| 8    | AI coding agents       | Late game flood                 | Robot swarm     |

Also consider **multipliers** (not only producers): “Standup”, “Rubber duck”, “Stack Overflow tab”, “Dark mode”, “Mechanical keyboard”.

_(“Rewrite” is reserved for prestige — not a normal shop upgrade.)_

## 7. Prestige: Rewrite (Cookie-style)

**Model:** Cookie Clicker soft reset.

Big milestone → **Rewrite** → reset run economy → keep permanent power from **Rewrites** + cosmetics + rooms.

| Keep after Rewrite                                              | Reset                           |
| --------------------------------------------------------------- | ------------------------------- |
| Lifetime **Rewrites** bank + permanent mults from prestige shop | Token bank                      |
| Cosmetics / contributor unlocks                                 | Owned upgrade counts            |
| **Unlocked rooms** (keep — losing the map feels punishing)      | Current tokens/s from buildings |

### When Rewrite unlocks

- Track **tokens earned this run** (not current bank — spending must not delay prestige).
- **Rewrite** becomes available when the projected gain is **≥ 1 Rewrite**.
- Shell chrome stays quiet until then: a muted one-line progress hint until unlock, then a discrete Rewrite CTA (no always-on grayed panel or Rewrites shop in the normal shop). Prestige spend happens in the Rewrite flow after confirm.

### Rewrites gained (formula lean)

```text
rewritesGained = floor(sqrt(tokensEarnedThisRun / K))
```

`K` is a balance constant (tune in playtests). Target feel: **first Rewrite ~20–40 minutes** of engaged play for a portfolio demo (shorter than classic Cookie; long enough to care).

Gained Rewrites add to a **lifetime bank**. Confirm dialog must show tokens lost vs Rewrites gained + new permanent power.

### What Rewrites do in v1 (hybrid, Cookie-lite)

1. **Banked Rewrites** grant a passive permanent **tokens/s** multiplier (power even if you never open the meta shop).
2. **Small prestige shop** (spend Rewrites on permanent upgrades — agency matters):

| Upgrade           | Effect (lean)                                         |
| ----------------- | ----------------------------------------------------- |
| **Postmortem**    | +% tokens/s (repeatable / tiered cost)                |
| **Muscle memory** | +% tokens per click                                   |
| **Stub repo**     | Each new run starts with **1 Espresso machine** owned |

No huge heavenly tree in v1 — three upgrades is enough. Expand later if needed.

**Prestige currency** is never spent on normal shop rows (Devs, CI, etc.).

### Espresso machine (locked role)

**Small tokens/s producer** (first building on the ladder). Click-power boosts come from other multipliers / prestige (**Muscle memory**), not from this upgrade — keeps “buy building → tokens/s goes up” crystal clear.

## 8. Feature list by phase

### MVP

- [ ] Click Ship It for tokens
- [ ] At least 3–5 buyable upgrades with rising **Cookie-style** cost curve (incl. Espresso machine + Dev)
- [ ] Passive tokens/s tick (**no offline accrual** while tab closed)
- [ ] Autosave + reload persistence
- [ ] **Save export/import**
- [ ] Basic shop UI + tokens / tokens/s header (free-license icons)
- [ ] **Scene with visible Devs** (DOM + CSS; LOD/cap at high counts)
- [ ] Responsive layout: right shop on desktop, drawer on mobile
- [ ] Checksum mismatch: load anyway + warn the player
- [ ] Common number formatting (K, M, B — no scientific / “dev” notation)

### v1

- [ ] Full early upgrade ladder
- [x] Light motion polish (**no audio** yet) — absorbed by #28 game UI redesign
- [ ] **Rewrite** prestige + **Rewrites** bank mult + small prestige shop (Postmortem / Muscle memory / Stub repo)
- [x] Contributor skin pipeline (**static** JSON/assets + fallback skins; opt-in; hover names; bots OK)
- [x] Empty → busy office; **unlockable rooms**
- [ ] Quave Cloud **staging** deploy (`joaovictornsv-ship-it-staging`)
- [x] Attribution for contributor skins

### Later / wishlist

- [ ] Dev tier **super-upgrade** (promote all owned Devs junior → mid → …)
- [ ] Custom pixel art replacing stock icons where it matters
- [ ] Achievements / “incidents”
- [ ] Seasonal skins / hackathon modes
- [ ] Offline progress (explicitly deferred)
- [ ] Leaderboard (out of scope — client-only)
- [ ] Mini-events (SEV-1: temporary CPS chaos)
- [ ] Sound toggle
- [ ] Accessibility pass (reduce motion, keyboard shop)
- [ ] Localization (out of scope for now — **English only**)

## 9. UX notes

- **One primary action** on first paint: the Ship It button should dominate.
- Shop rows: icon, name, short joke blurb, owned count, cost in tokens, “buy” affordance.
- Scene should remain readable at 0, 10, 100+ entities (cap rendered sprites, show “×N” badge, or crowd LOD).
- Humor in copy > wall of lore. One-liners per upgrade.
- Avoid cluttering the first viewport with stats strips; Cookie Clicker density can grow _after_ the core loop is felt.
- **Numbers:** common abbreviations (1,234 → later 1.2K, 3.4M, 1.1B). No scientific notation in the main UI.

### Mobile

- Shop as bottom sheet / drawer
- Scene simplified (fewer sprites)
- Large tap target for Ship It

## 10. Open questions

Product identity, economy, and prestige **design** are locked. Remaining work is implementation tuning (exact `K`, % values, shop costs) during balance playtests — not open product questions.

### Locked

- [x] Game name / slug / npm / `<title>` → **Ship It** / `ship-it` / `Ship It`
- [x] Primary currency → **tokens** (UI rate: tokens/s)
- [x] Early upgrade → **Espresso machine** = small **tokens/s** producer
- [x] Click target → **Ship It** button
- [x] Art direction → **Pixel**; Audio MVP → **No**
- [x] Prestige → Cookie-style **Rewrite**; currency **Rewrites**
- [x] Rewrite unlock → available at ≥1 Rewrite from `floor(sqrt(tokensEarnedThisRun / K))`
- [x] Rewrites power → banked passive tokens/s mult + small shop (Postmortem / Muscle memory / Stub repo)
- [x] Rooms → **keep** after Rewrite
- [x] Cost curve → Cookie-style exponential; no hard cap; no click combos; no offline in v1
- [x] Devs = one tier for now; Intern removed; max rendered + LOD; opt-in skins; avatars as-is; bots OK; hover names
- [x] Unlockable rooms; non-Dev = buildings/props; shop right + mobile drawer; common number format; free-license MVP icons
- [x] Audience portfolio; English only; pure systemic; incidents later

## 11. Reference vibes (not clones)

- **Cookie Clicker** — grandma presence, shop density, escalating absurdity, prestige chips
- **Universal Paperclips** — systemic escalation, dark wit (tone dial carefully)
- **Adventure Capitalist** — clear business tiers (structure only)
- Dev meme culture — coffee, LGTM, “works on my machine”, merge freezes, the eternal rewrite

## 12. Success criteria (feeling checks)

The game is on the right track when:

1. First 30 seconds: click Ship It → buy something with tokens → see tokens/s move **and** see a Dev appear.
2. First 10 minutes: shop has meaningful choices; scene looks different from minute one.
3. Reload: progress restored; player trusts the save.
4. Someone who knows the repo smiles when they spot a contributor skin.
5. First Rewrite feels like a joke _and_ a power spike — not a punishment.

---

_Last updated: 2026-07-26 — living document; resolve open questions by checking boxes and promoting decisions into the sections above._
