# Achievements

Gallery shell for owned Ship upgrades and upcoming achievement stubs.

**Status:** active shell (issue #30 follow-up); unlock logic still roadmap (PRODUCT / ISSUES).

## Owned by

- `src/app/AchievementsView.tsx` — player UI
- `src/data/achievements.ts` — `UpcomingAchievements` (`createEnum`) + ordered `upcomingAchievements`
- `src/app/appView.ts` — `#/achievements` hash view
- Header Medal icon in `App.tsx` (play view)

## Player UI

| Section             | Content                                                           |
| ------------------- | ----------------------------------------------------------------- |
| Ship upgrades owned | This-run `shipOwned` catalog entries (glyph, name, blurb, effect) |
| Coming soon         | Static stubs from `UpcomingAchievements` — not unlockable yet     |

Uses `--ship-*` / Ship upgrade hue tokens; English copy only. No emoji in header chrome (Medal icon is Lucide).

## Navigation

- Hash: `#/achievements`
- Play header: Medal → Achievements; Save icon unchanged
- Secondary screens show **Back to play**

## Out of scope (for now)

- Persisted achievement unlocks / progress
- SEV / incident mini-events
- Prestige-tied achievements
