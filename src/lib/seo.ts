import { SITE } from '~/config/site';

export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 155;

/** First candidate that fits the title limit; the last one is truncated as a backstop. */
export function fitTitle(...candidates: string[]): string {
  const hit = candidates.find((c) => c.length <= TITLE_MAX);
  if (hit) return hit;
  const last = candidates[candidates.length - 1];
  return last.slice(0, TITLE_MAX - 1).trimEnd() + '…';
}

/** First candidate that fits the description limit, else trim at a word boundary. */
export function fitDescription(...candidates: string[]): string {
  const hit = candidates.find((c) => c.length <= DESCRIPTION_MAX);
  if (hit) return hit;
  const last = candidates[candidates.length - 1];
  const cut = last.slice(0, DESCRIPTION_MAX - 1);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,.;:]$/, '') + '.';
}

export function suburbTitle(name: string): string {
  return fitTitle(
    `Tow Truck ${name} | 24/7 Towing | ${SITE.name}`,
    `Tow Truck ${name} | 24/7 Towing | ${SITE.shortName}`,
    `Tow Truck ${name} 24/7 | ${SITE.shortName}`,
    `Tow Truck ${name} 24/7`,
  );
}

export function suburbDescription(name: string, region: string): string {
  return fitDescription(
    `24/7 tow truck in ${name}. Accident, breakdown and 4WD recovery across Perth's ${region}. We bill your insurer directly. Call ${SITE.phoneDisplay}.`,
    `24/7 tow truck in ${name}. Accident and breakdown towing, insurer billed direct. Call ${SITE.phoneDisplay}.`,
  );
}

export function absoluteUrl(path: string): string {
  if (/^https?:/.test(path)) return path;
  const clean = path === '/' ? '' : path.replace(/\/+$/, '');
  return `${SITE.url}${clean}`;
}

/** "mitchell-freeway" style slug from a display name. */
export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
