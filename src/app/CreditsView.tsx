import { CONTRIBUTOR_SKINS, contributorAvatarSrc } from '../data/contributors';

/**
 * Attribution for opt-in contributor skins — tribute framing, public avatars.
 */
export function CreditsView() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-10">
      <div className="max-w-lg text-left">
        <h1 className="text-lg font-semibold tracking-tight text-[var(--ship-ink)]">
          Credits
        </h1>
        <p className="mt-1 text-sm text-[var(--ship-muted)]">
          Office Dev skins celebrate people (and bots) who contribute to this
          repo. The pool is{' '}
          <span className="text-[var(--ship-ink)]">opt-in</span> — a homage, not
          a roast. Avatars ship as static public assets; missing files fall back
          to generic Dev glyphs in the office.
        </p>
      </div>

      <section
        aria-labelledby="contributor-skins-heading"
        className="text-left"
      >
        <h2
          id="contributor-skins-heading"
          className="text-sm font-semibold tracking-tight text-[var(--ship-ink)]"
        >
          Contributor skins
        </h2>
        <p className="mt-1 text-xs text-[var(--ship-muted)]">
          Hover a Dev in the office to see a name. Want in? Add yourself to{' '}
          <code className="rounded bg-[color-mix(in_srgb,var(--ship-ink)_6%,transparent)] px-1 py-0.5 text-[0.7rem]">
            public/contributors/opt-in.json
          </code>{' '}
          with consent, then run{' '}
          <code className="rounded bg-[color-mix(in_srgb,var(--ship-ink)_6%,transparent)] px-1 py-0.5 text-[0.7rem]">
            pnpm generate:contributors
          </code>
          .
        </p>

        {CONTRIBUTOR_SKINS.length === 0 ? (
          <p className="mt-3 text-sm text-[var(--ship-muted)]">
            No opt-in skins yet — the office uses generic Dev glyphs.
          </p>
        ) : (
          <ul className="mt-3 flex list-none flex-col gap-2 p-0 sm:grid sm:grid-cols-2 sm:gap-3">
            {CONTRIBUTOR_SKINS.map((skin) => (
              <li key={skin.id}>
                <article
                  className={[
                    'flex items-center gap-3 rounded-xl border border-[var(--ship-line)]',
                    'bg-[color-mix(in_srgb,var(--ship-bg-elevated)_88%,transparent)] px-3 py-2.5',
                  ].join(' ')}
                >
                  <img
                    className="size-10 shrink-0 rounded-lg border border-[var(--ship-line)] object-cover"
                    src={contributorAvatarSrc(skin)}
                    alt=""
                    width={40}
                    height={40}
                  />
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold tracking-tight text-[var(--ship-ink)]">
                      {skin.displayName}
                    </h3>
                    <p className="mt-0.5 text-xs text-[var(--ship-muted)]">
                      {skin.kind === 'bot' ? 'Joke bot skin' : 'Contributor'}
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
