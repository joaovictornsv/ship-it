# Contributors

Static skin pipeline, opt-in, fallbacks, attribution.

**Status:** stub — issue #10; assets under `public/contributors/`. Talk name-drops (#31) ship ahead of skins.

## Owned by

- `src/data/contributors.ts` — skin catalog (empty until #10)
- `src/data/talkNames.ts` — public display-name allowlist for rare office bubbles (owner first)
- `public/contributors/`

## Talk name-drops (#31)

Until skins land, `TALK_CONTRIBUTOR_NAMES` is a tiny hardcoded public allowlist (`joaovictornsv`). No private profile APIs. When #10 adds opt-in skins, merge display names into this pool (or re-export from the skin catalog) so bubbles and sprites stay in sync.
