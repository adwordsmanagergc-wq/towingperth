#!/usr/bin/env node
// Crawls the legacy Google Sites build of towingperth.com and writes a content
// inventory to /content-audit. Usage:
//   node scripts/crawl-old-site.mjs [--base https://www.towingperth.com] [--max 600]
import { mkdir, writeFile } from 'node:fs/promises';
import * as cheerio from 'cheerio';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => {
    if (a.startsWith('--')) acc.push([a.slice(2), all[i + 1]]);
    return acc;
  }, []),
);
const BASE = new URL(args.base ?? 'https://www.towingperth.com');
const MAX_PAGES = Number(args.max ?? 600);
const CONCURRENCY = 4;
const OUT_DIR = new URL('../content-audit/', import.meta.url);

// Seeds: the homepage plus every known section hub, so a gap in the nav
// can't hide a whole region from the crawl.
const SEEDS = [
  '/',
  '/home',
  '/home/dangerous-roads-in-perth',
  '/home/towing-northern-suburbs-perth',
  '/home/towing-eastern-suburbs-perth',
  '/home/towing-southern-suburbs-perth',
  '/home/towing-western-suburbs-perth',
  '/home/towing-south-eastern-suburbs-perth',
];

const hostOk = (h) => h.replace(/^www\./, '') === BASE.hostname.replace(/^www\./, '');

function normalise(href, from) {
  let u;
  try {
    u = new URL(href, from);
  } catch {
    return null;
  }
  if (!/^https?:$/.test(u.protocol) || !hostOk(u.hostname)) return null;
  // Skip Google Sites assets and non-page resources.
  if (/\.(png|jpe?g|gif|webp|svg|pdf|css|js|ico|xml|txt)$/i.test(u.pathname)) return null;
  if (u.pathname.startsWith('/_/') || u.pathname.startsWith('/u/')) return null;
  let path = decodeURIComponent(u.pathname).replace(/\/+$/, '') || '/';
  return path; // keep case: Google Sites paths are case-sensitive
}

const clean = (s) => (s ?? '').replace(/\s+/g, ' ').trim();

function extract(html, path) {
  const $ = cheerio.load(html);
  const title = clean($('title').first().text());
  const metaDescription = clean($('meta[name="description"]').attr('content'));
  const canonical = $('link[rel="canonical"]').attr('href') ?? '';
  const robots = $('meta[name="robots"]').attr('content') ?? '';
  const h1s = $('h1').map((_, el) => clean($(el).text())).get().filter(Boolean);
  const h2s = $('h2').map((_, el) => clean($(el).text())).get().filter(Boolean);

  const links = new Set();
  $('a[href]').each((_, el) => {
    const p = normalise($(el).attr('href'), new URL(path, BASE));
    if (p) links.add(p);
  });

  const images = $('img')
    .map((_, el) => ({ src: $(el).attr('src') ?? '', alt: clean($(el).attr('alt')) }))
    .get()
    .filter((i) => i.src && !i.src.startsWith('data:'));

  // Google Sites puts page content in role=main; fall back to <body> minus chrome.
  const $main = $('[role="main"]').first().length ? $('[role="main"]').first() : $('body');
  $main.find('script, style, noscript, nav, header, footer, [role="navigation"]').remove();
  // Keep paragraph breaks so the copy stays readable in pages.json.
  $main.find('p, h1, h2, h3, h4, li, br, div').each((_, el) => {
    $(el).append('\n');
  });
  const bodyText = $main
    .text()
    .split('\n')
    .map(clean)
    .filter(Boolean)
    .join('\n');

  return {
    title,
    metaDescription,
    canonical,
    robots,
    h1: h1s[0] ?? '',
    h1All: h1s,
    h2: h2s,
    bodyText,
    wordCount: bodyText.split(/\s+/).filter(Boolean).length,
    internalLinks: [...links].sort(),
    images,
  };
}

async function fetchPage(path) {
  const url = new URL(path, BASE).href;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, {
        redirect: 'manual',
        headers: { 'user-agent': 'QuikTow-site-migration-audit/1.0' },
      });
      if (res.status >= 300 && res.status < 400) {
        return { url, status: res.status, location: res.headers.get('location') ?? '', html: '' };
      }
      return { url, status: res.status, location: '', html: res.ok ? await res.text() : '' };
    } catch (err) {
      if (attempt === 3) return { url, status: 0, location: '', html: '', error: String(err) };
      await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
    }
  }
}

async function crawl() {
  const queue = [...SEEDS];
  const seen = new Set(queue);
  const pages = [];

  async function worker() {
    while (queue.length && pages.length < MAX_PAGES) {
      const path = queue.shift();
      const res = await fetchPage(path);
      const page = { path, url: res.url, status: res.status, redirectTo: '', error: res.error ?? '' };

      if (res.location) {
        const target = normalise(res.location, res.url);
        page.redirectTo = target ?? res.location;
        if (target && !seen.has(target)) {
          seen.add(target);
          queue.push(target);
        }
      }
      if (res.html) {
        Object.assign(page, extract(res.html, path));
        for (const link of page.internalLinks) {
          if (!seen.has(link)) {
            seen.add(link);
            queue.push(link);
          }
        }
      }
      pages.push(page);
      process.stdout.write(`\r${pages.length} crawled, ${queue.length} queued   `);
    }
  }

  // Workers can idle while others still discover links, so loop until drained.
  while (queue.length && pages.length < MAX_PAGES) {
    await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  }
  process.stdout.write('\n');
  return pages.sort((a, b) => a.path.localeCompare(b.path));
}

function section(path) {
  if (path === '/' || path === '/home') return 'home';
  if (path.startsWith('/home/dangerous-roads-in-perth') || /road|highway|hwy|freeway|drive|-dr$|-rd$/.test(path))
    return 'roads';
  const m = path.match(/towing-(northern|eastern|southern|western|south-eastern)-suburbs-perth/);
  if (m) return `region:${m[1]}`;
  return 'suburb-or-other';
}

// Word-shingle Jaccard similarity to catch near-duplicate copy.
function shingles(text, n = 5) {
  const w = text.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean);
  const out = new Set();
  for (let i = 0; i + n <= w.length; i++) out.add(w.slice(i, i + n).join(' '));
  return out;
}
function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const s of a) if (b.has(s)) inter++;
  return inter / (a.size + b.size - inter);
}

function findDuplicates(pages) {
  const ok = pages.filter((p) => p.status === 200);
  const inbound = new Map();
  for (const p of ok) for (const l of p.internalLinks ?? []) inbound.set(l, (inbound.get(l) ?? 0) + 1);
  for (const p of pages) p.inboundLinks = inbound.get(p.path) ?? 0;

  let groups = [];
  const byPath = new Map(ok.map((p) => [p.path, p]));

  // 1. Suffix duplicates: foo_1, foo-1, foo-2 alongside foo.
  for (const p of ok) {
    const base = p.path.replace(/[_-]\d+$/, '');
    if (base !== p.path && byPath.has(base)) {
      groups.push({ reason: 'numeric suffix', paths: [base, p.path] });
    }
  }
  // 2. Same slug under different parents (e.g. suburb listed in two regions).
  const bySlug = new Map();
  for (const p of ok) {
    const slug = p.path.split('/').pop();
    bySlug.set(slug, [...(bySlug.get(slug) ?? []), p.path]);
  }
  for (const [, paths] of bySlug) if (paths.length > 1) groups.push({ reason: 'same slug, different parent', paths });
  // 3. Identical titles.
  const byTitle = new Map();
  for (const p of ok) if (p.title) byTitle.set(p.title, [...(byTitle.get(p.title) ?? []), p.path]);
  for (const [, paths] of byTitle) if (paths.length > 1) groups.push({ reason: 'identical <title>', paths });
  // 4. Near-identical body copy (>= 90% shingle overlap).
  const sh = ok.map((p) => [p.path, shingles(p.bodyText ?? '')]);
  for (let i = 0; i < sh.length; i++)
    for (let j = i + 1; j < sh.length; j++) {
      const sim = jaccard(sh[i][1], sh[j][1]);
      if (sim >= 0.9) groups.push({ reason: `body copy ${(sim * 100).toFixed(0)}% identical`, paths: [sh[i][0], sh[j][0]] });
    }

  // Merge groups covering the same set of paths so each pair is reported once.
  const merged = new Map();
  for (const g of groups) {
    const key = [...g.paths].sort().join('|');
    const prev = merged.get(key);
    merged.set(key, prev ? { ...prev, reason: `${prev.reason}; ${g.reason}` } : g);
  }
  groups = [...merged.values()];

  // Winner: no numeric suffix, then most inbound links, then most words, then shortest path.
  for (const g of groups) {
    const ranked = g.paths
      .map((path) => byPath.get(path))
      .sort(
        (a, b) =>
          /[_-]\d+$/.test(a.path) - /[_-]\d+$/.test(b.path) ||
          b.inboundLinks - a.inboundLinks ||
          b.wordCount - a.wordCount ||
          a.path.length - b.path.length,
      );
    g.winner = ranked[0].path;
    g.losers = ranked.slice(1).map((p) => p.path);
  }

  // Junk: thin, empty, errored or noindexed pages.
  const junk = pages
    .filter((p) => p.status !== 200 || (p.wordCount ?? 0) < 80 || /noindex/i.test(p.robots ?? ''))
    .map((p) => ({
      path: p.path,
      status: p.status,
      wordCount: p.wordCount ?? 0,
      reason: p.status !== 200 ? `HTTP ${p.status}${p.redirectTo ? ' -> ' + p.redirectTo : ''}` : p.wordCount < 80 ? 'thin (<80 words)' : 'noindex',
    }));

  return { groups, junk };
}

const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;

async function main() {
  console.log(`Crawling ${BASE.href} (max ${MAX_PAGES} pages)`);
  const pages = await crawl();
  for (const p of pages) p.section = section(p.path);
  const { groups, junk } = findDuplicates(pages);
  const dupOf = new Map();
  for (const g of groups) for (const l of g.losers) if (!dupOf.has(l)) dupOf.set(l, g.winner);

  await mkdir(OUT_DIR, { recursive: true });
  const header = ['url', 'path', 'status', 'redirect_to', 'section', 'title', 'h1', 'meta_description', 'word_count', 'inbound_links', 'duplicate_of'];
  const rows = pages.map((p) =>
    [p.url, p.path, p.status, p.redirectTo, p.section, p.title, p.h1, p.metaDescription, p.wordCount ?? 0, p.inboundLinks, dupOf.get(p.path) ?? '']
      .map(csvCell)
      .join(','),
  );
  await writeFile(new URL('urls.csv', OUT_DIR), [header.join(','), ...rows].join('\n') + '\n');
  await writeFile(new URL('pages.json', OUT_DIR), JSON.stringify(pages, null, 2));
  await writeFile(new URL('duplicates.json', OUT_DIR), JSON.stringify({ groups, junk }, null, 2));

  const count = (fn) => pages.filter(fn).length;
  const sections = [...new Set(pages.map((p) => p.section))].sort();
  const summary = [
    `# Content audit: ${BASE.host}`,
    '',
    `Crawled ${new Date().toISOString()}`,
    '',
    `- Total URLs: ${pages.length}`,
    `- 200 OK: ${count((p) => p.status === 200)}`,
    `- Redirects: ${count((p) => p.status >= 300 && p.status < 400)}`,
    `- Errors: ${count((p) => p.status >= 400 || p.status === 0)}`,
    '',
    '## By section',
    '',
    ...sections.map((s) => `- ${s}: ${count((p) => p.section === s)}`),
    '',
    `## Duplicate groups (${groups.length})`,
    '',
    ...groups.map((g) => `- ${g.reason}: keep \`${g.winner}\`, redirect ${g.losers.map((l) => `\`${l}\``).join(', ')}`),
    '',
    `## Junk / thin (${junk.length})`,
    '',
    ...junk.map((j) => `- \`${j.path}\`: ${j.reason}`),
    '',
  ].join('\n');
  await writeFile(new URL('SUMMARY.md', OUT_DIR), summary);
  console.log(summary);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
