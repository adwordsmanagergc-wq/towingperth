#!/usr/bin/env node
// Mobile Lighthouse for one page of each type. Runs against the local
// Vercel-like server by default; pass --base for a deployed preview.
//   node scripts/lighthouse.mjs [--base URL] [path ...]
import { mkdir, writeFile } from 'node:fs/promises';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const args = process.argv.slice(2);
const bi = args.indexOf('--base');
const BASE = bi > -1 ? args.splice(bi, 2)[1].replace(/\/$/, '') : 'http://localhost:4322';
const PATHS = args.length
  ? args
  : ['/', '/services/accident-towing-perth', '/areas/northern-suburbs', '/areas/joondalup', '/roads/mitchell-freeway'];

const chrome = await chromeLauncher.launch({
  chromePath: process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  chromeFlags: [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    // Route through an outbound proxy when one is configured (remote URLs only).
    ...(process.env.HTTPS_PROXY && !BASE.includes('localhost') ? [`--proxy-server=${process.env.HTTPS_PROXY}`] : []),
  ],
});
await mkdir('lighthouse-reports', { recursive: true });
const rows = [];
let worst = 100;
try {
  for (const p of PATHS) {
    const { lhr, report } = await lighthouse(BASE + p, { port: chrome.port, output: 'html', logLevel: 'error' }, undefined);
    if (lhr.runtimeError) throw new Error(`${p}: ${lhr.runtimeError.code} ${lhr.runtimeError.message}`);
    const s = Object.fromEntries(Object.entries(lhr.categories).map(([k, c]) => [k, Math.round(c.score * 100)]));
    const lcp = lhr.audits['largest-contentful-paint'].numericValue / 1000;
    const cls = lhr.audits['cumulative-layout-shift'].numericValue;
    worst = Math.min(worst, ...Object.values(s));
    rows.push({ page: p, perf: s.performance, a11y: s.accessibility, bp: s['best-practices'], seo: s.seo, lcp: lcp.toFixed(2) + 's', cls: cls.toFixed(3) });
    await writeFile(`lighthouse-reports/${p === '/' ? 'home' : p.slice(1).replace(/\//g, '_')}.html`, report);
    for (const [k, c] of Object.entries(lhr.categories)) {
      if (c.score < 1) {
        const failing = c.auditRefs
          .map((r) => lhr.audits[r.id])
          .filter((a) => a.score !== null && a.score < 0.9 && a.scoreDisplayMode !== 'informative' && a.scoreDisplayMode !== 'notApplicable')
          .map((a) => a.id);
        if (failing.length) console.log(`  ${p} [${k}] ${failing.join(', ')}`);
      }
    }
  }
} finally {
  await chrome.kill();
}
console.table(rows);
process.exit(worst >= 95 ? 0 : 1);
