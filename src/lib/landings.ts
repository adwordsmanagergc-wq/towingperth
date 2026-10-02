import type { CollectionEntry } from 'astro:content';

export type Landing = CollectionEntry<'landings'>;

export const GROUPS = [
  { key: 'vehicle', name: 'By vehicle', test: (u: string) => /^\/towing\/(motorbike|caravan|ev|luxury|boat|van|4wd)/.test(u) || u === '/transport/machinery-transport-perth' },
  { key: 'container', name: 'Container and regional transport', test: (u: string) => u.startsWith('/container-transport/') || u === '/transport/perth-to-bunbury' },
  { key: 'situation', name: 'By situation', test: (u: string) => u.startsWith('/towing/') || u.startsWith('/transport/') || u.startsWith('/recovery/') },
  { key: 'business', name: 'For businesses', test: (u: string) => u.startsWith('/business/') },
  { key: 'local', name: 'Local services', test: (u: string) => u.startsWith('/areas/') },
  { key: 'pricing', name: 'Pricing', test: (_u: string) => true },
] as const;

export function groupOf(url: string) {
  return GROUPS.find((g) => g.test(url))!;
}

/** Short link label: the H1 without the trailing "Perth". */
export function label(l: Landing) {
  return l.data.h1.replace(/\s+Perth$/i, '');
}
