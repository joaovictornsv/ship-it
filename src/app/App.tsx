export function App() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-black/10 px-4 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <p className="text-lg font-semibold tracking-tight">Ship It</p>
          <p className="text-sm text-black/60" aria-live="polite">
            0 beans
          </p>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-4 px-4 py-10 text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Ship It
        </h1>
        <p className="max-w-md text-base text-black/70">
          Coffee-bean incremental scaffold. The click loop lands next.
        </p>
        <button
          type="button"
          className="rounded-lg bg-[var(--ship-accent)] px-8 py-4 text-lg font-semibold text-white shadow-sm transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ship-accent)]"
          disabled
          aria-disabled="true"
        >
          Ship It
        </button>
        <p className="text-xs text-black/50">Coming in issue #3</p>
      </main>
    </div>
  );
}
