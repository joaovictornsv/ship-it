#!/usr/bin/env node
/**
 * Bake static contributor avatar PNGs from the opt-in consent list.
 *
 * Reads `public/contributors/opt-in.json`, downloads public GitHub avatars
 * (no API token; `https://github.com/{login}.png`), writes
 * `public/contributors/avatars/{id}.png`.
 *
 * Usage: pnpm generate:contributors
 * Never put tokens in VITE_* / client env — this script needs none.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const OPT_IN = resolve(process.cwd(), 'public/contributors/opt-in.json');
const OUT_DIR = resolve(process.cwd(), 'public/contributors/avatars');
const AVATAR_SIZE = 128;

type OptInEntry = {
  login: string;
  displayName: string;
  kind: 'human' | 'bot';
};

type OptInFile = {
  contributors: OptInEntry[];
};

function safeId(login: string): string {
  return login.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-|-$/g, '');
}

async function downloadAvatar(login: string, outPath: string): Promise<void> {
  const url = `https://github.com/${encodeURIComponent(login)}.png?size=${AVATAR_SIZE}`;
  const response = await fetch(url, {
    headers: { 'User-Agent': 'ship-it-generate-contributors' },
    redirect: 'follow',
  });
  if (!response.ok) {
    throw new Error(
      `Avatar fetch failed for ${login} (${response.status}) from ${url}`,
    );
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  writeFileSync(outPath, buffer);
}

async function main(): Promise<void> {
  const raw = readFileSync(OPT_IN, 'utf8');
  const data = JSON.parse(raw) as OptInFile;
  if (!Array.isArray(data.contributors)) {
    throw new Error('opt-in.json must contain a contributors array');
  }

  mkdirSync(OUT_DIR, { recursive: true });

  for (const entry of data.contributors) {
    const id = safeId(entry.login);
    if (!id) {
      throw new Error(`Invalid login: ${JSON.stringify(entry.login)}`);
    }
    const outPath = resolve(OUT_DIR, `${id}.png`);
    process.stdout.write(`Fetching ${entry.login} → ${id}.png … `);
    await downloadAvatar(entry.login, outPath);
    process.stdout.write('ok\n');
  }

  console.log(
    `Done. ${data.contributors.length} avatar(s) in public/contributors/avatars/.`,
  );
  console.log(
    'Keep src/data/contributors.ts in sync with opt-in.json (ids + display names).',
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
