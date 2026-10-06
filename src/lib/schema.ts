// JSON-LD builders. Every entity points back to the one business node by @id,
// so Google sees a single provider rather than a new business on every page.
import { SITE } from '~/config/site';
import { absoluteUrl } from '~/lib/seo';

export type Crumb = { name: string; href: string };
export type Faq = { q: string; a: string };
type Json = Record<string, unknown>;

export const BUSINESS_ID = `${SITE.url}/#business`;
export const WEBSITE_ID = `${SITE.url}/#website`;

const PERTH: Json = {
  '@type': 'City',
  name: 'Perth',
  containedInPlace: { '@type': 'State', name: 'Western Australia' },
};

/**
 * Sitewide business node. `areaServed` lists Perth and the regions everywhere;
 * pass every suburb name on the homepage and /areas so the full list appears
 * without adding ~10 KB to all 250 pages.
 */
export function localBusiness(opts: { regions: string[]; suburbs?: string[] }): Json {
  const areaServed: Json[] = [
    PERTH,
    ...opts.regions.map((r) => ({ '@type': 'AdministrativeArea', name: `${r}, Perth`, containedInPlace: PERTH })),
    ...(opts.suburbs ?? []).map((s) => ({ '@type': 'Place', name: `${s}, WA` })),
  ];
  const node: Json = {
    '@type': ['AutomotiveBusiness', 'EmergencyService'],
    '@id': BUSINESS_ID,
    name: SITE.name,
    // Common misspellings people search for, so the brand still matches.
    alternateName: ['Quick Tow', 'Quik Tow', 'Quick Tow and Transport', 'Towing Perth'],
    url: absoluteUrl('/'),
    telephone: SITE.phoneE164,
    logo: absoluteUrl('/logo.png'),
    image: absoluteUrl('/og/home.jpg'),
    description:
      '24/7 tow truck service across every Perth suburb: accident towing, breakdown recovery, 4WD recovery, shipping container transport and vehicle transport. WA Department of Transport authorised crash towing business #810, with crash tow charges regulated by law. We bill your insurer directly.',
    address: {
      '@type': 'PostalAddress',
      ...(SITE.streetAddress ? { streetAddress: SITE.streetAddress } : {}),
      addressLocality: SITE.locality,
      addressRegion: SITE.region,
      addressCountry: SITE.country,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
    openingHours: 'Mo-Su 00:00-23:59',
    areaServed,
    knowsAbout: ['Accident towing', 'Breakdown towing', '4WD recovery', 'Shipping container transport', 'Vehicle transport', 'Machinery transport up to 11 tonnes'],
  };
  if (SITE.email) node.email = SITE.email;
  if (SITE.sameAs.length) node.sameAs = SITE.sameAs;
  return node;
}

export function website(): Json {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: absoluteUrl('/'),
    name: SITE.name,
    alternateName: 'Towing Perth',
    publisher: { '@id': BUSINESS_ID },
    inLanguage: 'en-AU',
  };
}

export function breadcrumbList(crumbs: Crumb[]): Json {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.href),
    })),
  };
}

export function service(opts: {
  name: string;
  serviceType: string;
  description: string;
  path: string;
  areaServed?: Json | Json[];
}): Json {
  return {
    '@type': 'Service',
    '@id': `${absoluteUrl(opts.path)}#service`,
    name: opts.name,
    serviceType: opts.serviceType,
    description: opts.description,
    url: absoluteUrl(opts.path),
    provider: { '@id': BUSINESS_ID },
    areaServed: opts.areaServed ?? PERTH,
    availableChannel: {
      '@type': 'ServiceChannel',
      servicePhone: { '@type': 'ContactPoint', telephone: SITE.phoneE164, contactType: 'emergency', hoursAvailable: 'Mo-Su 00:00-23:59' },
    },
  };
}

export function suburbPlace(name: string, region: string): Json {
  return {
    '@type': 'Place',
    name: `${name}, WA`,
    containedInPlace: { '@type': 'AdministrativeArea', name: `${region}, Perth`, containedInPlace: PERTH },
  };
}

/** Strips the light markdown used in FAQ answers so schema text is plain. */
function plain(s: string): string {
  return s.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*?([^*]+)\*\*?/g, '$1');
}

export function faqPage(faqs: Faq[]): Json {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: plain(f.a) },
    })),
  };
}

export function webPage(opts: { path: string; title: string; description: string }): Json {
  return {
    '@type': 'WebPage',
    '@id': `${absoluteUrl(opts.path)}#webpage`,
    url: absoluteUrl(opts.path),
    name: opts.title,
    description: opts.description,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': BUSINESS_ID },
    inLanguage: 'en-AU',
  };
}

export function graph(nodes: Json[]): string {
  // Escape "<" so copy can never close the script tag.
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }).replace(/</g, '\\u003c');
}
