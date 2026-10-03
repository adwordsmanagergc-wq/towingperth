// WA Government maximum charges for crash (accident) towing of light vehicles
// in Perth and Peel, set under the Towing Services Act 2024 and its regulations.
// Source: Department of Transport. When the Department changes the caps, update
// the figures and `effective` here and every page that shows them updates.
// TODO: check https://www.transport.wa.gov.au/licensing/towing-industry-reforms/capped-fees-and-maximum-charges
// each July for new figures.

export const CRASH_TOW_RULES = {
  effective: '1 July 2026',
  area: 'Perth and Peel',
  sourceUrl: 'https://www.transport.wa.gov.au/licensing/towing-industry-reforms/capped-fees-and-maximum-charges',
  conductUrl: 'https://www.transport.wa.gov.au/licensing/towing-industry-reforms/conduct-and-obligation',
  /** What the capped tow charge covers, in the Department's words (paraphrased). */
  towIncludes:
    'preparing, loading, transporting and unloading the crashed vehicle, clearing crash debris, and the photos, phone calls and paperwork, for the first 50 km',
  lightVehicle: [
    { item: 'Crash tow (first 50 km)', max: '$523' },
    { item: 'Each extra km after 50 km', max: '$4.75' },
    { item: 'After-hours surcharge', max: '$149' },
    { item: 'Storage, per day', max: '$27' },
    { item: 'Admin fee (one-off)', max: '$95' },
  ],
  motorcycle: [
    { item: 'Motorcycle storage, per day', max: '$13.50' },
    { item: 'Motorcycle admin fee (one-off)', max: '$95' },
  ],
} as const;
