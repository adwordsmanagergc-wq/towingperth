// Single source of truth for business facts. Every page, schema block and
// CTA reads from here, so a change made once applies sitewide.
// Anything marked TODO is deliberately left blank until the business supplies it.

export const SITE = {
  name: 'Quik Tow & Transport',
  shortName: 'Quik Tow',
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

  // TODO: confirm email address to publish (the old site footer showed info@quiktow.com.au).
  email: '',
  // TODO: ABN to show in the footer (the old site footer showed one; confirm before publishing).
  abn: '',
  // TODO: street address, only if you want one shown. Service-area businesses can leave this blank.
  streetAddress: '',

  // TODO: Google Business Profile and Facebook URLs for schema sameAs and the footer.
  sameAs: [] as string[],

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
