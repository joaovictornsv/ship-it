# Contributors

Static skin pipeline, opt-in, fallbacks, attribution.

**Status:** active — issue #10. Office Devs show each opt-in avatar at most once; extra desks use emoji glyphs; Credits page lists them.

## Owned by

- `src/data/contributors.ts` — opt-in skin catalog, `resolveDevSkin` / `resolveDevSkinFromPool`, talk name-drops
- `src/data/talkNames.ts` — re-exports `TALK_CONTRIBUTOR_NAMES` from the skins catalog
- `src/features/scene/DevSprite.tsx` — avatar or emoji; `title` = contributor name; `onError` → emoji
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
| Talk    | `TALK_CONTRIBUTOR_NAMES` derived from the same catalog so bubbles name-drop skins.                                              |
| Credits | Header **Credits** (Users icon) → `#/credits` lists opt-in skins + tribute copy.                                                |

## Fallback rules

- Each opt-in skin appears **at most once** among visible desks (no A/B/A/B repeats).
- Empty `CONTRIBUTOR_SKINS` or desks beyond the pool size → generic emoji glyphs.
- Avatar 404 / decode error → that sprite switches to emoji (other desks unaffected).
- No private profile APIs in the client; no `VITE_*` secrets for this path.

## Out of scope (here)

- Stylized pixel portraits
- Rare / unlockable skins tied to milestones
- Auto-PR that syncs GitHub contributors without consent
