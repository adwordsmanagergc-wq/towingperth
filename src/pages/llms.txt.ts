// llms.txt: a plain-text summary of the business for AI search and assistants.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '~/config/site';

export const GET: APIRoute = async () => {
  const services = (await getCollection('services')).sort((a, b) => a.data.order - b.data.order);
  const regions = (await getCollection('regions')).sort((a, b) => a.data.order - b.data.order);
  const suburbs = await getCollection('suburbs');
  const roads = (await getCollection('roads')).sort((a, b) => a.data.order - b.data.order);
  const u = (p: string) => `${SITE.url}${p}`;

  const body = `# ${SITE.name}

> ${SITE.name} is a 24/7 tow truck and transport company covering every suburb of Perth, Western Australia. Services: accident towing, breakdown towing and recovery, 4WD recovery (sand, mud, beach and off-road), shipping container transport and general vehicle transport. We bill insurance companies directly, run 10+ tow trucks across Perth, and offer a best rates guarantee with transparent, upfront pricing and no hidden fees. Phone ${SITE.phoneDisplay} (${SITE.phoneE164}), any time.

## Key facts

- Phone: ${SITE.phoneDisplay}, answered 24 hours a day, 7 days a week
- Service area: the whole Perth metro area, including the CBD, northern, southern, eastern (including the Perth Hills), western and south eastern suburbs
- Authorised crash (accident) towing business #810 under WA's Towing Services Act 2024; crash tow charges in Perth and Peel are capped by the WA Government (maximum $523 for the first 50 km, see the accident towing page)
- Insurance: we bill the customer's insurer directly for covered claims
- Fleet: more than 10 tow trucks on the road across Perth
- Pricing: quoted upfront before dispatch; best rates guarantee; no hidden fees

## Services

${services.map((s) => `- [${s.data.name}](${u(`/services/${s.id}`)}): ${s.data.metaDescription}`).join('\n')}
- [Insurance towing](${u('/insurance-towing')}): how direct insurer billing works after a crash
- [Machinery transport](${u(SITE.machineryUrl)}): bobcats, skid steers, mini excavators, forklifts and boom lifts up to ${SITE.machineryMaxTonnes} tonnes

## Service areas

${regions.map((r) => `- [${r.data.name}](${u(`/areas/${r.id}`)}): ${suburbs.filter((s) => s.data.region.id === r.id).map((s) => s.data.name).sort().join(', ')}`).join('\n')}

## Road safety guides

${roads.map((r) => `- [${r.data.name}](${u(`/roads/${r.id}`)})`).join('\n')}

## Other pages

- [FAQ](${u('/faq')})
- [About](${u('/about')})
- [Contact and quotes](${u('/contact')})
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
