# Competitor research: Perth towing search (Oct 2026)

**Method and caveats.** I ran 15 searches through the WebSearch tool: the 11 requested plus "tilt tray perth", "bogged car recovery beach perth", "how much does a tow truck cost perth" and "breakdown towing perth". The tool searches from the **US**, so the order of results is only a rough guide to google.com.au. Plain "towing rockingham" and "towing midland" returned only US towns, so I re-ran them with "WA". Homepages and pages were fetched with curl on 1 Oct 2026. Word counts are visible text and include the nav and footer. Schema types were read from the JSON-LD on each page. A sticky call bar was confirmed only where it shows in the static HTML. **No People Also Ask data was available.** The question list below comes from competitor FAQs and question-style results.

## 1. Who ranks (appearances across the 15 queries, top ~9 shown per query)

| Domain | Hits | Queries |
|---|---|---|
| perthtowtrucks.com.au | 9 | towing, tow truck, 24hr, accident, car, cheap, Rockingham, Midland, breakdown |
| quokkatowing.com.au | 8 | towing, tow truck, accident, car, cheap, Midland, bogged, cost |
| tilttrayperth.com.au | 6 | towing, 24hr, accident, Joondalup, bogged, breakdown |
| lightningtowing.com.au | 5 | towing, tow truck, 24hr, car, cheap |
| unitedtilttrayservice.com.au | 5 | towing, 24hr, accident, car, container |
| westausheavytow.com.au | 4 | tow truck, 24hr, car, container |
| perthheavytow.com.au | 4 | towing, tow truck, 24hr, Midland (heavy vehicles over 4 t only) |
| perthcitytowing.com.au | 4 | towing, tow truck, car, cheap |
| **Quik Tow (towingperth.com + quiktowandtransport.com.au)** | 4 | tow truck, accident, 4wd recovery, Joondalup (`towing-joondalup_1` duplicate URL) |
| southcitytowing / nationwide-group / allouttowing / towtrucksperth.au | 3 each | mixed |

**Directories:** Oneflare, Yellow Pages, Yelp, Whereis and towmycar.com.au take **2 to 4 of the top ~9 results on every suburb query** (Joondalup, Rockingham, Midland). On the head terms ("towing perth", "tow truck perth") the results are almost all operators. The two service niches look different:
- **4WD recovery:** forums (ExplorOz), Gumtree, 4x4 gear shops and small specialists (westsiderecovery, westcoast4x4recovery, townowperth). Commercial competition is weak, and Quik Tow's old site ranks.
- **Container transport:** container specialists (abccontainers, reefgroup, gecko, bossna), plus WestAus and United Tilt Tray.

## 2. Competitor profiles

| | Perth Tow Trucks | Quokka Towing | Specialized Tilt Tray | Lightning Towing |
|---|---|---|---|---|
| Title | Perth Tow Trucks \| 24/7 Tow Truck & Towing Service | Tow Truck Perth \| Cheap Towing Services 24/7 - Quokka Towing | Specialized Tilt Tray & Towing - Fast Towing Perth & WA - Call 6500 1013 | Lightning Towing Perth WA \| 7 Days a Week (08) 6555 0945 |
| H1 | "Perth Tow Trucks" | "Tow Truck Perth" | "Perth's Fast And Affordable Towing Services" | "Fast, Reliable, Perth Towing Services" |
| Meta | 24/7, tilt tray, "Call/SMS", "clear pricing" | "Cheap", 24/7, free quote | 24/7, vehicles/machinery, phone | vehicles/caravans/machinery, all suburbs, phone |
| Home words | ~1,230 | ~2,130 | ~1,970 | ~1,950 |
| Location pages | **358** `/towing-{suburb}-wa/` pages (sitemap). Rockingham vs Midland text is 69% the same. **The Midland page's H1 reads "Towing Woodbridge".** | ~30 `/service-areas/` pages. They have real local sections ("Roads through the area", "Landmarks") and a 5-step process. | ~8 location pages. Joondalup has ~700 words and **no H1**. | ~11 pages. **Rockingham vs Midland text is 90% the same, with no H1.** |
| Service pages | ~30, plus 14 FAQ articles | 13 services, 3 interstate routes, 24 blog posts | ~18 services (Tesla, bobcat, container storage) | ~15 |
| Trust | "Tow guarantee", aims for ~45 min response, receipts for insurers | Google reviews, insurer logos, "you speak directly to the driver" | "Trusted since 1996", "28+", WA DoT licensed, "we handle your insurance / organise a hire car", Trustindex reviews | insurer names (AAMI, Allianz, Bingle, QBE, NRMA), "23,100 jobs annually", Trustindex |
| Pricing | "clear quoting", no figures seen | **$150 hook-up, ~$5/km, typical $150–$350** | "from $165 inc GST under 10 km" | **"from $165 inc GST up to 10 km"** |
| CTAs | 11 tel links, WhatsApp, form | 11 tel links, **mobile sticky bottom bar (Call + 2nd button)**, instant quote form | 15 tel links, no form in HTML | 8 tel links, no form in HTML |
| Schema | Organization, WebPage, Article. Suburb page adds FAQPage/Service/Place. | LocalBusiness, FAQPage, OpeningHours, Service (on inner pages) | AutomotiveBusiness + EmergencyService, **AggregateRating 4.9 (67)**, FAQPage, OfferCatalog | Same stack, **AggregateRating 3.8 (68)** |
| Weaknesses | Thin, templated doorway pages; H1 errors; no prices | Strongest overall; some pages reset or time out on fetch | **Same template, schema and copy blocks as Lightning** (likely the same operator or agency, unconfirmed). Text says both "Since 2014" and "since 1996". | Contradicts itself ("Since 2014" and "Trusted Since 2001"); the 3.8 rating is published in its own schema |

| | United Tilt Tray | WestAus Heavy Tow | South City Towing | Perth City Towing |
|---|---|---|---|---|
| Title | Perth's Best 24/7 Towing & Roadside Aid \| United Tilt Tray | Tow Trucks Perth - Heavy Towing & Truck Towing Specialists | 24/7 Towing Perth \| Tilt Tray, Flatbed & Emergency – South City Towing | Towing Services Perth - Emergency Breakdown & Accidents Towing |
| H1 | "Hassle-free towing" (no keyword) | "Tow Truck Perth" | **none** | "24/7 Emergency Towing & Accident Towing Services Perth" |
| Home words | ~1,290 | ~1,100 | ~850 | ~1,020 |
| Location pages | 1 (Osborne Park) | none | none | ~225 pages, mostly old-style blog posts plus ~15 `/tow-truck-{suburb}/` pages (Belmont vs Kewdale 62% the same) |
| Services | 9 pages, including **4WD towing**, **sea container**, vintage/luxury, plant | 8 pages, including container (10/20/40 ft) | 9 pages, plus 23 blog posts (scams, cheap-towing risks, pricing) | car, tilt tray, insurance, exotic, commercial |
| Trust | insurer partners, reviews mentioning 10–15 minute arrivals | "30+ years", **"20+ tilt slide trucks"**, fleet and gallery pages | "5+ years", GPS-tracked fleet, "no hidden fees" | "100% customer satisfaction", Google reviews (generic) |
| CTAs / Schema | tel + form; AutoRepair schema (**wrong type**); service pages have no schema | 4 tel links, no form in HTML; LocalBusiness, FAQPage, OfferCatalog | tel + form; Organization/Article only | tel + 2 forms, named driver "Call Clayton"; no LocalBusiness |
| Weakness | Off-target H1, wrong schema, blog spam with "-2" duplicate posts | Heavy-vehicle positioning, little consumer copy | No H1, thin service pages (~610 words) | Dated keyword-stuffed blog URLs, first request returned HTTP 406 |

**Our current sites, for comparison:**
- towingperth.com: title is just "QUIK TOW & TRANSPORT", **no meta description, no schema**, H1 "TOWING PERTH".
- The old quiktowandtransport.com.au: about 380 words, empty H1, no schema.
- The existing audit (`SUMMARY.md`) found 217 URLs, 130 near-duplicate page pairs and H1/slug mismatches.

## 3. Synthesis

### (a) Keyword themes and questions
- **Head terms:** tow truck perth, towing perth, 24 hour/24/7 towing perth, emergency towing perth, car towing perth.
- **Service terms:** accident/insurance towing, breakdown towing, tilt tray/flatbed, container/sea container transport, machinery transport, 4WD/beach/bogged recovery, long-distance/interstate, caravan/motorcycle/boat/prestige/EV.
- **Modifiers:** cheap/affordable, near me, cost/price, "{suburb} tow truck" and "towing {suburb}".
- **Questions competitors answer** (from their FAQs and articles, not PAA):
  - How much does a tow truck cost in Perth? Why do prices vary? After-hours and weekend rates?
  - How long will you take to arrive? Can my car go to my own repairer? Do you bill the insurer?
  - What should I do after a crash, and who chooses the tow truck? WA crash-towing rules and capped fees. One search result cited a $523 light-vehicle crash-tow maximum from transport.wa.gov.au. **Verify this before using it.**
  - Can I ride in the tow truck? Tilt tray vs wheel-lift? Can you tow AWD, EV or lowered cars?
  - How do I get a bogged car out of sand?
  - What container sizes can you move, and what access does the site need?

### (b) Gaps we can exploit
1. **4WD and beach recovery:** no strong operator page ranks. Build a dedicated page for named beaches and tracks (Yanchep, Lancelin, Preston Beach, Gnangara pines). **This is a starting list. Confirm which spots Quik Tow actually services.** Cover tide urgency, a "from" price if you'll publish one, and photos.
2. **Insurer billing:** competitors only show logos. Explain the actual process step by step (claim number → we tow to the repairer or our yard → we invoice the insurer → $0 upfront for comprehensive cover). Nobody explains this clearly.
3. **Fleet proof:** only WestAus states a fleet size (20+). Back up "10+ trucks" with a fleet page showing truck types and capacities.
4. **Best-rate guarantee:** no competitor states a matching mechanism. Publish the terms; Perth Tow Trucks' "tow guarantee" is vague.
5. **Suburb pages:** every competitor's are templated (62–90% the same text) or have broken H1s. Fewer, genuinely local pages can beat 358 thin ones.
6. **Container transport:** cover sizes (10/20/40 ft), tilt tray vs side loader, site access checks and "from" prices. Only WestAus is thorough.

### (c) UX and conversion patterns that work
- Phone number in the title tag (Lightning, Specialized) and in the meta description.
- Quokka's mobile **sticky bottom bar** (Call / Quote). It was the only one confirmed in the static HTML.
- "Call/SMS" and WhatsApp (Perth Tow Trucks).
- Published "from" prices (Quokka, Lightning).
- Review widgets (Trustindex) and insurer logo strips.

### (d) Recommendations for the new towingperth.com
**Site structure:**
- Home
- /accident-towing-perth/ (with an insurance-towing section)
- /breakdown-towing-perth/
- /4wd-recovery-perth/ (with a beach-recovery subsection)
- /container-transport-perth/
- /vehicle-transport-perth/
- /tilt-tray-towing-perth/
- /towing-cost-perth/
- /fleet/
- /about/ (licence, years in business, insurer billing)
- /reviews/
- /areas/ hub plus **~20–30 suburb pages** for the highest-demand suburbs. Start with Joondalup, Rockingham, Midland, Fremantle, Mandurah, Armadale, Wanneroo, Baldivis and Cannington.

301-redirect the 217 legacy URLs to the matching hub or suburb page.

**Example titles (≤60 characters):**
- Home: "Tow Truck Perth 24/7 | Accident & Breakdown | Quik Tow"
- "Accident Towing Perth – We Bill Your Insurer | Quik Tow"
- "4WD & Beach Recovery Perth – Bogged? Call 24/7 | Quik Tow"
- "Shipping Container Transport Perth | 10/20/40ft | Quik Tow"
- "Tow Truck Joondalup – 24/7 Local Towing | Quik Tow"

**On-page content:**
- One keyword H1 per page (fixes a failure seen on 4 of 8 competitors).
- Phone number in the hero and on a sticky mobile Call/SMS bar.
- 4–6 page-specific FAQs marked up as FAQPage schema.
- A "from" price or a worked price example, with the regulated crash-tow cap explained.
- Insurer-billing steps.
- Fleet count with photos.
- Licence details.
- Real review snippets.

**Schema:** use `TowingService`, which is a schema.org subtype of AutomotiveBusiness, with areaServed, openingHours 24/7, telephone, Service/OfferCatalog and FAQPage.
- Add AggregateRating only from genuine Google reviews.

**Suburb pages:** each needs unique content, for example:
- local roads/highways, typical destinations (nearby repairers and yards)
- the response from our nearest depot
- one suburb-specific FAQ
- a review from that area if you have one

Aim for 600–900 unique words, not templated copy.

**Content hub:** 8–12 question articles that mirror the questions in 3(a), for example:
- cost
- what to do after a crash in WA
- tow-truck rules and capped fees
- bogged-in-sand guide
- container site prep

Interlink each article to its service page.

**Directories:** they own the suburb results, so also complete and keep up the Google Business Profile, Oneflare, Yellow Pages and Yelp listings.
