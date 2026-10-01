#!/usr/bin/env node
// Minimal local stand-in for Vercel's static hosting, for testing redirects
// before deploy: applies vercel.json redirects, cleanUrls, trailingSlash:false
// and serves dist/404.html for unknown paths.  Usage: node scripts/serve-vercel-like.mjs [port]
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join } from 'node:path';

const PORT = Number(process.argv[2] ?? 4322);
const DIST = new URL('../dist/', import.meta.url).pathname;
const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
const redirects = new Map(config.redirects.map((r) => [r.source, r]));
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.avif': 'image/avif', '.webp': 'image/webp', '.woff2': 'font/woff2' };

async function file(p) {
  try {
    return (await stat(p)).isFile() ? p : null;
  } catch {
    return null;
  }
}

http
  .createServer(async (req, res) => {
    const url = new URL(req.url, 'http://x');
    let path = decodeURIComponent(url.pathname);
    if (path.length > 1 && path.endsWith('/')) {
      res.writeHead(308, { Location: path.replace(/\/+$/, '') + url.search });
      return res.end();
    }
    const r = redirects.get(path);
    if (r) {
      res.writeHead(r.statusCode ?? (r.permanent === false ? 307 : 308), { Location: r.destination });
      return res.end();
    }
    if (config.cleanUrls && path.endsWith('.html')) {
      res.writeHead(308, { Location: path.replace(/(\/index)?\.html$/, '') || '/' });
      return res.end();
    }
    const found = (await file(join(DIST, path))) ?? (await file(join(DIST, path + '.html'))) ?? (await file(join(DIST, path, 'index.html')));
    if (found) {
      res.writeHead(200, { 'Content-Type': TYPES[extname(found)] ?? 'application/octet-stream' });
      return res.end(await readFile(found));
    }
    res.writeHead(404, { 'Content-Type': TYPES['.html'] });
    res.end(await readFile(join(DIST, '404.html')).catch(() => 'Not found'));
  })
  .listen(PORT, () => console.log(`Vercel-like server on http://localhost:${PORT}`));
