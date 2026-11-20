// Content for the service and town pages. Edit here, then run: node scripts/build-pages.mjs
// Wording reuses what's already on the homepage; nothing here claims more than the site does.

export const SITE = 'https://realiclean.net';
export const PHONE = '(315) 804-4188';
export const PHONE_TEL = '+13158044188';

const FAQ = {
  cost: {
    q: 'How much does a cleaning cost?',
    a: 'Every job is priced individually based on your space and what you need, and quotes are always free. Call or text, message us on Facebook, or use the quote form and we&rsquo;ll get back to you with details.',
  },
  oneTime: {
    q: 'Can I book just a one-time cleaning?',
    a: 'Absolutely. One-time deep cleans and move-in/move-out cleans are some of our most popular services.',
  },
  supplies: {
    q: 'Do I need to provide cleaning supplies?',
    a: 'Nope. We bring safe, effective, professional-grade products and all the equipment we need. If you have a preferred product for a particular surface, just let us know.',
  },
  payment: { q: 'What forms of payment do you accept?', a: 'We accept cash, check, and debit or credit cards.' },
  cancel: {
    q: 'What is your cancellation policy?',
    a: 'Life happens. We just ask for 24 to 48 hours&rsquo; notice for any appointment cancellations so we can adjust our schedule.',
  },
  fortDrum: {
    q: 'Do you clean on Fort Drum?',
    a: 'Yes. We serve on-base housing and the surrounding area, and we&rsquo;re happy to help with move-out cleans when it&rsquo;s time to PCS.',
  },
  carpetAlone: {
    q: 'Do you offer carpet shampooing on its own?',
    a: 'Yes. Carpet shampooing and hard floor strip-and-wax are available as standalone services or as an add-on to any clean, for both homes and businesses.',
  },
};

/** service: slug, name, form value (matches a quote-form checkbox), page copy. */
export const SERVICES = [
  {
    slug: 'house-cleaning',
    name: 'House Cleaning',
    short: 'House cleaning',
    form: 'Home cleaning',
    icon: 'i-home',
    title: 'House Cleaning in Lowville &amp; Northern NY',
    description:
      'Weekly, bi-weekly, monthly or one-time house cleaning from Reali Clean in Lowville, NY. Serving Lewis, Jefferson and Herkimer Counties and Fort Drum. Free quotes.',
    intro:
      'Your home is your sanctuary. Whether you&rsquo;re juggling work, kids, or just need a break from chores, we deliver consistent, high-quality results you can count on, on a schedule that fits you.',
    included: [
      '<strong>Standard clean</strong> for weekly, bi-weekly or monthly upkeep',
      '<strong>Kitchens and bathrooms</strong> cleaned, wiped down and sanitized',
      '<strong>Dusting, vacuuming and mopping</strong> throughout',
      '<strong>Add-ons</strong> like folding laundry, making beds or a fridge clean-out',
    ],
    who: 'Busy families, working professionals and anyone who&rsquo;d rather spend their weekend doing something other than scrubbing. Tell us what matters most and we&rsquo;ll tailor a plan around it.',
    faqs: ['cost', 'supplies', 'cancel'],
  },
  {
    slug: 'deep-cleaning',
    name: 'Deep Cleaning',
    short: 'Deep cleaning',
    form: 'Deep clean',
    icon: 'i-home',
    title: 'Deep Cleaning in Lowville, Watertown &amp; Northern NY',
    description:
      'One-time deep cleaning with baseboards, fixtures, grout and inside appliances. Reali Clean serves Lowville, Watertown, Carthage, Fort Drum and Old Forge. Free quotes.',
    intro:
      'A deep clean gets to everything a regular clean skips. It&rsquo;s the perfect reset before a recurring service starts, before guests arrive, or any time your home needs a fresh start.',
    included: [
      '<strong>Baseboards, trim and fixtures</strong> washed by hand',
      '<strong>Grout and tile</strong> scrubbed in kitchens and bathrooms',
      '<strong>Inside appliances</strong> like the oven and fridge on request',
      '<strong>Every room top to bottom</strong>, including the spots that get skipped',
    ],
    who: 'Homes that haven&rsquo;t had a professional clean in a while, spring and fall refreshes, and anyone starting a recurring service who wants a clean slate.',
    faqs: ['oneTime', 'cost', 'supplies'],
  },
  {
    slug: 'move-in-move-out-cleaning',
    name: 'Move-In &amp; Move-Out Cleaning',
    short: 'Move-in / move-out cleaning',
    form: 'Move-in / move-out',
    icon: 'i-key',
    title: 'Move-In &amp; Move-Out Cleaning, Including Fort Drum PCS Moves',
    description:
      'Move-in and move-out cleaning across Lewis and Jefferson Counties, including Fort Drum PCS move-out cleans. Every corner ready for its next chapter. Free quotes.',
    intro:
      'Moving is enough work without cleaning an empty house. We make sure every corner is ready for its next chapter, whether you&rsquo;re handing back keys, getting a rental ready, or moving into a place that needs a fresh start.',
    included: [
      '<strong>Kitchens</strong> including cabinets, counters and appliances',
      '<strong>Bathrooms</strong> scrubbed and sanitized',
      '<strong>Floors, baseboards and trim</strong> throughout the home',
      '<strong>Fort Drum PCS</strong> move-out cleans on and off post',
    ],
    who: 'Homeowners, renters, landlords and military families. On Fort Drum we&rsquo;re happy to help with move-out cleans when it&rsquo;s time to PCS.',
    faqs: ['fortDrum', 'oneTime', 'cost'],
  },
  {
    slug: 'commercial-cleaning',
    name: 'Commercial Cleaning',
    short: 'Commercial cleaning',
    form: 'Commercial / office',
    icon: 'i-building',
    title: 'Commercial &amp; Office Cleaning in Lowville, Watertown &amp; Northern NY',
    description:
      'Office and commercial cleaning from Reali Clean: common areas, restrooms, breakrooms and floors on daily, weekly or custom schedules. Lewis, Jefferson and Herkimer Counties.',
    intro:
      'A clean workspace means productivity, professionalism and peace of mind. We build daily, weekly or custom schedules around your operations and budget.',
    included: [
      '<strong>Common areas</strong> dusted, vacuumed, mopped and sanitized',
      '<strong>Restroom detailing</strong> and full disinfecting',
      '<strong>Breakroom &amp; kitchen</strong> wipe-downs and appliance care',
      '<strong>Extras</strong> like windows, supply restocking and seasonal refreshes',
    ],
    who: 'Offices, storefronts, and other businesses across the North Country that want a dependable crew and a schedule that works around their hours.',
    faqs: ['cost', 'carpetAlone', 'payment'],
  },
  {
    slug: 'carpet-cleaning',
    name: 'Carpet Cleaning &amp; Floor Care',
    short: 'Carpet cleaning &amp; floor care',
    form: 'Carpet & floor care',
    icon: 'i-floor',
    title: 'Carpet Cleaning &amp; Floor Care in Lowville, Watertown &amp; Carthage',
    description:
      'Carpet shampooing with deep extraction, area rugs and upholstery on request, and strip &amp; wax for hard floors. Reali Clean serves homes and businesses across Northern NY.',
    intro:
      'Floors take the brunt of daily life. We use industry-grade equipment to restore, protect and bring the shine back to homes and high-traffic businesses.',
    included: [
      '<strong>Carpet shampooing</strong> with deep extraction and spot treatment',
      '<strong>Deodorizing</strong> plus area rugs and upholstery on request',
      '<strong>Strip &amp; wax</strong> for vinyl, tile and other hard floors',
      '<strong>Buffing &amp; burnishing</strong> for a polished, protected finish',
    ],
    who: 'Homes with high-traffic carpet, pets or stains, and businesses with floors that see a lot of boots. Book it on its own or add it to any clean.',
    faqs: ['carpetAlone', 'cost', 'supplies'],
  },
  {
    slug: 'airbnb-cleaning',
    name: 'Airbnb &amp; Vacation Rental Cleaning',
    short: 'Airbnb &amp; rental cleaning',
    form: 'Airbnb / rental turnover',
    icon: 'i-key',
    title: 'Airbnb &amp; Vacation Rental Cleaning in Old Forge, Lowville &amp; the North Country',
    description:
      'Airbnb and vacation rental turnovers: fresh linens, restocking, staging to match your listing, and damage and supply reports. Plus property support for hosts in Northern NY.',
    intro:
      'Five-star stays start with a spotless arrival. We keep your short-term rental guest-ready between every booking, so you can focus on hosting.',
    included: [
      '<strong>Full turnover clean</strong> with fresh linens and towels',
      '<strong>Restocking</strong> toiletries, paper goods and kitchen basics',
      '<strong>Staging</strong> to match your listing photos',
      '<strong>Damage &amp; supply reports</strong> so you&rsquo;re always in the loop',
    ],
    who: 'Short-term rental hosts and owners, from Adirondack camps around Old Forge to rentals near Fort Drum. Need more than a cleaner? We can oversee basic maintenance and coordinate trusted vendors for lawn care, snow removal and handyman work between stays.',
    faqs: ['cost', 'cancel', 'payment'],
  },
];

/** County groups for the service-areas hub (anchors match the homepage area cards). */
export const COUNTIES = [
  { id: 'lewis-county', name: 'Lewis County', blurb: 'Our home base: Lowville and the surrounding villages and towns.' },
  { id: 'fort-drum', name: 'Fort Drum', blurb: 'On-base housing and the surrounding communities, including PCS move-out cleans.' },
  { id: 'jefferson-county', name: 'Jefferson County', blurb: 'Watertown, Carthage, the Thousand Islands region and all surrounding areas.' },
  { id: 'herkimer-county', name: 'Herkimer County', blurb: 'Old Forge, the Adirondack camps and rentals, and all surrounding areas.' },
];

/** Town pages. county = a COUNTIES id; formArea = quote-form area option. */
export const AREAS = [
  {
    slug: 'lowville-ny',
    town: 'Lowville',
    county: 'lewis-county',
    formArea: 'Lewis County',
    intro:
      'Lowville is home. Reali Clean is based right here, so homes and businesses in and around Lowville get our quickest scheduling for recurring cleans, deep cleans, carpet care and everything in between.',
    highlight: ['house-cleaning', 'deep-cleaning', 'commercial-cleaning', 'carpet-cleaning'],
    nearby: ['croghan-ny', 'lyons-falls-ny', 'harrisville-ny', 'carthage-ny'],
  },
  {
    slug: 'watertown-ny',
    town: 'Watertown',
    county: 'jefferson-county',
    formArea: 'Jefferson County',
    intro:
      'From houses and apartments to offices and storefronts, we bring the same Reali Clean standard to Watertown. Carpet cleaning and floor care are popular here, for homes and for businesses with high-traffic floors.',
    highlight: ['carpet-cleaning', 'house-cleaning', 'commercial-cleaning', 'move-in-move-out-cleaning'],
    nearby: ['fort-drum-ny', 'carthage-ny', 'lowville-ny'],
  },
  {
    slug: 'carthage-ny',
    town: 'Carthage',
    county: 'jefferson-county',
    formArea: 'Jefferson County',
    intro:
      'Carthage sits right between our Lowville base and Watertown, which makes it an easy stop for recurring house cleaning, one-time deep cleans and carpet care.',
    highlight: ['house-cleaning', 'deep-cleaning', 'carpet-cleaning', 'move-in-move-out-cleaning'],
    nearby: ['fort-drum-ny', 'watertown-ny', 'lowville-ny'],
  },
  {
    slug: 'fort-drum-ny',
    town: 'Fort Drum',
    county: 'fort-drum',
    formArea: 'Fort Drum',
    intro:
      'We serve on-base housing and the surrounding communities, and we&rsquo;re happy to help with move-out cleans when it&rsquo;s time to PCS. Recurring and deep cleans are available too.',
    highlight: ['move-in-move-out-cleaning', 'deep-cleaning', 'house-cleaning', 'carpet-cleaning'],
    nearby: ['watertown-ny', 'carthage-ny', 'lowville-ny'],
    extraFaq: 'fortDrum',
  },
  {
    slug: 'croghan-ny',
    town: 'Croghan',
    county: 'lewis-county',
    formArea: 'Lewis County',
    intro:
      'Croghan is just down the road from our Lowville home base. We clean homes, camps and businesses in the area on a recurring or one-time basis.',
    highlight: ['house-cleaning', 'deep-cleaning', 'airbnb-cleaning', 'carpet-cleaning'],
    nearby: ['lowville-ny', 'harrisville-ny', 'lyons-falls-ny'],
  },
  {
    slug: 'lyons-falls-ny',
    town: 'Lyons Falls',
    county: 'lewis-county',
    formArea: 'Lewis County',
    intro:
      'Lyons Falls is part of our Lewis County home turf. Book recurring house cleaning, a one-time deep clean, a move-out clean or carpet care.',
    highlight: ['house-cleaning', 'deep-cleaning', 'move-in-move-out-cleaning', 'carpet-cleaning'],
    nearby: ['lowville-ny', 'croghan-ny'],
  },
  {
    slug: 'harrisville-ny',
    town: 'Harrisville',
    county: 'lewis-county',
    formArea: 'Lewis County',
    intro:
      'Harrisville homes and camps are part of our Lewis County service area. We handle recurring cleans, deep cleans and turnovers for seasonal rentals.',
    highlight: ['house-cleaning', 'airbnb-cleaning', 'deep-cleaning', 'carpet-cleaning'],
    nearby: ['croghan-ny', 'lowville-ny'],
  },
  {
    slug: 'old-forge-ny',
    town: 'Old Forge',
    county: 'herkimer-county',
    formArea: 'Herkimer County',
    intro:
      'Old Forge and the surrounding Adirondack camps keep busy with visitors, and we help hosts keep up. We turn over Airbnb and vacation rentals between guests and handle deep cleans for camps and homes.',
    highlight: ['airbnb-cleaning', 'deep-cleaning', 'house-cleaning', 'carpet-cleaning'],
    nearby: ['lyons-falls-ny', 'lowville-ny'],
  },
];

export { FAQ };

/**
 * Old-site addresses that get a real redirect page (lowercase, no trailing slash).
 * The old site couldn't be read or found in an archive from here, so these are the usual
 * page names for a small-business site, plus "locations" (the old homepage title).
 * Every other old address is handled by 404.html, which sends it to the closest new page
 * by its words (see the rules in build-pages.mjs). When Google Search Console lists the
 * real old URLs, add any that matter here so they get a proper redirect page.
 */
export const LEGACY_REDIRECTS = {
  // Confirmed old-site pages (Google site:realiclean.net, Nov 20, 2026).
  '/services-customers': '/services/',
  '/faq-privacy': '/#faq',
  // Likely old-site page names.
  '/locations': '/service-areas/',
  '/location': '/service-areas/',
  '/home': '/',
  '/contact': '/#quote',
  '/contact-us': '/#quote',
  '/quote': '/#quote',
  '/free-quote': '/#quote',
  '/about': '/#about',
  '/about-us': '/#about',
  '/reviews': '/#reviews',
  '/gallery': '/#results',
  '/faq': '/#faq',
};
