import {
  SaveControls,
  SaveUntrustedBanner,
  useAutosave,
  useHydrateSave,
} from '../features/save';
import { ShipItButton, TokensBank } from '../features/click';
import { ShopRail, useProductionTick } from '../features/shop';

export function App() {
  const { ready, error } = useHydrateSave();
  useAutosave(ready);
  useProductionTick(ready);

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
          <p className="text-lg font-semibold tracking-tight text-[var(--ship-ink)]">
            Ship It
          </p>
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

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-10 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
        <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center lg:min-h-[min(70vh,36rem)]">
          <div className="flex flex-col items-center gap-2">
            <h1 className="sr-only">Ship It</h1>
            <p className="max-w-sm text-base text-[var(--ship-muted)]">
              Click to earn tokens. Hire Devs and buy tools for tokens/s.
            </p>
          </div>
          <ShipItButton />
          <SaveControls />
        </div>
        <ShopRail />
      </main>
    </div>
  );
}
