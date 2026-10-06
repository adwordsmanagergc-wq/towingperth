import type { Faq } from '~/lib/schema';

// Each answer opens with 2 to 4 direct sentences (snippet and AI-answer friendly),
// then expands after a blank line.
export const HOME_FAQS: Faq[] = [
  {
    q: 'How quickly can you arrive for a tow in Perth?',
    a: `We send the nearest available truck as soon as you call, 24 hours a day. With more than 10 tow trucks working across Perth, there's usually one not far from you. Arrival time depends on where you are, the time of day and traffic, so we'll give you a realistic ETA on the phone.

If you're somewhere unsafe, like a freeway shoulder or a blind corner, tell us straight away so we can prioritise you. While you wait, stay behind a barrier or well off the road with your hazard lights on.`,
  },
  {
    q: 'How much does towing in Perth cost?',
    a: `Accident (crash) towing in Perth and Peel is regulated by the WA Government: the maximum charge to tow a crashed car is $523 for the first 50 km, plus $4.75 per km after that, a $149 after-hours surcharge, $27 a day storage and a one-off $95 admin fee. We're authorised crash tow business #810, and you sign an Authority to Tow showing the costs before we move your car. If it's an insurance job, we bill your insurer directly so you usually pay nothing on the day.

For breakdowns, 4WD recovery and transport jobs, the price depends on distance, the vehicle, the time of day and how easy it is to reach and load. We quote upfront, with no hidden fees, backed by our best rates guarantee.

A short tow of a car that rolls freely is the simplest job. Costs go up when we need to winch a car out of a ditch, recover a bogged 4WD or handle a large vehicle, or when the run is long. Tell us those details when you call and the quote will reflect them, so there are no surprises later. For a quote, call or text 0419 857 070.`,
  },
  {
    q: 'Do you offer shipping container transport in Perth?',
    a: `Yes. We transport shipping containers across Perth, between depots, ports, industrial yards, building sites, farms and homes. Tell us the container size, both addresses and anything about site access, and we'll quote and book the move.

Common jobs include delivering storage containers to homes and building sites, moving containers between industrial areas like Kewdale, Welshpool and Wangara, and runs to and from the Fremantle port area. Before the move we'll check the delivery site has room for the truck and that the ground is firm enough. See [shipping container transport](/services/container-transport-perth).`,
  },
  {
    q: 'Can you help with 4WD recovery in Perth?',
    a: `Yes. We recover 4WDs that are bogged in sand, stuck in mud, or stranded off-road or on a beach, 24/7. Call us with your location and how the vehicle is stuck, and we'll bring the right recovery gear.

If you're on a beach and the tide is coming in, call immediately and say so. Avoid repeated snatch-strap attempts with a mate's car, since broken straps and recovery points cause serious injuries. Lowering your tyre pressure and stopping before you dig in deeper usually makes the recovery quicker and safer. More on [4WD recovery](/services/4wd-recovery-perth).`,
  },
  {
    q: 'Do you cover all suburbs in Perth?',
    a: `Yes. We cover every suburb across the Perth metro area 24/7, including the CBD, the northern, southern, eastern, western and south eastern suburbs, and the Perth Hills. If you're on the edge of the metro area, call us and we'll confirm.

Browse by region: [northern suburbs](/areas/northern-suburbs), [southern suburbs](/areas/southern-suburbs), [eastern suburbs and hills](/areas/eastern-suburbs), [western suburbs and CBD](/areas/western-suburbs) and [south eastern suburbs](/areas/south-eastern-suburbs), or see [every suburb we cover](/areas).`,
  },
  {
    q: 'Who decides who tows my car after a crash in Perth?',
    a: `You do. The first tow truck at the scene has no automatic right to tow your car. Only an authorised crash towing business can do it, and you sign an Authority to Tow showing the costs and where the car is going before it moves. We're authorised business #810, so call us on 0419 857 070 and we'll come to you.`,
  },
  {
    q: 'My car was towed in the Perth CBD. Where is it?',
    a: `Cars stopped illegally in CBD clearways, bus lanes and no stopping zones are towed by Main Roads WA to its compound in Northbridge. Call Main Roads on 138 138 to check. If you need the car taken somewhere else after it's released, we can collect it. See [car towed in Perth](/towing/car-towed-perth).`,
  },
  {
    q: 'What are the most dangerous roads for car accidents in Perth?',
    a: `In RAC WA's Risky Roads survey, the intersection of Baldivis Road and Kulija Road in Baldivis was voted the riskiest in metro Perth, and the Canning Highway, Rome Road and Hislop Road junction came second. The Mitchell Freeway through West Perth has been named the riskiest metro road. Great Eastern Highway at Scott Street and Nicholson Road at Garden Street also made the list.

These are busy roads that mix high speeds, heavy traffic and tricky intersections. Our [dangerous roads guide](/roads) covers each one: why it's risky, what to do if you crash there, and safety tips. If you've had an accident on any Perth road, we can tow your car and bill your insurer directly. See [accident towing](/services/accident-towing-perth).`,
  },
];

export const GENERAL_FAQS: Faq[] = [
  {
    q: 'Are you really available 24/7?',
    a: `Yes. We answer the phone and dispatch trucks 24 hours a day, 7 days a week, including weekends and public holidays. Call 0419 857 070 any time.`,
  },
  {
    q: 'Can I choose where my car is towed?',
    a: `Yes. We'll take your car to your home, your own mechanic, a smash repairer or a storage yard. For insurance jobs, your insurer may ask for the car to go to one of their approved repairers, and we'll coordinate that with them.`,
  },
  {
    q: 'Do you bill my insurance company directly?',
    a: `Yes. For insurance claims we deal with your insurer directly, so you usually don't pay us anything on the day. Have your claim number handy if you've already lodged one, or we can help you get started. See [how insurance towing works](/insurance-towing).`,
  },
  {
    q: 'Can I ride in the tow truck with my car?',
    a: `Often, yes, if there's a spare seat and it's safe to do so. Let us know when you book so the driver can plan for it. If not, we'll make sure you're not left stranded.`,
  },
  {
    q: 'What details do you need when I call?',
    a: `Your location (an address, the road and nearest cross street, or a landmark), the vehicle's make and model, what's wrong with it, and where you'd like it taken. If it's an accident, let us know if anyone is hurt or the road is blocked, and call 000 first if anyone needs help.`,
  },
  {
    q: 'Can you tow electric, AWD and low cars?',
    a: `Yes. We use tilt tray trucks, which carry the whole vehicle off the ground. That's the safe way to move electric cars, all-wheel drives and lowered or prestige cars. Tell us the make and model so we bring the right equipment.`,
  },
  {
    q: 'How do I pay?',
    a: `For insurance jobs we bill your insurer directly. For private jobs we'll confirm the price and payment options when we quote, before the truck is dispatched.`,
  },
];
