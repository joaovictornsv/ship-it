# Contributors

Static skin pipeline, opt-in, fallbacks, attribution, office hover names.

**Status:** active — issues #10 / #48. Office Devs show each opt-in avatar at most once; extra desks use emoji glyphs + fake names; Credits page lists skins.

## Owned by

- `src/data/contributors.ts` — opt-in skin catalog, `FAKE_DEV_NAMES`, `resolveDevSkin` / `resolveDevSkinFromPool`, profile URL helper, talk name-drops
- `src/data/talkNames.ts` — re-exports `TALK_CONTRIBUTOR_NAMES` from the skins catalog
- `src/features/scene/DevSprite.tsx` — avatar or emoji; talk-bubble name tip on hover/focus; human skins link to GitHub; `onError` → emoji
- `src/app/CreditsView.tsx` — attribution UI (`#/credits`)
- `public/contributors/opt-in.json` — consent list (source for generate)
- `public/contributors/avatars/*.png` — static public avatars (as-is for v1)
- `scripts/generate-contributors.ts` — `pnpm generate:contributors` (public GitHub PNGs only)

## Pipeline

| Step    | Detail                                                                                                                          |
| ------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Opt-in  | Add `{ login, displayName, kind }` to `opt-in.json` **with consent**. Bots (`dependabot`) OK as joke skins.                     |
| Bake    | `pnpm generate:contributors` downloads `https://github.com/{login}.png` → `public/contributors/avatars/{id}.png`. **No token.** |
| Catalog | Keep `CONTRIBUTOR_SKINS` in `src/data/contributors.ts` aligned with opt-in (ids, display names, `avatarFile`).                  |
| Runtime | Desk index `i < pool.length` → unique contributor; overflow / empty / img failure → `devEmojiForIndex` fallback.                |
| Hover   | See **Office hover + links** below.                                                                                             |
| Talk    | `TALK_CONTRIBUTOR_NAMES` derived from the same catalog so bubbles name-drop skins.                                              |
| Credits | Header **Credits** (Users icon) → `#/credits` lists opt-in skins + tribute copy.                                                |

## Office hover + links

| Desk kind              | Hover name tip              | Click                                                                                  |
| ---------------------- | --------------------------- | -------------------------------------------------------------------------------------- |
| Human contributor skin | GitHub username (`skin.id`) | `<a href="https://github.com/{id}">` (`target="_blank"` + `rel="noopener noreferrer"`) |
| Bot contributor skin   | GitHub username (`skin.id`) | **No link** (`kind: 'bot'` → `profileUrl: null`)                                       |
| Fallback / emoji desk  | Stable fake name from pool  | **No link**                                                                            |

- Fake names live in `FAKE_DEV_NAMES` / `fakeDevNameForIndex(index)` in `src/data/contributors.ts` (English-only ordinary + joke names). Desk index maps stably into the pool (modulo).
- Name tip is a **simple talk-shaped chip** (same size/radius as office talk, but **inverted**: `--ship-ink` fill + `--ship-bg-elevated` text) portaled to `body` so stage `overflow-hidden` does not clip it. Hover / focus only — no ⓘ pin like the shop details tip. Inverted colors keep it distinct from speech bubbles.
- Link chrome must not invent new colors/fonts — inherit office sprite layout (`docs/modules/ui.md`).

## Fallback rules

- Each opt-in skin appears **at most once** among visible desks (no A/B/A/B repeats).
- Empty `CONTRIBUTOR_SKINS` or desks beyond the pool size → generic emoji glyphs + fake-name hover.
- Avatar 404 / decode error → that sprite switches to emoji (other desks unaffected); contributor hover/link rules still apply when the skin resolved.
- No private profile APIs in the client; no `VITE_*` secrets for this path.

## Out of scope (here)

- Stylized pixel portraits
- Rare / unlockable skins tied to milestones
- Auto-PR that syncs GitHub contributors without consent
