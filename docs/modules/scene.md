# Scene

DOM + CSS living office, LOD caps (24–48 desktop lean; leaner on mobile), **unlockable rooms**, animation / `prefers-reduced-motion`.

**Status:** active — desk-grid office + emoji sprites + richer talk bubbles (#28 / #31); mobile sprite lean from #8; unlockable rooms + prestige keep-list (#11).

## Owned by

- `src/features/scene/` — `OfficeScene`, `RoomSwitcher`, `DevSprite`, `OfficeTalkBubbles`, `devTalk`, `specialtyTalk`, LOD / stage helpers, `sceneEvents`, `onUpgradeOwnedChanged`
- `src/data/rooms.ts` — unlockable room catalog (`Rooms` / `createEnum`)
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
| `owned[espresso-machine]` etc. | Emoji prop chips in the props rail (espresso, PR, CI, pager)  |
| `roomsUnlocked` / `activeRoom` | Room map tabs + per-room floor/wall tint; kept across Rewrite |

Buying a Dev increases tokens/s **and** spawns a visible character (until the LOD cap). Non-Dev producers densify the props rail; later rooms (`ops-bay`, `datacenter`) tighten prop spacing for a busier map.

## Desk farm + sprites

| Rule               | Value                                                                                                                                                                                                                                                                       |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Layout             | Props rail above `.office-stage-body` (floor + talk + CSS Grid desk farm)                                                                                                                                                                                                   |
| Empty desks        | Stage-driven minimum desk count so the office densifies before the LOD cap                                                                                                                                                                                                  |
| Dev sprite         | Opt-in contributor avatar when catalog non-empty; else emoji (`upgradeEmoji` / `DEV_EMOJIS`). Hover / focus shows an inverted-color name tip (GitHub username for skins; stable fake name for fallback). Human skins link to GitHub; bots do not. Avatar `onError` → emoji. |
| Talk bubbles       | See **Talk bubbles** below — scoped to `.office-stage-body` (desk band) so `overflow-hidden` on the stage does not clip them                                                                                                                                                |
| Breakpoint         | Same as shop: Tailwind `lg` / `min-width: 1024px` (`DESKTOP_MEDIA_QUERY`)                                                                                                                                                                                                   |
| Desktop sprite cap | `SCENE_SPRITE_CAP = 32` (mid-range of 24–48 lean)                                                                                                                                                                                                                           |
| Mobile sprite cap  | `SCENE_SPRITE_CAP_MOBILE = 16` (below `lg`)                                                                                                                                                                                                                                 |
| Cap helper         | `sceneSpriteCap(isDesktop)`                                                                                                                                                                                                                                                 |
| Visible sprites    | `min(owned, cap)` via `visibleDevCount`                                                                                                                                                                                                                                     |
| Badge              | When `owned > cap`, show `×{owned}` so 100+ stays readable                                                                                                                                                                                                                  |
| Stage panel        | `max-w-xl` → `sm:max-w-2xl`, `rounded-2xl` — reads as a stage                                                                                                                                                                                                               |

Helpers: `src/features/scene/lod.ts` (unit-tested).

### Talk bubbles

| Piece             | Behavior                                                                                                                                                                                     |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| UI                | `OfficeTalkBubbles` — up to 4 bubbles over the desk band (not the props rail); inset placement; slow spawn (~5–8s), long dwell (~7–10s); **off** under `prefers-reduced-motion`              |
| Majority copy     | `devTalk.ts` — generic `DEV_LINES` + `DEV_DIALOGUES`                                                                                                                                         |
| Rare specialty    | `specialtyTalk.ts` — ~14% of non-dialogue spawns (`SPECIALTY_LINE_CHANCE`)                                                                                                                   |
| Specialty buckets | Open GitHub issues (build-time snapshot), contributor name-drops, calendar (weekday / time-of-day), owned-upgrade props (Espresso / CI / on-call / code review), office stage, tokens/s band |
| Issue data        | `src/data/openIssues.ts` via `pnpm snapshot:issues` (server/CI; optional `SHIP_IT_GITHUB_TOKEN`; **no client secrets**). Stale-OK; empty snapshot → skip GitHub bucket                       |
| Contributor names | `src/data/contributors.ts` opt-in skins → `TALK_CONTRIBUTOR_NAMES` (re-exported via `talkNames.ts`)                                                                                          |
| Motion / chrome   | Reuses `.office-talk-bubble` tokens from `ui.md` — specialty is **copy/selection only**                                                                                                      |

### Contributor skins

`DevSprite` resolves desk index via `resolveDevSkin` against the opt-in pool in `src/data/contributors.ts` — each contributor avatar appears at most once on screen; overflow desks use emoji glyphs with a stable fake name from `FAKE_DEV_NAMES`. Hover / focus shows a portaled name tip (contributor = GitHub login; fallback = fake name) in talk-bubble shape with **inverted** ink/elevated colors so it does not read as speech — simpler than the shop ⓘ details tip (no pin). Human skins are links to `https://github.com/{login}` (`target="_blank"` + `rel="noopener noreferrer"`); `kind: 'bot'` skins show a name but are not links. Avatars are static files under `public/contributors/avatars/`; bake with `pnpm generate:contributors`. Credits / attribution: `#/credits` (`CreditsView`). See `docs/modules/contributors.md`.

## Unlockable rooms

Data-driven map spaces in `src/data/rooms.ts`. Unlock once → sticky in `roomsUnlocked` (save **v6**); **kept** across Rewrite. `RoomSwitcher` tabs appear once ≥2 rooms are unlocked so minute-1 stays a single office stage.

| ID           | Label      | Unlock                  | Feel                                    |
| ------------ | ---------- | ----------------------- | --------------------------------------- |
| `office`     | Office     | Always                  | Starting desks + sky wash               |
| `break-room` | Break room | Own ≥1 Espresso machine | Warm espresso tint                      |
| `review-lab` | Review lab | Own ≥1 Code review      | Cool review-blue wall/floor             |
| `ops-bay`    | Ops bay    | Own ≥1 CI / CD          | Green/amber ops wash; denser props rail |
| `datacenter` | Datacenter | Bank ≥1 Rewrite         | Cooler denser floor; taller desk farm   |

- Pure helpers: `newlyUnlockedRooms` / `resolveActiveRoom` / `roomSceneClass` in `src/game/rooms.ts` (unit-tested).
- CSS modifiers: `.office-room-{id}` override local `--office-*` vars (not shell `--ship-*`).
- New unlocks auto-focus the highest newly unlocked room; player can switch via tabs.
- Empty-state hint copy is per-room (`emptyHint` on the catalog entry).
- Prestige keep-list: see `prestige.md`.

## Milestone densification

Discrete **scene stages** keyed off **Dev** owned count. Crossing a threshold shifts the office (empty desk count / floor tint), not only +1 sprite. Stage changes briefly flash the panel (`.office-stage-flash`). Room changes reuse the same flash.

| Owned Devs | Stage name   | Feel                                         |
| ---------- | ------------ | -------------------------------------------- |
| 0          | `empty`      | Vacant office — empty desks + hire-Devs hint |
| 1          | `solo`       | Solo hacker — first desk occupied            |
| 10         | `small-team` | Small team — more desks visible              |
| 25         | `open-plan`  | Open-plan densification — full desk set      |
| 50+        | `crowded`    | Crowded office; LOD + badge carry count      |

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

| Name                     | Where                  | Notes                                                            |
| ------------------------ | ---------------------- | ---------------------------------------------------------------- |
| `office-dev-bob`         | `.office-dev`          | Light idle bob (~2.4s); **off** under `prefers-reduced-motion`   |
| `office-spawn-pop`       | `.office-dev-spawn`    | Short celebration when a Dev is bought                           |
| `office-stage-flash`     | `.office-stage-flash`  | Inset flash on milestone stage change                            |
| `office-talk-in` / `out` | `.office-talk-bubble`  | Soft opacity fade; slow spawn (~5–8s), long dwell (~7–10s)       |
| Desk opacity             | `.office-desk-surface` | Short opacity ease when stage changes; none under reduced motion |

Shell motion (`ship-press`, `floater-rise`, `shop-drawer-up`, atmosphere, HUD pulse) stays documented in `ui.md`. Scene mug tint (`--office-mug`) is **local** to `.office-scene` — not a global shell token. Upgrade prop hues use `--ship-upgrade-*`.

## Out of scope (here)

- Pixel art pipeline
- Rare / unlockable skins tied to milestones
