# What the business needs to supply

Nothing below was invented. Each item is a blank or placeholder until you provide it.

## Business details (`src/config/site.ts`)

- [ ] **Email address** to publish. The old site footer showed info@quiktow.com.au; confirm it's still right.
- [ ] **ABN** for the footer. The old site showed one; confirm it before publishing.
- [ ] **Street address**, only if you want one shown. You can leave it blank as a service-area business.
- [ ] **Google Business Profile URL** and **Facebook URL** (schema `sameAs`). The profile's website link is already updated to the new site.
- [x] **GA4 measurement ID**: G-VKW53SJEXL is live. Next: in GA4 mark `click_to_call` and `sms_click` as key events, link Google Ads, and import them as conversions.

## Quote form (optional, switched off)

Quotes currently go by phone or text: every "Text for a quote" button opens an SMS to 0419 857 070. To bring back the web form:

- [ ] Set `RESEND_API_KEY`, `QUOTE_TO_EMAIL` and `QUOTE_FROM_EMAIL` in Vercel
- [ ] Set `quoteFormEnabled: true` in `src/config/site.ts`

## Brand and photos

- [ ] **Logo** (SVG preferred). It replaces `src/components/Logo.astro`, `public/logo.png` and the favicons.
- [x] **Real truck photos**: hero and service photos are in `src/assets/images`, wired up through `src/data/photos.ts`. Swap in newer shots there (hero at least 2400px wide) and update the alt text.

## Facts to confirm

- [ ] **About page story** (`src/pages/about.astro`): when and why the business started, who runs it, and any licences or accreditations you want shown.
- [ ] **Electric and hybrid vehicles** are listed as handled on the breakdown and vehicle transport pages. Confirm or remove.
- [ ] **Insurer billing for non-accident jobs**: the 4WD, container and vehicle transport pages say "where the claim allows". Confirm.
- [ ] **Winching** is listed under accident towing. Confirm.
- [ ] **Riding in the truck**: the FAQ says "often, yes, if there's a spare seat". Confirm.
- [ ] **4WD beaches and tracks**: no beach is named as open to vehicles. If you service specific spots (e.g. north of Two Rocks or south of Rockingham), list them and we'll add them to the 4WD page.
- [ ] **Best rates guarantee terms**: if there are conditions (e.g. a written quote from another operator), we should publish them.

## Nice to have later (high impact)

- [ ] Genuine Google reviews. Once you have them, show them and add `AggregateRating` schema. Never fabricate reviews.
- [ ] "From" prices or a worked price example, if you're happy to publish them.
- [ ] A fleet section with truck types and photos, to back up "10+ trucks".
- [ ] Insurer logos, only for insurers you have a direct arrangement with.
