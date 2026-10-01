#!/usr/bin/env node
// Post-build audit of dist/: per-page SEO rules, internal links and JSON-LD
// checked against the official schema.org vocabulary (types exist, every
// property is valid for its type or a supertype), plus Google's required
// fields for the rich result types we use.
//   npm run build && node scripts/validate-site.mjs
import { readFile, readdir, writeFile, access } from 'node:fs/promises';
import { join, relative } from 'node:path';
import * as cheerio from 'cheerio';

const DIST = new URL('../dist/', import.meta.url).pathname;
const VOCAB = new URL('./data/schemaorg.jsonld', import.meta.url);
const SITE = 'https://www.towingperth.com';
const UTILITY = new Set(['/404', '/quote-sent']);

// ---- schema.org vocabulary ----------------------------------------------
try {
  await access(VOCAB);
} catch {
  const r = await fetch('https://schema.org/version/latest/schemaorg-current-https.jsonld');
  await writeFile(VOCAB, await r.text());
}
const vocab = JSON.parse(await readFile(VOCAB, 'utf8'))['@graph'];
const strip = (id) => id.replace(/^schema:/, '');
const asArr = (v) => (v == null ? [] : Array.isArray(v) ? v : [v]);
const types = new Map(); // type -> supertypes
const props = new Map(); // prop -> domain types
for (const n of vocab) {
  const t = asArr(n['@type']);
  if (t.includes('rdfs:Class')) types.set(strip(n['@id']), asArr(n['rdfs:subClassOf']).map((s) => strip(s['@id'])));
  if (t.includes('rdf:Property')) props.set(strip(n['@id']), asArr(n['schema:domainIncludes']).map((s) => strip(s['@id'])));
}
function ancestors(type, seen = new Set()) {
  if (seen.has(type)) return seen;
  seen.add(type);
  for (const s of types.get(type) ?? []) ancestors(s, seen);
  return seen;
}

// Google's required properties for the structured data features we use.
const REQUIRED = {
  BreadcrumbList: ['itemListElement'],
  ListItem: ['position', 'name', 'item'],
  FAQPage: ['mainEntity'],
  Question: ['name', 'acceptedAnswer'],
  Answer: ['text'],
  LocalBusiness: ['name', 'address'],
  Service: ['name', 'provider'],
};

function validateNode(node, where, errs, ids) {
  if (Array.isArray(node)) return node.forEach((n) => validateNode(n, where, errs, ids));
  if (!node || typeof node !== 'object') return;
  const nodeTypes = asArr(node['@type']);
  if (node['@id'] && nodeTypes.length) ids.add(node['@id']);
  const allAnc = new Set();
  for (const t of nodeTypes) {
    if (!types.has(t)) errs.push(`${where}: unknown @type "${t}"`);
    else ancestors(t).forEach((a) => allAnc.add(a));
  }
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith('@')) continue;
    if (!props.has(k)) {
      errs.push(`${where}: unknown property "${k}"`);
    } else if (nodeTypes.length && !props.get(k).some((d) => allAnc.has(d))) {
      errs.push(`${where}: "${k}" is not a property of ${nodeTypes.join('/')}`);
    }
    validateNode(v, where, errs, ids);
  }
  for (const [t, req] of Object.entries(REQUIRED)) {
    if (allAnc.has(t)) for (const r of req) if (node[r] == null) errs.push(`${where}: ${nodeTypes.join('/')} missing required "${r}"`);
  }
}
function collectRefs(node, out = []) {
  if (Array.isArray(node)) node.forEach((n) => collectRefs(n, out));
  else if (node && typeof node === 'object') {
    const keys = Object.keys(node);
    if (keys.length === 1 && keys[0] === '@id') out.push(node['@id']);
    else Object.values(node).forEach((v) => collectRefs(v, out));
  }
  return out;
}

// ---- crawl dist ------------------------------------------------------------
async function htmlFiles(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await htmlFiles(p)));
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}
const toRoute = (file) => {
  const r = '/' + relative(DIST, file).replace(/index\.html$/, '').replace(/\.html$/, '');
  return r.length > 1 ? r.replace(/\/$/, '') : '/';
};

const files = await htmlFiles(DIST);
const routes = new Set(files.map(toRoute));
const staticFiles = new Set();
for (const f of ['llms.txt', 'robots.txt', 'sitemap-index.xml', 'favicon.svg']) staticFiles.add('/' + f);

const errors = [];
const warnings = [];
const titles = new Map();
const descs = new Map();
const typeCounts = new Map();
let schemaNodes = 0;

for (const file of files) {
  const route = toRoute(file);
  const where = route;
  const $ = cheerio.load(await readFile(file, 'utf8'));
  const utility = UTILITY.has(route);

  const title = $('head > title').text();
  const desc = $('meta[name="description"]').attr('content') ?? '';
  if (!title) errors.push(`${where}: missing <title>`);
  if (title.length > 60) errors.push(`${where}: title ${title.length} chars: "${title}"`);
  if (!desc) errors.push(`${where}: missing meta description`);
  if (desc.length > 155) errors.push(`${where}: description ${desc.length} chars`);
  if (!utility) {
    titles.set(title, [...(titles.get(title) ?? []), route]);
    descs.set(desc, [...(descs.get(desc) ?? []), route]);
  }
  const h1 = $('h1');
  if (h1.length !== 1) errors.push(`${where}: ${h1.length} <h1> elements`);
  const canonical = $('link[rel="canonical"]').attr('href');
  if (!utility && canonical !== SITE + (route === '/' ? '' : route)) errors.push(`${where}: canonical "${canonical}"`);
  for (const p of ['og:title', 'og:description', 'og:image', 'og:url']) if (!$(`meta[property="${p}"]`).attr('content')) errors.push(`${where}: missing ${p}`);
  if (!$('meta[name="twitter:card"]').length) errors.push(`${where}: missing twitter:card`);
  const robots = $('meta[name="robots"]').attr('content') ?? '';
  if (/noindex/.test(robots) && !utility) errors.push(`${where}: noindex on a content page`);
  if (utility && !/noindex/.test(robots)) warnings.push(`${where}: utility page without noindex`);
  if (!utility && !$('nav[aria-label="Breadcrumb"]').length && route !== '/') errors.push(`${where}: no visible breadcrumbs`);

  // Alt text and labelled form fields.
  $('img').each((_, el) => {
    if ($(el).attr('alt') === undefined) errors.push(`${where}: <img> without alt (${$(el).attr('src')})`);
  });
  $('input:not([type=hidden]), select, textarea').each((_, el) => {
    const id = $(el).attr('id');
    if (!id || !$(`label[for="${id}"]`).length) errors.push(`${where}: form field without a label (${$(el).attr('name')})`);
  });

  // Visible copy: no em or en dashes.
  const text = $('main').text();
  const dash = text.match(/.{0,30}[—–].{0,30}/);
  if (dash) errors.push(`${where}: dash in copy: "${dash[0].trim()}"`);

  // Internal links resolve.
  $('a[href^="/"]').each((_, el) => {
    const href = $(el).attr('href').split('#')[0].split('?')[0];
    const target = href.length > 1 ? href.replace(/\/$/, '') : '/';
    if (!routes.has(target) && !staticFiles.has(target) && !target.startsWith('/api/')) errors.push(`${where}: broken link ${href}`);
  });

  // JSON-LD.
  const blocks = $('script[type="application/ld+json"]');
  if (!blocks.length) errors.push(`${where}: no JSON-LD`);
  const ids = new Set();
  const refs = [];
  const seenTypes = new Set();
  blocks.each((_, el) => {
    let json;
    try {
      json = JSON.parse($(el).text());
    } catch (e) {
      errors.push(`${where}: invalid JSON-LD (${e.message})`);
      return;
    }
    if (json['@context'] !== 'https://schema.org') errors.push(`${where}: unexpected @context`);
    const graphNodes = json['@graph'] ?? [json];
    for (const n of graphNodes) {
      schemaNodes++;
      for (const t of asArr(n['@type'])) {
        seenTypes.add(t);
        typeCounts.set(t, (typeCounts.get(t) ?? 0) + 1);
      }
    }
    validateNode(graphNodes, where, errors, ids);
    refs.push(...collectRefs(graphNodes));
  });
  for (const r of refs) if (!ids.has(r)) errors.push(`${where}: @id reference "${r}" has no matching node`);
  if (!seenTypes.has('AutomotiveBusiness')) errors.push(`${where}: missing sitewide LocalBusiness node`);
  if (route !== '/' && !utility && !seenTypes.has('BreadcrumbList')) errors.push(`${where}: missing BreadcrumbList`);
  if ($('main details').length && !seenTypes.has('FAQPage') && route !== '/faq') warnings.push(`${where}: FAQ block without FAQPage schema`);
  if ((route.startsWith('/services/') || /^\/areas\/[^/]+$/.test(route)) && !seenTypes.has('Service')) errors.push(`${where}: missing Service schema`);
}

for (const [t, r] of titles) if (r.length > 1) errors.push(`duplicate title "${t}" on ${r.join(', ')}`);
for (const [d, r] of descs) if (r.length > 1) errors.push(`duplicate description on ${r.join(', ')}`);

for (const w of warnings) console.log('warn ', w);
for (const e of errors.slice(0, 200)) console.log('ERROR', e);
if (errors.length > 200) console.log(`... and ${errors.length - 200} more`);
console.log(
  `\n${files.length} pages, ${schemaNodes} JSON-LD nodes (${[...typeCounts].map(([t, n]) => `${t} ${n}`).join(', ')}).\n${errors.length} errors, ${warnings.length} warnings.`,
);
process.exit(errors.length ? 1 : 0);
