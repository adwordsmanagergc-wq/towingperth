#!/usr/bin/env node
// Lints suburb and road content: word counts, banned punctuation and phrases,
// valid references, and sentences copied between pages (doorway-page risk).
//   node scripts/check-content.mjs [slug ...]   (no args = check everything)
import { readFile, readdir } from 'node:fs/promises';

const ROOT = new URL('../src/content/', import.meta.url);
const index = JSON.parse(await readFile(new URL('./data/suburb-index.json', import.meta.url), 'utf8'));
const suburbSlugs = new Set(index.map((s) => s.slug));
const roadSlugs = new Set((await readdir(new URL('roads/', ROOT)).catch(() => [])).map((f) => f.replace(/\.md$/, '')));
const KNOWN_PATHS = new Set([
  '/services/accident-towing-perth',
  '/services/breakdown-towing-perth',
  '/services/4wd-recovery-perth',
  '/services/container-transport-perth',
  '/services/vehicle-transport-perth',
  '/insurance-towing',
  '/contact',
  '/roads',
  '/areas',
  '/faq',
  '/about',
  ...['northern', 'southern', 'eastern', 'western', 'south-eastern'].map((r) => `/areas/${r}-suburbs`),
]);
const ROAD_PAGES = [
  'albany-highway', 'baldivis-road', 'canning-highway', 'garden-city', 'great-eastern-highway', 'hislop-road',
  'joondalup-drive', 'kulija-road', 'mitchell-freeway', 'nicholson-road', 'ranford-road', 'rome-road', 'wanneroo-road',
];
for (const r of ROAD_PAGES) KNOWN_PATHS.add(`/roads/${r}`);
// Compact keyword landing pages declare their own URL in front matter.
KNOWN_PATHS.add('/towing');
for (const f of (await readdir(new URL('landings/', ROOT)).catch(() => [])).filter((f) => f.endsWith('.md'))) {
  const url = (await readFile(new URL(`landings/${f}`, ROOT), 'utf8')).match(/^url:\s*(\S+)/m)?.[1];
  if (url) KNOWN_PATHS.add(url);
}

// Prices are banned, except $3,000 (the WA crash-reporting damage threshold).
const BANNED = [
  /—|–/, // em and en dashes
  /look no further/i, /second to none/i, /one-stop shop/i, /pride ourselves/i, /rest assured/i, /seamless/i,
  /hassle-free/i, /unparalleled/i, /fast-paced/i, /towing perth services/i, /tow truck perth services/i,
  /within \d+ minutes/i, /\d+ ?(?:to|-) ?\d+ minutes/i, /\$(?!3,000\b)\d/, /years? (?:of )?experience/i, /\bstars?\b.*review/i,
  /based in/i, /our (?:depot|yard) (?:in|at)/i,
];

function parse(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return null;
  return { fm: m[1], body: m[2] };
}
const words = (s) => s.replace(/[#*_>\-\[\]()]/g, ' ').split(/\s+/).filter(Boolean).length;
const sentences = (s) =>
  s
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .split(/(?<=[.?!])\s+/)
    .map((x) => x.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim())
    .filter((x) => x.split(' ').length >= 8);

const only = new Set(process.argv.slice(2));
const errors = [];
const warn = [];
const sentenceOwners = new Map();

async function checkDir(dir, kind) {
  const files = (await readdir(new URL(`${dir}/`, ROOT)).catch(() => [])).filter((f) => f.endsWith('.md'));
  for (const f of files) {
    const slug = f.replace(/\.md$/, '');
    const raw = await readFile(new URL(`${dir}/${f}`, ROOT), 'utf8');
    const p = parse(raw);
    const where = `${dir}/${f}`;
    if (!p) {
      errors.push(`${where}: missing front matter`);
      continue;
    }
    // Copied-sentence index covers every page so new pages are compared to old ones.
    const prose = [p.body, ...[...p.fm.matchAll(/^\s*(?:intro|a|lead):\s*(.+)$/gm)].map((m) => m[1])].join('\n');
    for (const s of new Set(sentences(prose.replaceAll(slug.replace(/-/g, ' '), 'X')))) {
      sentenceOwners.set(s, [...(sentenceOwners.get(s) ?? []), where]);
    }
    if (only.size && !only.has(slug)) continue;

    const text = p.fm + '\n' + p.body;
    for (const re of BANNED) {
      const hit = text.match(re);
      if (hit) errors.push(`${where}: banned pattern ${re} -> "${hit[0]}"`);
    }
    const relatedLinks = kind === 'landing' ? (p.fm.match(/^related:\s*\[(.*)\]/m)?.[1] ?? '').split(',').map((x) => x.trim()).filter(Boolean) : [];
    for (const href of relatedLinks) {
      const ok = KNOWN_PATHS.has(href) || (href.startsWith('/areas/') && suburbSlugs.has(href.slice(7)));
      if (!ok) errors.push(`${where}: unknown related link ${href}`);
    }
    for (const [, href] of text.matchAll(/\]\((\/[^)\s#]*)/g)) {
      const ok = KNOWN_PATHS.has(href) || (href.startsWith('/areas/') && suburbSlugs.has(href.slice(7)));
      if (!ok) errors.push(`${where}: unknown link ${href}`);
    }
    if (kind === 'suburb') {
      if (!suburbSlugs.has(slug)) errors.push(`${where}: slug not in suburb-index.json`);
      const nearby = [...p.fm.matchAll(/^nearby:\n((?:\s+- .+\n)+)/gm)][0]?.[1].match(/- (.+)/g)?.map((x) => x.slice(2).trim()) ?? [];
      for (const n of nearby) if (!suburbSlugs.has(n)) errors.push(`${where}: nearby "${n}" is not a suburb slug`);
      if (nearby.includes(slug)) errors.push(`${where}: lists itself as nearby`);
      const entry = index.find((s) => s.slug === slug);
      const region = p.fm.match(/^region:\s*(.+)$/m)?.[1].trim();
      if (entry && region !== entry.region) errors.push(`${where}: region "${region}" should be "${entry.region}"`);
      const intro = p.fm.match(/^intro:\s*(.+)$/m)?.[1] ?? '';
      const faqWords = [...p.fm.matchAll(/^\s+(?:- q|a):\s*(.+)$/gm)].reduce((n, m) => n + words(m[1]), 0);
      const total = words(intro) + words(p.body) + faqWords;
      if (total < 350) errors.push(`${where}: ${total} words of copy (min 350)`);
      if (total > 700) warn.push(`${where}: ${total} words of copy (aim for 600 or fewer)`);
      const h2 = (p.body.match(/^## /gm) ?? []).length;
      if (h2 < 3) errors.push(`${where}: ${h2} H2 sections (expected 3)`);
      if (/^# /m.test(p.body)) errors.push(`${where}: body must not contain an H1`);
    }
  }
}

await checkDir('suburbs', 'suburb');
await checkDir('roads', 'road');
await checkDir('landings', 'landing');

for (const [s, owners] of sentenceOwners) {
  const uniq = [...new Set(owners)];
  if (uniq.length > 1 && (!only.size || uniq.some((o) => only.has(o.split('/')[1].replace(/\.md$/, ''))))) {
    errors.push(`shared sentence in ${uniq.join(', ')}: "${s.slice(0, 90)}..."`);
  }
}

const existing = new Set((await readdir(new URL('suburbs/', ROOT)).catch(() => [])).map((f) => f.replace(/\.md$/, '')));
const missing = index.filter((s) => !existing.has(s.slug)).map((s) => s.slug);

for (const w of warn) console.log('warn ', w);
for (const e of errors) console.log('ERROR', e);
console.log(`\n${existing.size}/${index.length} suburb pages written, ${roadSlugs.size} road pages. ${errors.length} errors, ${warn.length} warnings.`);
if (!only.size && missing.length) console.log(`Missing: ${missing.join(', ')}`);
process.exit(errors.length ? 1 : 0);
