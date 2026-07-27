# Ship It

Developer-themed incremental game — ship software, earn tokens, grow the office.

![Ship It gameplay — office desk farm with room tabs, token bank, and shop](./docs/assets/gameplay.png)

## Quick start

```bash
pnpm install
pnpm dev
```

Open the Vite URL (usually `http://localhost:5173`). HTML title is **Ship It**.

## Scripts

| Script                              | Purpose                                |
| ----------------------------------- | -------------------------------------- |
| `pnpm dev`                          | Vite dev server                        |
| `pnpm build`                        | Typecheck + production build → `dist/` |
| `pnpm preview`                      | Preview production build               |
| `pnpm lint`                         | ESLint                                 |
| `pnpm format` / `pnpm format:check` | Prettier                               |
| `pnpm typecheck`                    | TypeScript project references          |
| `pnpm test`                         | Vitest (unit)                          |

Node **≥24** suggested (`engines`). CI uses Node 24 + pnpm frozen lockfile.

## Docs

- [`docs/PRODUCT.md`](./docs/PRODUCT.md) — product / fantasy / economy decisions
- [`docs/TECHNICAL.md`](./docs/TECHNICAL.md) — stack / architecture / deploy
- [`docs/ISSUES.md`](./docs/ISSUES.md) — sequenced GitHub roadmap
- [`docs/modules/`](./docs/modules/) — living module docs
- [`AGENTS.md`](./AGENTS.md) — agent entrypoint
- [`REVIEW.md`](./REVIEW.md) — coding / review standards

## Deploy

Staging deploys to Quave Cloud env **`joaovictornsv-ship-it-staging`** on every push to `main` (and via **Actions → Deploy staging → Run workflow**).

| Piece       | Detail                                                                       |
| ----------- | ---------------------------------------------------------------------------- |
| Workflow    | [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml)             |
| Action      | `zcloud-ws/zcloud-deploy-action@main`                                        |
| Secret      | `QUAVE_CLOUD_ENV_TOKEN` (repo Actions secret; env-scoped Quave token)        |
| Image       | `Dockerfile` + `httpd.conf` (`lipanski/docker-static-website`, SPA fallback) |
| Staging URL | https://ship-it-staging-joaovictornsv.svc-us5.zcloud.ws/ (no custom domain)  |

Local preview of the static image:

```bash
pnpm build
docker build -t ship-it:local .
docker run --rm -p 3000:3000 ship-it:local
```

## License

[MIT](./LICENSE)
