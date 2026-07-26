#!/usr/bin/env node
/**
 * Print title + body material for one docs/ISSUES.md roadmap section.
 * Usage: node --experimental-strip-types scripts/gh-issue-from-roadmap.ts <N>
 * Does not call `gh` — the gh-issue skill creates the issue after review.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const n = Number(process.argv[2]);
if (!Number.isFinite(n) || n < 1) {
  console.error('Usage: gh-issue-from-roadmap.ts <issue-number>');
  process.exit(1);
}

const issuesPath = resolve(process.cwd(), 'docs/ISSUES.md');
const md = readFileSync(issuesPath, 'utf8');

const headingRe = /^### (\d+)\.\s+(.+)$/gm;
const headings: { num: number; title: string; index: number }[] = [];
for (const match of md.matchAll(headingRe)) {
  headings.push({
    num: Number(match[1]),
    title: match[2] ?? '',
    index: match.index ?? 0,
  });
}

const start = headings.find((h) => h.num === n);
if (!start) {
  console.error(`No ### ${n}. section in docs/ISSUES.md`);
  process.exit(1);
}

const startIdx = headings.indexOf(start);
const end =
  startIdx + 1 < headings.length
    ? headings[startIdx + 1]!.index
    : md.indexOf('\n## Deferred');
const section = md.slice(start.index, end === -1 ? undefined : end).trim();

const why = section.match(/\*\*Why now:\*\*\s*([\s\S]*?)(?=\n\*\*Scope\*\*)/);
const scope = section.match(/\*\*Scope\*\*\n\n([\s\S]*?)(?=\n\*\*Acceptance)/);
const acceptance = section.match(
  /\*\*Acceptance criteria\*\*\n\n([\s\S]*?)(?=\n\*\*Depends on:\*\*)/,
);
const depends = section.match(/\*\*Depends on:\*\*\s*(.+)/);
const modules = section.match(/\*\*Module docs:\*\*\s*(.+)/);

const body = `## Why now

${(why?.[1] ?? '').trim()}

## Scope

${(scope?.[1] ?? '').trim()}

## Acceptance criteria

${(acceptance?.[1] ?? '').trim()}

## Depends on

${(depends?.[1] ?? '—').trim()}

## Module docs

${(modules?.[1] ?? '—').trim()}

## Source

\`docs/ISSUES.md\` §${n}
`;

process.stdout.write(
  JSON.stringify(
    {
      number: n,
      title: start.title.trim(),
      body,
    },
    null,
    2,
  ) + '\n',
);
