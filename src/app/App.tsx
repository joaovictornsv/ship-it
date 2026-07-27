import { AchievementUnlockToast } from '../features/achievements';
import {
  SaveUntrustedBanner,
  useAutosave,
  useHydrateSave,
} from '../features/save';
import { useProductionTick } from '../features/shop';
import { AchievementsView } from './AchievementsView';
import { AppHeader } from './AppHeader';
import { Atmosphere } from './Atmosphere';
import { CreditsView } from './CreditsView';
import { PlayView } from './PlayView';
import { SaveView } from './SaveView';
import { useAppView } from './useAppView';

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
      <AppHeader view={view} setView={setView} />

      <SaveUntrustedBanner />
      <AchievementUnlockToast />

      {error ? (
        <div
          role="alert"
          className="border-b border-[var(--ship-line)] bg-[color-mix(in_srgb,var(--ship-bg-elevated)_94%,transparent)] py-2 text-sm text-[var(--ship-ink)]"
        >
          <p className="mx-auto max-w-6xl px-4 text-left">
            Could not restore the previous save ({error}). Starting fresh —
            export backups if you need them.
          </p>
        </div>
      ) : null}

      {view === 'save' ? (
        <SaveView />
      ) : view === 'achievements' ? (
        <AchievementsView />
      ) : view === 'credits' ? (
        <CreditsView />
      ) : (
        <PlayView />
      )}
    </div>
  );
}
