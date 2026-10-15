// /sitemap.xml is the address most tools (and the old Google Sites site) submit to
// Search Console. @astrojs/sitemap writes /sitemap-index.xml and /sitemap-0.xml, so
// serve an index here too rather than a 404.
import type { APIRoute } from 'astro';
import { SITE } from '~/config/site';

export const GET: APIRoute = () => {
  const lastmod = new Date().toISOString();
  const body = `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${SITE.url}/sitemap-0.xml</loc><lastmod>${lastmod}</lastmod></sitemap></sitemapindex>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
