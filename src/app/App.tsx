import {
  SaveUntrustedBanner,
  useAutosave,
  useHydrateSave,
} from '../features/save';
import { TokensBank } from '../features/click';
import { useProductionTick } from '../features/shop';
import { PlayView } from './PlayView';
import { SaveView } from './SaveView';
import { useAppView } from './useAppView';

const navLinkClass =
  'rounded-lg px-2 py-1 text-sm font-semibold text-[var(--ship-accent-deep)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ship-accent)]';

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
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-[var(--ship-line)] bg-[color-mix(in_srgb,var(--ship-bg-elevated)_82%,transparent)] px-4 py-3 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="text-lg font-semibold tracking-tight text-[var(--ship-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ship-accent)]"
              onClick={() => setView('play')}
            >
              Ship It
            </button>
            {view === 'play' ? (
              <button
                type="button"
                className={navLinkClass}
                onClick={() => setView('save')}
              >
                Save
              </button>
            ) : (
              <button
                type="button"
                className={navLinkClass}
                onClick={() => setView('play')}
              >
                Back to play
              </button>
            )}
          </div>
          <TokensBank />
        </div>
      </header>

      <SaveUntrustedBanner />

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

      {view === 'save' ? <SaveView /> : <PlayView />}
    </div>
  );
}
