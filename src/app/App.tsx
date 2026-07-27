import { Medal, Save } from 'lucide-react';
import { AchievementUnlockToast } from '../features/achievements';
import {
  SaveUntrustedBanner,
  useAutosave,
  useHydrateSave,
} from '../features/save';
import { useProductionTick } from '../features/shop';
import { AchievementsView } from './AchievementsView';
import { Atmosphere } from './Atmosphere';
import { PlayView } from './PlayView';
import { SaveView } from './SaveView';
import { useAppView } from './useAppView';

const iconNavClass =
  'inline-flex size-9 items-center justify-center rounded-lg text-[var(--ship-accent-deep)] hover:bg-[color-mix(in_srgb,var(--ship-ink)_6%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ship-accent)]';

export function App() {
  const { ready, error } = useHydrateSave();
  useAutosave(ready);
  useProductionTick(ready);
  const [view, setView] = useAppView();

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-4 text-[var(--ship-muted)]">
        Loading save…
      </div>
    );
  }

  return (
    <div className="ship-shell flex min-h-dvh flex-col">
      <Atmosphere />
      <header className="border-b border-[var(--ship-line)] bg-[color-mix(in_srgb,var(--ship-bg-elevated)_82%,transparent)] px-4 py-2.5 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <button
            type="button"
            className="text-lg font-semibold tracking-tight text-[var(--ship-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ship-accent)]"
            onClick={() => setView('play')}
          >
            Ship It
          </button>
          {view === 'play' ? (
            <div className="flex items-center gap-1">
              <button
                type="button"
                className={iconNavClass}
                aria-label="Achievements"
                onClick={() => setView('achievements')}
              >
                <Medal className="size-5" strokeWidth={2} aria-hidden />
              </button>
              <button
                type="button"
                className={iconNavClass}
                aria-label="Save"
                onClick={() => setView('save')}
              >
                <Save className="size-5" strokeWidth={2} aria-hidden />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="rounded-lg px-2 py-1 text-sm font-semibold text-[var(--ship-accent-deep)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ship-accent)]"
              onClick={() => setView('play')}
            >
              Back to play
            </button>
          )}
        </div>
      </header>

      <SaveUntrustedBanner />
      <AchievementUnlockToast />

      {error ? (
        <div
          role="alert"
          className="border-b border-[var(--ship-line)] bg-[color-mix(in_srgb,var(--ship-bg-elevated)_94%,transparent)] px-4 py-2 text-sm text-[var(--ship-ink)]"
        >
          <p className="mx-auto max-w-6xl text-left">
            Could not restore the previous save ({error}). Starting fresh —
            export backups if you need them.
          </p>
        </div>
      ) : null}

      {view === 'save' ? (
        <SaveView />
      ) : view === 'achievements' ? (
        <AchievementsView />
      ) : (
        <PlayView />
      )}
    </div>
  );
}
