#!/usr/bin/env node
/**
 * Build-time snapshot of open issues on joaovictornsv/ship-it.
 *
 * Writes public-safe fields only (`number`, `title`) into
 * `src/data/openIssues.ts` for office talk bubbles.
 *
 * Auth (optional): set `SHIP_IT_GITHUB_TOKEN` (fine-grained Issues read-only)
 * or rely on unauthenticated public API (lower rate limit).
 *
 * Usage: pnpm snapshot:issues
 * Never put the token in VITE_* / client env.
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const OWNER = 'joaovictornsv';
const REPO = 'ship-it';
const OUT = resolve(process.cwd(), 'src/data/openIssues.ts');

type GhIssue = {
  number: number;
  title: string;
  pull_request?: unknown;
};

type SnapshotIssue = {
  number: number;
  title: string;
};

async function fetchOpenIssues(
  token: string | undefined,
): Promise<SnapshotIssue[]> {
  const issues: SnapshotIssue[] = [];
  let page = 1;

  while (page <= 10) {
    const url = new URL(`https://api.github.com/repos/${OWNER}/${REPO}/issues`);
    url.searchParams.set('state', 'open');
    url.searchParams.set('per_page', '100');
    url.searchParams.set('page', String(page));

    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'ship-it-issue-snapshot',
      'X-GitHub-Api-Version': '2022-11-28',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, { headers });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `GitHub Issues API failed (${response.status}): ${body.slice(0, 200)}`,
      );
    }

    const batch = (await response.json()) as GhIssue[];
    if (batch.length === 0) {
      break;
    }

    for (const item of batch) {
      // Issues endpoint also returns PRs — skip those.
      if (item.pull_request !== undefined) {
        continue;
      }
      issues.push({
        number: item.number,
        title: item.title.trim(),
      });
    }

    if (batch.length < 100) {
      break;
    }
    page += 1;
  }

  return issues.sort((a, b) => a.number - b.number);
}

function renderModule(issues: SnapshotIssue[], fetchedAt: string): string {
  const rows = issues
    .map(
      (issue) =>
        `  { number: ${issue.number}, title: ${JSON.stringify(issue.title)} },`,
    )
    .join('\n');

  return `/**
 * Build-time snapshot of open GitHub issues for office talk bubbles.
 * Regenerate with \`pnpm snapshot:issues\` (server/CI only — no client token).
 *
 * Fetched at: ${fetchedAt}
 * Source: ${OWNER}/${REPO} open issues (public fields only).
 */

export type OpenIssueSnapshot = {
  number: number;
  title: string;
};

export const OPEN_ISSUES_FETCHED_AT = ${JSON.stringify(fetchedAt)} as const;

export const OPEN_ISSUES_SNAPSHOT: readonly OpenIssueSnapshot[] = [
${rows}
];
`;
}

const token = process.env.SHIP_IT_GITHUB_TOKEN?.trim() || undefined;
const fetchedAt = new Date().toISOString();

const issues = await fetchOpenIssues(token);
writeFileSync(OUT, renderModule(issues, fetchedAt), 'utf8');
console.log(
  `Wrote ${issues.length} open issue(s) to ${OUT}` +
    (token ? ' (authenticated)' : ' (unauthenticated)'),
);
