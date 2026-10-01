#!/usr/bin/env node
// Builds scripts/data/suburb-index.json (slug, name, region, legacy paths) from the crawl.
import { readFile, writeFile } from 'node:fs/promises';
import { EXTRA_SUBURBS, NEW_SUBURBS, REGION_MAP, REGION_OVERRIDES, newPathFor, suburbName } from './lib/legacy-map.mjs';

const pages = JSON.parse(await readFile('content-audit/pages.json', 'utf8'));
const bySlug = new Map();
for (const p of pages) {
  const target = newPathFor(p.path);
  const m = p.path.match(/^\/home\/([a-z-]+)\/./);
  if (!target?.startsWith('/areas/') || !m || !REGION_MAP[m[1]]) continue;
  const slug = target.slice('/areas/'.length);
  const entry = bySlug.get(slug) ?? { slug, name: suburbName(slug), region: REGION_OVERRIDES[slug] ?? REGION_MAP[m[1]], legacyPaths: [] };
  entry.legacyPaths.push(p.path);
  bySlug.set(slug, entry);
}
for (const e of [...EXTRA_SUBURBS, ...NEW_SUBURBS]) bySlug.set(e.slug, { ...e, name: suburbName(e.slug), legacyPaths: [] });
const list = [...bySlug.values()].sort((a, b) => a.slug.localeCompare(b.slug));
await writeFile('scripts/data/suburb-index.json', JSON.stringify(list, null, 2) + '\n');
const counts = list.reduce((acc, s) => ((acc[s.region] = (acc[s.region] ?? 0) + 1), acc), {});
console.log(list.length, 'suburbs', counts);
