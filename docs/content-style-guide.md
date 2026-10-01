# Content style guide: towingperth.com

Who reads this site: someone stressed, often standing at the roadside on a phone. They want to know (1) can you get to me, (2) what happens next, (3) will it cost me a fortune, (4) how do I call. Write for them first, Google second.

## Voice

- Natural Australian English: tyres, kerb, ute, servo, car park, bitumen, verge, metres, organise, centre, colour.
- Plain, calm, practical. Short sentences. Second person ("you", "your car").
- Confident but never boastful. Show, don't hype: explain what we do instead of calling it "world class".
- **No em dashes (—) or en dashes (–) used as dashes. Ever.** Use a full stop, comma, colon or brackets instead. Hyphens in compound words (tilt-tray, 24-hour) are fine. Ranges use "to" ("30 to 40").
- No exclamation marks except very rarely in FAQ answers.
- No clichés: "look no further", "second to none", "one-stop shop", "we pride ourselves", "in today's fast-paced world", "rest assured", "seamless", "hassle-free", "unparalleled".

## Keywords without stuffing

- The H1 and title carry the main keyword ("Tow Truck Joondalup"). In the body, use the suburb name where a human would, about 3 to 6 times on a suburb page.
- Never write "towing Perth" or "tow truck Perth" as an ungrammatical phrase ("we provide towing Perth services"). Write "towing across Perth", "a tow truck in Perth".
- Vary naturally: tow, tow truck, tilt tray, recovery, pick up your car, get you moving.

## Business facts: use ONLY these

- Quik Tow & Transport, phone 0419 857 070, 24/7, every Perth suburb.
- Services: accident towing, breakdown towing and recovery, 4WD recovery (sand, mud, beach, off-road), shipping container transport, general vehicle transport (cars through to larger vehicles).
- We bill your insurance company directly. 10+ tow trucks on the road across Perth. Best rates guarantee, transparent pricing, no hidden fees. Fast response times.

## Never invent

No reviews, ratings, years in business, ABN, street address, depot or yard locations, licence numbers, response time figures ("within 30 minutes"), prices, fleet details beyond "10+ trucks", staff names, partner insurer names, or awards. Do not claim we have a truck "based in" any suburb. Acceptable: "with more than 10 trucks working across Perth, there's often one not far from {suburb}."

## Local facts

Every local fact (roads, landmarks, council, nearby suburbs, beach access rules, industrial areas) must be true. If you're not sure a fact is right, check it with a web search or leave it out. Never guess a road name. Generic but true beats specific but wrong.

Keep local facts durable: no event dates, no "currently under construction" claims unless verified and likely to stay true for a couple of years.

## Suburb page shape

Front matter fields are defined in `src/content.config.ts`. The page template already renders: H1 ("Tow Truck {Name}"), hero CTAs, a services grid linking all five services, the nearby suburbs links, the region link and a call-to-action band. **Do not repeat those in the body.**

The writer supplies:

- `intro`: 2 to 3 sentences (40 to 70 words), specific to the suburb, that answer "can you help me here?" Mention 24/7 and one local detail.
- Body markdown (250 to 450 words) using these H2s, adapted naturally per suburb (headings can be reworded so they don't read as a template):
  1. `## Towing in {Name}: what we're usually called out for` covering the 2 to 4 most likely real scenarios for this suburb given its roads, land use and location (freeway breakdowns, shopping centre car parks, coastal 4WD bogs, industrial container moves, hills driveways, student cars, hospital car parks and so on). Be concrete.
  2. `## Roads and places we cover around {Name}` covering the main roads, landmarks and how they connect to neighbouring suburbs. Link 2 to 4 nearby suburbs inline with `[Name](/areas/slug)` and at least one service inline (see link list below). If a road has its own page, link it.
  3. `## If you're stuck in {Name} right now` giving 3 to 5 short practical steps or tips specific to the location (where to pull over on that road, what to tell us so we find you, what to do on the beach if the tide is coming in). End with a nudge to call.
- `faqs`: 2 to 3 local questions with direct answers (2 to 4 sentences each). Each must be specific to this suburb, never a generic question with the name swapped in.

## Internal link targets

- Services: `/services/accident-towing-perth`, `/services/breakdown-towing-perth`, `/services/4wd-recovery-perth`, `/services/container-transport-perth`, `/services/vehicle-transport-perth`
- `/insurance-towing`, `/contact`, `/roads`
- Road pages: `/roads/albany-highway`, `/roads/baldivis-road`, `/roads/canning-highway`, `/roads/garden-city`, `/roads/great-eastern-highway`, `/roads/hislop-road`, `/roads/joondalup-drive`, `/roads/kulija-road`, `/roads/mitchell-freeway`, `/roads/nicholson-road`, `/roads/ranford-road`, `/roads/rome-road`, `/roads/wanneroo-road`
- Suburbs: `/areas/{slug}` using slugs from `scripts/data/suburb-index.json` only.

## Uniqueness test

Before you finish a page, read it with the suburb name blanked out. If it could describe a different suburb, rewrite it. No two pages may share a sentence beyond trivial ones like "Call us on 0419 857 070."
