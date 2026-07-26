# Security

Threat model for the browser-only Ship It client, and what the save checksum actually buys.

**Status:** active — deterrence model from TECHNICAL §3.1 / §7 (issue #5).

## Threat model (v1)

| Asset                          | Risk                        | Mitigation                                              |
| ------------------------------ | --------------------------- | ------------------------------------------------------- |
| Local progress                 | Accidental loss / overwrite | Autosave + export/import                                |
| Save integrity                 | Casual edits / corruption   | SHA-256 over canonical state; warn on mismatch          |
| Secrets / API keys             | Leak in bundle              | **None in client** — static SPA only                    |
| Contributor / avatar data      | PII scrape                  | Static public metadata only; fallbacks always available |
| Fair multiplayer / leaderboard | Cheating                    | **Out of scope** — no backend scores in v1              |

## Checksum = deterrence, not anti-cheat

- Anyone can edit `localStorage` or an exported blob in DevTools.
- SHA-256 + base64 raise the effort slightly and catch accidental corruption.
- Failed checksum **still loads** (`saveUntrusted`) so players are not locked out.
- Do **not** treat checksums as proof of legitimate play. No HMAC, no server attestation in v1.

## Rules of thumb

- No secrets, private tokens, or privileged APIs in the client bundle.
- Prefer soft warnings over hard blocks for plausibility checks.
- Contributor skins/data stay static and public; attribution stays honest.
- When adding network features later, revisit this doc — client trust does not transfer to a server.
