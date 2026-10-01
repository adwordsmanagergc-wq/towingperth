#!/usr/bin/env node
// Checks every legacy URL from content-audit/urls.csv returns a 301 to a page that returns 200.
//   node scripts/test-redirects.mjs [--base https://preview-url.vercel.app]
// Default base is the local Vercel-like server (node scripts/serve-vercel-like.mjs).
import { legacyPaths } from './generate-redirects.mjs';
import { newPathFor } from './lib/legacy-map.mjs';

const i = process.argv.indexOf('--base');
const BASE = (i > -1 ? process.argv[i + 1] : 'http://localhost:4322').replace(/\/$/, '');

const paths = await legacyPaths();
const failures = [];
let ok = 0;
const checked = new Map();

async function status(url, opts = {}) {
  const res = await fetch(url, { redirect: 'manual', ...opts });
  return { code: res.status, location: res.headers.get('location') };
}

for (const path of paths) {
  const expected = path === '/' ? null : newPathFor(path);
  // The root is the new homepage itself: it must be a 200, not a redirect.
  if (path === '/') {
    const r = await status(BASE + '/');
    r.code === 200 ? ok++ : failures.push(`/ -> expected 200, got ${r.code}`);
    continue;
  }
  const r = await status(BASE + path);
  if (r.code !== 301) {
    failures.push(`${path} -> expected 301, got ${r.code}`);
    continue;
  }
  const dest = new URL(r.location, BASE);
  if (dest.pathname !== expected) {
    failures.push(`${path} -> redirected to ${dest.pathname}, expected ${expected}`);
    continue;
  }
  if (!checked.has(dest.pathname)) checked.set(dest.pathname, (await status(dest.href)).code);
  const code = checked.get(dest.pathname);
  if (code !== 200) failures.push(`${path} -> ${dest.pathname} returned ${code} (expected 200, no chains)`);
  else ok++;
}

for (const f of failures) console.log('FAIL', f);
console.log(`\n${ok}/${paths.length} legacy URLs OK (${checked.size} distinct destinations). ${failures.length} failures. Base: ${BASE}`);
process.exit(failures.length ? 1 : 0);
