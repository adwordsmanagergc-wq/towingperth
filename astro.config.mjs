// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.towingperth.com',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'directory', inlineStylesheets: 'always' },
  prefetch: false,
  integrations: [
    sitemap({
      filter: (page) => !/\/(quote-sent|404)\/?$/.test(page),
      entryLimit: 5000,
      // Build date as <lastmod> for every URL; each deploy republishes every page.
      lastmod: new Date(),
    }),
  ],
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Barlow Condensed',
      cssVariable: '--font-barlow',
      weights: [800],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Arial Narrow', 'sans-serif'],
      // optional, not swap: Android has no Arial, so metric-matched fallbacks
      // don't apply there and a late swap reflows the hero (live CLS 0.06-0.1).
      // The fonts are preloaded and cached, so most visits still get them.
      display: 'optional',
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: [400, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
      display: 'optional',
    },
  ],
  vite: { plugins: [tailwindcss()] },
});
