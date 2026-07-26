# Prestige (Rewrite)

Soft reset, Rewrites currency, what resets vs keeps (rooms kept).

**Status:** stub — PRODUCT §7; issue #9.

## Formula (locked intent)

`floor(sqrt(tokensEarnedThisRun / K))` — `K` playtest-tuned.

## Keep vs reset (intent)

When Rewrite ships (#9), soft reset clears **this-run** progress and keeps meta:

| Resets                                    | Keeps                                                           |
| ----------------------------------------- | --------------------------------------------------------------- |
| Token bank                                | Rewrites bank                                                   |
| Owned buildings (`owned`)                 | Prestige shop upgrades (Postmortem / Muscle memory / Stub repo) |
| Ship upgrades (`shipOwned`) — click track | Cosmetics / rooms (when rooms exist)                            |
| Run tokens/s                              | Banked Rewrites passive tokens/s mult                           |

**Muscle memory** is a permanent **% on tokens per click** from the prestige shop. It stacks **on top of** this-run Ship upgrades (`clickPower` flats/mults). Ship upgrades are not prestige; they reset with the run.

Until #9 lands, document only — no Rewrite action in the client yet.
