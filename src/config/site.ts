// Single source of truth for business facts. Every page, schema block and
// CTA reads from here, so a change made once applies sitewide.
// Anything marked TODO is deliberately left blank until the business supplies it.

export const SITE = {
  name: 'Quik Tow & Transport',
  shortName: 'Quik Tow',
  // Registered company, as shown on the WA Government authorised towing businesses list.
  legalName: 'Tollis Holdings Pty Ltd',
  url: 'https://www.towingperth.com',
  phoneDisplay: '0419 857 070',
  phoneHref: 'tel:+61419857070',
  // SMS link opens the phone's messaging app addressed to the same mobile.
  smsHref: 'sms:+61419857070',
  phoneE164: '+61419857070',
  areaLabel: 'Perth, Western Australia',
  locality: 'Perth',
  region: 'WA',
  country: 'AU',
  hours: '24/7',

  // WA Department of Transport crash (accident) towing business authorisation,
  // required for crash towing since 1 July 2026 under the Towing Services Act 2024.
  crashTowAuthorisation: '810',

  // Heaviest machine we transport, in tonnes (confirmed by the business).
  machineryMaxTonnes: 11,
  machineryUrl: '/transport/machinery-transport-perth',

  // TODO: confirm email address to publish (the old site footer showed info@quiktow.com.au).
  email: '',
  // TODO: ABN to show in the footer (the old site footer showed one; confirm before publishing).
  abn: '',
  // TODO: street address, only if you want one shown. Service-area businesses can leave this blank.
  streetAddress: '',

  // Google Business Profile listing "Quik Tow & Transport Towing Perth".
  mapsUrl: 'https://maps.google.com/?cid=10192726777913768748',
  mapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3386.9890098300652!2d115.82318771247779!3d-31.90689597393111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2a32af56eac324e9%3A0x8d73d7004a297b2c!2sQuik%20Tow%20%26%20Transport%20Towing%20Perth!5e0!3m2!1sen!2sau!4v1791646043401!5m2!1sen!2sau',

  // TODO: Facebook and other profile URLs for schema sameAs.
  sameAs: ['https://maps.google.com/?cid=10192726777913768748'] as string[],

  // Quote form on /contact. Off for now: quotes go by phone or text instead.
  // To turn it back on, set the three Resend variables in Vercel (see README) and flip this.
  quoteFormEnabled: false,

  analytics: {
    // Optional: Google Tag Manager container ID, e.g. GTM-XXXXXXX. Leave blank to use GA4 directly.
    gtmId: '',
    // GA4 property "towingperth.com". Loaded directly (no GTM needed).
    ga4Id: 'G-VKW53SJEXL',
  },
} as const;

export const SELLING_POINTS = [
  { key: 'authorised', label: 'Authorised crash tow business #810' },
  { key: 'insurance', label: 'We bill your insurer directly' },
  { key: 'fleet', label: '10+ trucks on the road' },
  { key: 'rates', label: 'Best rates guarantee' },
  { key: 'coverage', label: 'All Perth suburbs, 24/7' },
] as const;

// Linked from every service page ("top 10 suburbs"). Highest-demand areas
// from competitor research plus the old site's strongest pages.
export const TOP_SUBURBS = [
  'perth-cbd',
  'joondalup',
  'wanneroo',
  'midland',
  'fremantle',
  'rockingham',
  'baldivis',
  'armadale',
  'cannington',
  'kewdale',
] as const;
