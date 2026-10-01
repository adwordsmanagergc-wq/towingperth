#!/usr/bin/env node
// Writes a 301 for every legacy URL in content-audit/urls.csv into vercel.json.
// Fails if any legacy URL has no mapping, so nothing can silently 404.
import { readFile, writeFile } from 'node:fs/promises';
import { newPathFor } from './lib/legacy-map.mjs';

function parseCsv(text) {
  const rows = [];
  for (const line of text.trim().split('\n')) {
    const cells = [];
    let cur = '';
    let q = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (q) {
        if (c === '"' && line[i + 1] === '"') (cur += '"'), i++;
        else if (c === '"') q = false;
        else cur += c;
      } else if (c === '"') q = true;
      else if (c === ',') cells.push(cur), (cur = '');
      else cur += c;
    }
    cells.push(cur);
    rows.push(cells);
  }
  const [header, ...data] = rows;
  return data.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i]])));
}

export async function legacyPaths() {
  const rows = parseCsv(await readFile(new URL('../content-audit/urls.csv', import.meta.url), 'utf8'));
  return rows.map((r) => r.path);
}

const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  const redirects = [];
  const unmapped = [];
  for (const path of await legacyPaths()) {
    if (path === '/') continue; // root stays the homepage
    const destination = newPathFor(path);
    if (!destination) unmapped.push(path);
    else redirects.push({ source: path, destination, statusCode: 301 });
  }
  if (unmapped.length) {
    console.error('No mapping for:\n' + unmapped.join('\n'));
    process.exit(1);
  }
  const file = new URL('../vercel.json', import.meta.url);
  const config = JSON.parse(await readFile(file, 'utf8'));
  config.redirects = redirects.sort((a, b) => a.source.localeCompare(b.source));
  await writeFile(file, JSON.stringify(config, null, 2) + '\n');
  console.log(`Wrote ${redirects.length} redirects to vercel.json`);
}
