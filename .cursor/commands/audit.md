# Audit (check-quality tier)

Security (save assumptions, no secrets) + perf (scene LOD, tick). Run when the
diff touches those areas; otherwise skip and say so in the report.

Reference: [`.cursor/check-quality-reference.md`](../check-quality-reference.md).
Module docs: [`docs/modules/saves.md`](../../docs/modules/saves.md),
[`docs/modules/security.md`](../../docs/modules/security.md),
[`docs/modules/scene.md`](../../docs/modules/scene.md).

Use alone for a targeted audit, or as step 3 of `/check-quality` after verify + review.

## Pipeline

### 1. Security (saves / client)

When the change touches save codec, migrators, checksum, export/import, storage, or hydrate:

| Check        | Expectation                                                              |
| ------------ | ------------------------------------------------------------------------ |
| No secrets   | No API keys, tokens, or credentials in client code or CI logs            |
| Checksum     | Tamper → **load anyway** + `saveUntrusted` banner; deterrence only       |
| Migrations   | Explicit migrator + tests when `v` bumps; unknown newer `v` fails closed |
| Single slot  | Still one `localStorage` key unless PRODUCT/TECHNICAL changes            |
| Threat model | Matches `security.md` (browser deterrence, not crypto security)          |

If the diff does not touch save/security surfaces, mark **pass (skipped)**.

### 2. Perf (scene LOD / tick)

When the change touches `src/features/scene/`, LOD caps, rooms, or the production tick / raf loop:

| Check           | Expectation                                                                   |
| --------------- | ----------------------------------------------------------------------------- |
| LOD caps        | Scene still respects documented caps / stage empty-desk rules in `scene.md`   |
| Tick purity     | Production math stays in pure helpers; store actions stay thin                |
| Motion          | Honors reduced-motion guidance in `ui.md` / `scene.md` when animation changes |
| No Canvas creep | Scene remains DOM + CSS (no WebGL/Canvas for v1 scene)                        |

If the diff does not touch scene/tick, mark **pass (skipped)**.

## Final report

Emit the audit-tier template from the reference doc.
