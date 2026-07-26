import { BeansBank, ShipItButton } from '../features/click';

export function App() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-black/10 px-4 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <p className="text-lg font-semibold tracking-tight">Ship It</p>
          <BeansBank />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-6 px-4 py-10 text-center">
        <div className="flex flex-col items-center gap-2">
          <h1 className="sr-only">Ship It</h1>
          <p className="max-w-sm text-base text-black/65">
            Click to earn coffee beans.
          </p>
        </div>
        <ShipItButton />
      </main>
    </div>
  );
}
