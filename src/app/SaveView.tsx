import { SaveControls } from '../features/save';

/** Dedicated export / import screen; autosave still runs in the shell. */
export function SaveView() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center gap-4 px-4 py-10">
      <div className="w-full max-w-md text-left">
        <h1 className="text-lg font-semibold tracking-tight text-[var(--ship-ink)]">
          Save
        </h1>
        <p className="mt-1 max-w-sm text-sm text-[var(--ship-muted)]">
          Export a backup or import a previous run. Autosave keeps running while
          you play.
        </p>
      </div>
      <SaveControls />
    </main>
  );
}
