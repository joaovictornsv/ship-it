# Scene

DOM + CSS living office, LOD caps (24–48 desktop lean; leaner on mobile), **unlockable rooms**, animation / `prefers-reduced-motion`.

**Status:** active — desk-grid office + emoji sprites + richer talk bubbles (#28 / #31); mobile sprite lean from #8; unlockable rooms + prestige keep-list (#11).

## Owned by

- `src/features/scene/` — `OfficeScene`, `RoomSwitcher`, `DevSprite`, `OfficeTalkBubbles`, `devTalk`, `roomTalk`, `specialtyTalk`, LOD / stage helpers, `sceneEvents`, `onUpgradeOwnedChanged`
- `src/data/rooms.ts` — unlockable room catalog (`Rooms` / `createEnum`)
- `src/data/devTitles.ts` — stable cosmetic job titles for emoji desks
- `src/game/rooms.ts` — pure unlock + active-room helpers
- `src/data/openIssues.ts` — build-time open-issue snapshot for rare GitHub talk (`pnpm snapshot:issues`)
- `src/data/contributors.ts` — opt-in contributor skins + talk name-drops (`pnpm generate:contributors`)
- `src/data/talkNames.ts` — re-exports talk names from the skins catalog
- `src/app/breakpoints.ts` / `useMediaQuery` — desktop vs mobile sprite budget
- `src/styles/index.css` — `.office-*` desk farm, room tints, stage density, bob / spawn / stage flash / talk
- `src/app/PlayView.tsx` — mounts `OfficeScene` as the play stage above the HUD + Ship It cluster
- `src/app/CreditsView.tsx` — contributor skin attribution (`#/credits`)

## Presence

| Source                         | Behavior                                                      |
| ------------------------------ | ------------------------------------------------------------- |
| Zustand `owned[dev]`           | `OfficeScene` subscribes; hydrate / buy both update the crowd |
| `onUpgradeOwnedChanged(id, n)` | Notifies `sceneEvents` → spawn pop on Dev buy                 |
| `owned[espresso-machine]` etc. | Flavor for talk bubbles / room unlocks — no scene prop chips  |
| `roomsUnlocked` / `activeRoom` | Room map tabs + per-room floor/wall tint; kept across Rewrite |

Buying a Dev increases tokens/s **and** spawns a visible character (until the LOD cap). Rooms share the same chrome padding and differ by floor/wall tint.

## Desk farm + sprites

| Rule               | Value                                                                                                                                                                                                                                                                                                    |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Layout             | Room tabs above `.office-stage-body` (floor + talk + CSS Grid desk farm) — no building / prop chips                                                                                                                                                                                                      |
| Empty desks        | Stage minimum, then `deskFarmCount` pads to complete rows (6 cols below `lg`, 9 at `lg`+) so the farm never ends mid-row                                                                                                                                                                                 |
| Occupied desks     | `DeskStack` — flex desk bar: center laptop (overflows top) · right snack/drink; vacant desks keep a contrasting gradient surface. Cell width is fixed (`--office-desk-cell-w: 3rem`); farm uses `justify-content: space-between` so rows span the stage width                                            |
| Dev sprite         | Opt-in contributor avatar when catalog non-empty; else per-room emoji pool (`upgradeEmoji` / `rooms.devEmojis`). Hover / focus shows an inverted-color name tip (GitHub username + **Contributor** for skins; fake name + **cosmetic title** for fallback). No outbound click. Avatar `onError` → emoji. |
| Talk bubbles       | See **Talk bubbles** below — scoped to `.office-stage-body` (desk band) so `overflow-hidden` on the stage does not clip them                                                                                                                                                                             |
| Breakpoint         | Sprite budget + desk columns: Tailwind `lg` / `min-width: 1024px` (`DESKTOP_MEDIA_QUERY`) — columns stay tied to LOD breakpoint; vacant desks pad incomplete rows                                                                                                                                        |
| Desktop sprite cap | `SCENE_SPRITE_CAP = 36` (9×4) at `lg`+ — full farm, no vacant seats at cap                                                                                                                                                                                                                               |
| Mobile sprite cap  | `SCENE_SPRITE_CAP_MOBILE = 24` (6×4) below `lg` — full farm, no vacant seats at cap                                                                                                                                                                                                                      |
| Cap helper         | `sceneSpriteCap(isDesktop)` / `sceneDeskColumns(isDesktop)` / `deskFarmCount`                                                                                                                                                                                                                            |
| Visible sprites    | `min(owned, cap)` via `visibleDevCount`                                                                                                                                                                                                                                                                  |
| Counts             | When `owned > cap`, show Dev `×{owned}` badge (no building prop chips)                                                                                                                                                                                                                                   |
| Stage panel        | `max-w-xl` → `sm:max-w-2xl`, `rounded-2xl` — reads as a stage                                                                                                                                                                                                                                            |

Helpers: `src/features/scene/lod.ts` (unit-tested).

### Talk bubbles

| Piece             | Behavior                                                                                                                                                                                 |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| UI                | `OfficeTalkBubbles` — up to 4 bubbles over the desk band; inset placement; slow spawn (~5–8s), long dwell (~7–10s); **off** under `prefers-reduced-motion`                               |
| Majority copy     | `roomTalk.ts` / `devTalk.ts` — **per-room** lines + dialogues (office / break-room / review-lab / ops-bay / datacenter)                                                                  |
| Rare specialty    | `specialtyTalk.ts` — ~14% of non-dialogue spawns (`SPECIALTY_LINE_CHANCE`); category preference skewed by active room                                                                    |
| Specialty buckets | Open GitHub issues (build-time snapshot), contributor name-drops, calendar, owned-upgrade props, office stage, tokens/s band, room flavor                                                |
| Issue / names     | Room-flavored templates (e.g. ops-bay pages `#N`; break-room AFKs a contributor; review-lab asks for LGTM) — same snapshots, different jokes                                             |
| Emotional peaks   | ~10% of non-dialogue spawns (`EMOTIONAL_PEAK_CHANCE`): **angry** (critic / bug, red thick border + bold) or **happy** (ship / promo, green thick border + bold); may cite issues / names |
| Issue data        | `src/data/openIssues.ts` via `pnpm snapshot:issues` (server/CI; optional `SHIP_IT_GITHUB_TOKEN`; **no client secrets**). Stale-OK; empty snapshot → skip GitHub bucket                   |
| Contributor names | `src/data/contributors.ts` opt-in skins → `TALK_CONTRIBUTOR_NAMES` (re-exported via `talkNames.ts`)                                                                                      |
| Motion / chrome   | Neutral bubbles reuse `.office-talk-bubble`; peaks use `.office-talk-bubble-angry` / `-happy` (`--ship-talk-angry` / `--ship-talk-happy`)                                                |

### Contributor skins

`DevSprite` resolves desk index via `resolveDevSkin` against the opt-in pool in `src/data/contributors.ts` — each contributor avatar appears at most once on screen; overflow desks use per-room emoji glyphs with a stable fake name from `FAKE_DEV_NAMES` and cosmetic title from `devTitles.ts`. Hover / focus shows a portaled name tip (contributor = GitHub login + **Contributor** label only; fallback = fake name + title) in talk-bubble shape with **inverted** ink/elevated colors so it does not read as speech — simpler than the shop ⓘ details tip (no pin). Contributor desks are not outbound links; they behave like normal office Devs. Avatars are static files under `public/contributors/avatars/`; bake with `pnpm generate:contributors`. Credits / attribution: `#/credits` (`CreditsView`). See `docs/modules/contributors.md`.

## Unlockable rooms

Data-driven map spaces in `src/data/rooms.ts`. Unlock once → sticky in `roomsUnlocked` (save **v6**); **kept** across Rewrite. `RoomSwitcher` tabs appear once ≥2 rooms are unlocked so minute-1 stays a single office stage. Tabs are a single horizontal row with `overflow-x-auto` (no wrap) so five rooms stay reachable on narrow widths.

| ID           | Label      | Unlock                  | Dominant tint (wall / floor)                     |
| ------------ | ---------- | ----------------------- | ------------------------------------------------ |
| `office`     | Office     | Always                  | Darker **sky** wall + light sky floor wash       |
| `break-room` | Break room | Own ≥1 Espresso machine | Darker **warm amber** wall + light espresso wash |
| `review-lab` | Review lab | Own ≥1 Code review      | Darker **purple** wall + light wash              |
| `ops-bay`    | Ops bay    | Own ≥1 CI / CD          | Darker **CI green** wall + light wash            |
| `datacenter` | Datacenter | Bank ≥1 Rewrite         | Strong **marine blue** wall + light wash         |

- Per-room modifiers use **strong** wall hues and a **light floor wash** so the wall reads darker than the floor (not washed-out siblings).
- **Desks are shared** across rooms: ops-bay espresso wood (`ink` + espresso, warm shine) on `.office-scene` — rooms must **not** override `--office-desk` / `--office-desk-shine` / `--office-desk-edge`. `.office-desk-surface` paints a soft vertical gradient (shine → desk → edge) — no flat solid fills.
- Wall (`.office-sky`) and floor (`.office-floor`) also use soft multi-stop gradients, not solids. Floor stays an elevated light wash — never pull darker wall/ink into the floor band (that inverted wall/floor value).

- Per-room **Dev emoji pools** (`devEmojis`) — people-only fallback sprites; contributor avatars unchanged. Room tint carries place identity — not food/object glyphs as Devs.

- Pure helpers: `newlyUnlockedRooms` / `resolveActiveRoom` / `roomSceneClass` in `src/game/rooms.ts` (unit-tested).
- CSS modifiers: `.office-room-{id}` override local **tint** vars only (`--office-wall` / `--office-floor` / `--office-mug`). Do **not** change desk vars, padding, or min-height per room.
- Shared chrome inset lives on `.office-scene`: `--office-pad-x` (0.85rem) for tabs and desk farm. Rooms must keep that standard.
- New unlocks auto-focus the highest newly unlocked room; player can switch via tabs.
- Empty-state hint copy is per-room (`emptyHint` on the catalog entry).
- Prestige keep-list: see `prestige.md`.

## Milestone densification

Discrete **scene stages** keyed off **Dev** owned count. Crossing a threshold shifts the office (empty desk count / floor tint), not only +1 sprite. Stage changes briefly flash the panel (`.office-stage-flash`). Room changes reuse the same flash.

| Owned Devs | Stage name   | Feel                                           |
| ---------- | ------------ | ---------------------------------------------- |
| 0          | `empty`      | Vacant office — empty desks + hire-Devs hint   |
| 1          | `solo`       | Solo hacker — first desk occupied              |
| 10         | `small-team` | Small team — more desks visible                |
| 25         | `open-plan`  | Open-plan densification — full desk set        |
| 50+        | `crowded`    | Crowded office; LOD + Dev ×N badge carry count |

- Data-driven: `SceneStages` / `SCENE_STAGES` / `sceneStageForOwned` in `src/features/scene/stages.ts` (`createEnum`; per-stage fields like `emptyDesks` live on the entry).
- Cheap CSS variants (`.office-stage-*`) — no art pipeline in #7 / #28.
- Stages are **not** Dev tier promotion (junior → mid → senior).

## Empty office (0 Devs)

When `devOwned === 0` (`office-stage-empty`), the stage shows a vacant empty state:

| Element     | Behavior                                                                |
| ----------- | ----------------------------------------------------------------------- |
| Empty desks | 4 desk chips at readable opacity (`.office-stage-empty`)                |
| Hint        | Centered copy from the active room’s `emptyHint` (office default above) |
| Exit        | Hint disappears once the first Dev is owned (stage → `solo`)            |

The play-tip below Ship It stays about clicking / tokens; this hint is place-specific to the active room stage.

## Motion

| Name                     | Where                                               | Notes                                                                          |
| ------------------------ | --------------------------------------------------- | ------------------------------------------------------------------------------ |
| `office-dev-bob`         | `.office-dev`                                       | Light idle bob (~2.4s); **off** under `prefers-reduced-motion`                 |
| `office-spawn-pop`       | `.office-dev-spawn`                                 | Short celebration when a Dev is bought                                         |
| `office-stage-flash`     | `.office-stage-flash`                               | Inset flash on milestone stage change                                          |
| `office-talk-in` / `out` | `.office-talk-bubble` (+ `-angry` / `-happy` peaks) | Soft opacity fade; slow spawn (~5–8s), long dwell (~7–10s); peaks linger +1.2s |
| Desk opacity             | `.office-desk-surface`                              | Short opacity ease when stage changes; none under reduced motion               |

Shell motion (`ship-press`, `floater-rise`, `shop-drawer-up`, atmosphere, HUD pulse) stays documented in `ui.md`. Scene mug tint (`--office-mug`) is **local** to `.office-scene` — not a global shell token. Upgrade prop hues use `--ship-upgrade-*`.

## Out of scope (here)

- Buyable office themes (#34)
- Rare / unlockable skins tied to milestones
