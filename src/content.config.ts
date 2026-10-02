import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const faq = z.object({ q: z.string(), a: z.string() });

// Callout types drive which local scenarios a suburb page talks about and
// which services it leads with.
export const CALLOUTS = [
  'freeway', // freeway or highway breakdowns and crashes
  'arterial', // busy arterial roads and intersections
  'coastal-4wd', // beach and sand recovery on beaches or tracks where driving is allowed
  'beach', // beachside car parks and esplanades (no beach driving)
  'hills-4wd', // hills tracks, steep driveways, mud
  'industrial', // container and heavy moves from industrial estates
  'port', // Fremantle or Kwinana port and freight
  'airport', // airport precinct
  'shopping', // car park breakdowns at major centres
  'cbd', // inner-city, tight access, clearways
  'rural', // semi-rural properties, long distances, farm vehicles
  'new-estate', // growth corridor estates, roadworks
  'university', // students, older cars
  'hospital', // hospital precincts
  'river', // river foreshore, boat ramps
] as const;

const services = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/services' }),
  schema: z.object({
    name: z.string(),
    navLabel: z.string(),
    icon: z.string(),
    order: z.number(),
    h1: z.string(),
    metaTitle: z.string().max(60),
    metaDescription: z.string().max(155),
    lead: z.string(),
    cardBlurb: z.string(),
    included: z.array(z.string()),
    vehicles: z.array(z.string()),
    steps: z.array(z.object({ title: z.string(), text: z.string() })),
    faqs: z.array(faq),
  }),
});

const regions = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/regions' }),
  schema: z.object({
    name: z.string(), // "Northern Suburbs"
    shortName: z.string(), // "North"
    order: z.number(),
    h1: z.string(),
    metaTitle: z.string().max(60),
    metaDescription: z.string().max(155),
    lead: z.string(),
    mainRoads: z.array(z.string()),
    faqs: z.array(faq),
  }),
});

const suburbs = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/suburbs' }),
  schema: z.object({
    name: z.string(),
    region: reference('regions'),
    council: z.string().optional(),
    roads: z.array(z.string()).min(1),
    nearby: z.array(reference('suburbs')).min(4).max(6),
    landmarks: z.array(z.string()).default([]),
    callouts: z.array(z.enum(CALLOUTS)).min(1),
    // Optional overrides; templates generate these when absent.
    metaTitle: z.string().max(60).optional(),
    metaDescription: z.string().max(155).optional(),
    intro: z.string(),
    faqs: z.array(faq).min(2),
    featured: z.boolean().default(false),
  }),
});

const roads = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/roads' }),
  schema: z.object({
    name: z.string(),
    kind: z.enum(['road', 'intersection', 'precinct']),
    order: z.number(),
    h1: z.string(),
    metaTitle: z.string().max(60),
    metaDescription: z.string().max(155),
    lead: z.string(),
    suburbs: z.array(reference('suburbs')).min(1),
    safetyTips: z.array(z.string()).min(3),
    faqs: z.array(faq).min(2),
  }),
});

// Compact keyword landing pages: one high-intent job per page (vehicle type,
// situation, price, business buyer, service + suburb). URL lives in front matter.
const landings = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/landings' }),
  schema: z.object({
    url: z.string().regex(/^\/[a-z0-9\-\/]+$/),
    keyword: z.string(),
    title: z.string().max(60),
    description: z.string().max(160),
    h1: z.string(),
    intro: z.string(),
    related: z.array(z.string()).default([]),
    faqs: z.array(faq).min(3),
  }),
});

export const collections = { services, regions, suburbs, roads, landings };
