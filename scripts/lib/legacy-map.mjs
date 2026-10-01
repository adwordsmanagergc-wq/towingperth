// Maps legacy Google Sites paths to new URLs. Shared by the suburb index
// builder and the redirect generator so both agree on every slug.

export const REGION_MAP = {
  'towing-northern-suburbs-perth': 'northern-suburbs',
  'towing-eastern-suburbs-perth': 'eastern-suburbs',
  'towing-southern-suburbs-perth': 'southern-suburbs',
  'towing-western-suburbs-perth': 'western-suburbs',
  'towing-south-eastern-suburbs-perth': 'south-eastern-suburbs',
};

// Old slug typos -> correct suburb slug.
export const SLUG_FIXES = {
  'owing-wembley-downs': 'wembley-downs',
  'hamilton-hil': 'hamilton-hill',
  joondalup_1: 'joondalup',
};

// Suburbs listed under two regions on the old site: the region that wins.
export const REGION_OVERRIDES = {
  belmont: 'eastern-suburbs',
  forrestfield: 'eastern-suburbs',
};

// Listed on the old hubs, but their copy sat under another suburb's URL.
export const EXTRA_SUBURBS = [
  { slug: 'east-fremantle', region: 'southern-suburbs' },
  { slug: 'oconnor', region: 'southern-suburbs' },
  { slug: 'doubleview', region: 'western-suburbs' },
];

// High-demand suburbs the old site never had a page for. New pages, no redirects.
export const NEW_SUBURBS = [
  ...['mirrabooka', 'morley', 'malaga', 'nollamara', 'balga', 'stirling'].map((slug) => ({ slug, region: 'northern-suburbs' })),
  ...['ellenbrook', 'maylands', 'inglewood', 'mount-lawley', 'east-perth'].map((slug) => ({ slug, region: 'eastern-suburbs' })),
  ...['perth-cbd', 'northbridge', 'west-perth', 'leederville'].map((slug) => ({ slug, region: 'western-suburbs' })),
  ...['fremantle', 'rockingham', 'baldivis', 'port-kennedy', 'warnbro', 'secret-harbour', 'wellard', 'safety-bay'].map((slug) => ({
    slug,
    region: 'southern-suburbs',
  })),
  ...['byford', 'kelmscott'].map((slug) => ({ slug, region: 'south-eastern-suburbs' })),
];

const NAME_FIXES = { oconnor: "O'Connor", 'st-james': 'St James', 'perth-cbd': 'Perth CBD' };

export function suburbName(slug) {
  return NAME_FIXES[slug] ?? slug.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
}

const ROAD_PREFIX = '/home/dangerous-roads-in-perth/towing-';

/** New path for a legacy path, or null if the path is unknown. */
export function newPathFor(oldPath) {
  const p = oldPath.replace(/\/+$/, '') || '/';
  if (p === '/' || p === '/home') return '/';
  if (p === '/home/dangerous-roads-in-perth') return '/roads';
  if (p.startsWith(ROAD_PREFIX)) return `/roads/${p.slice(ROAD_PREFIX.length)}`;
  const m = p.match(/^\/home\/([a-z-]+)(?:\/(.+))?$/);
  if (!m || !REGION_MAP[m[1]]) return null;
  if (!m[2]) return `/areas/${REGION_MAP[m[1]]}`;
  const raw = m[2].replace(/^towing-/, '');
  return `/areas/${SLUG_FIXES[raw] ?? raw}`;
}
