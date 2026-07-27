import { useEffect, useId, useRef, useState } from 'react';
import { Medal, Menu, Save, Users, X } from 'lucide-react';
import { DESKTOP_MEDIA_QUERY } from './breakpoints';
import type { AppView } from './appView';
import { useMediaQuery } from './useMediaQuery';

type AppHeaderProps = {
  view: AppView;
  setView: (view: AppView) => void;
};

const iconNavClass =
  'inline-flex size-9 items-center justify-center rounded-lg text-[var(--ship-accent-deep)] hover:bg-[color-mix(in_srgb,var(--ship-ink)_6%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ship-accent)]';

const drawerItemClass =
  'flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold tracking-tight text-[var(--ship-ink)] hover:bg-[color-mix(in_srgb,var(--ship-ink)_6%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ship-accent)]';

/**
 * Shell nav: full header bar at `lg+`; below `lg` a floating Menu opens a
 * right-side drawer so the play column keeps vertical space.
 */
export function AppHeader({ view, setView }: AppHeaderProps) {
  const isDesktop = useMediaQuery(DESKTOP_MEDIA_QUERY);
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Close when crossing to desktop so a leftover open flag cannot reopen on shrink.
  if (isDesktop && open) {
    setOpen(false);
  }

  const drawerOpen = open && !isDesktop;

  useEffect(() => {
    if (!drawerOpen) {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      trigger?.focus();
    };
  }, [drawerOpen]);

  function go(next: AppView) {
    setView(next);
    setOpen(false);
  }

  if (isDesktop) {
    return (
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
                aria-label="Credits"
                onClick={() => setView('credits')}
              >
                <Users className="size-5" strokeWidth={2} aria-hidden />
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
    );
  }

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-30 flex justify-end px-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <button
          ref={triggerRef}
          type="button"
          className={[
            'pointer-events-auto inline-flex size-11 items-center justify-center rounded-xl',
            'border border-[var(--ship-line)]',
            'bg-[color-mix(in_srgb,var(--ship-bg-elevated)_94%,transparent)]',
            'text-[var(--ship-ink)] shadow-[0_4px_16px_color-mix(in_srgb,var(--ship-ink)_10%,transparent)]',
            'backdrop-blur-sm',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ship-accent)]',
          ].join(' ')}
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-label="Menu"
          onClick={() => setOpen(true)}
        >
          <Menu className="size-5" strokeWidth={2} aria-hidden />
        </button>
      </div>

      {drawerOpen ? (
        <div className="fixed inset-0 z-40" role="presentation">
          <button
            type="button"
            className="absolute inset-0 bg-[color-mix(in_srgb,var(--ship-ink)_40%,transparent)]"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={[
              'app-menu-drawer absolute inset-y-0 right-0 flex w-[min(20rem,88vw)] flex-col',
              'border-l border-[var(--ship-line)] bg-[var(--ship-bg-elevated)]',
              'shadow-[-8px_0_32px_color-mix(in_srgb,var(--ship-ink)_12%,transparent)]',
              'pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))]',
            ].join(' ')}
          >
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--ship-line)] px-4 py-3">
              <h2
                id={titleId}
                className="text-base font-semibold tracking-tight text-[var(--ship-ink)]"
              >
                Menu
              </h2>
              <button
                ref={closeRef}
                type="button"
                className={[
                  'inline-flex size-10 shrink-0 items-center justify-center rounded-lg',
                  'border border-[var(--ship-line)] text-[var(--ship-ink)]',
                  'hover:bg-[color-mix(in_srgb,var(--ship-ink)_6%,transparent)]',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ship-accent)]',
                ].join(' ')}
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              >
                <X className="size-5" strokeWidth={2} aria-hidden />
              </button>
            </div>

            <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-3 py-3">
              <button
                type="button"
                className={drawerItemClass}
                onClick={() => go('play')}
              >
                <span className="text-base font-semibold tracking-tight">
                  Ship It
                </span>
                {view !== 'play' ? (
                  <span className="ml-auto text-xs font-medium text-[var(--ship-muted)]">
                    Back to play
                  </span>
                ) : null}
              </button>
              <button
                type="button"
                className={drawerItemClass}
                aria-current={view === 'achievements' ? 'page' : undefined}
                onClick={() => go('achievements')}
              >
                <Medal
                  className="size-5 shrink-0 text-[var(--ship-accent)]"
                  strokeWidth={2}
                  aria-hidden
                />
                Achievements
              </button>
              <button
                type="button"
                className={drawerItemClass}
                aria-current={view === 'credits' ? 'page' : undefined}
                onClick={() => go('credits')}
              >
                <Users
                  className="size-5 shrink-0 text-[var(--ship-accent)]"
                  strokeWidth={2}
                  aria-hidden
                />
                Credits
              </button>
              <button
                type="button"
                className={drawerItemClass}
                aria-current={view === 'save' ? 'page' : undefined}
                onClick={() => go('save')}
              >
                <Save
                  className="size-5 shrink-0 text-[var(--ship-accent)]"
                  strokeWidth={2}
                  aria-hidden
                />
                Save
              </button>
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}
