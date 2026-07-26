import { BeansBank, ShipItButton } from '../features/click';
import { EspressoBuyRow, useProductionTick } from '../features/shop';

export function App() {
  useProductionTick();

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-black/10 px-4 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <p className="text-lg font-semibold tracking-tight">Ship It</p>
          <BeansBank />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-8 px-4 py-10 text-center">
        <div className="flex flex-col items-center gap-2">
          <h1 className="sr-only">Ship It</h1>
          <p className="max-w-sm text-base text-black/65">
            Click to earn coffee beans. Buy an Espresso machine for beans/s.
          </p>
        </div>
        <ShipItButton />
        <EspressoBuyRow />
      </main>
    </div>
  );
}
