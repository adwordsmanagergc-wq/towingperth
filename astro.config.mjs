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
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: [400, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
  ],
  vite: { plugins: [tailwindcss()] },
});
