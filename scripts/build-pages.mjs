#!/usr/bin/env node
// Builds the service pages, town pages, hub pages, old-URL redirect pages, 404.html,
// sitemap.xml and robots.txt. The header, footer, mobile bar and icons are copied from
// index.html, so every page stays in step with the homepage.
//
//   node scripts/build-pages.mjs
//
// Content lives in scripts/site-data.mjs. Commit the generated files: the site has no
// build step on GitHub Pages beyond the form settings filled in by the deploy workflow.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { AREAS, COUNTIES, FAQ, LEGACY_REDIRECTS, PHONE, PHONE_TEL, SERVICES, SITE } from './site-data.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const home = readFileSync(join(root, 'index.html'), 'utf8');
const today = new Date().toISOString().slice(0, 10);

// ---------------------------------------------------------------------------
// Shared chrome, lifted from the homepage and made to work from any folder.
// ---------------------------------------------------------------------------
const grab = (re, what) => {
  const m = home.match(re);
  if (!m) throw new Error(`Couldn't find the ${what} in index.html`);
  return m[0];
};
const fromRoot = (html) =>
  html
    .replace(/href="#top"/g, 'href="/"')
    .replace(/href="#/g, 'href="/#')
    .replace(/(src|href)="assets\//g, '$1="/assets/')
    .replace(/href="privacy\.html"/g, 'href="/privacy.html"');

const HEADER = fromRoot(grab(/<header class="site-header"[\s\S]*?<\/header>/, 'header'));
const FOOTER = fromRoot(grab(/<footer class="site-footer">[\s\S]*?<\/footer>/, 'footer'));
const MOBILE_BAR = fromRoot(grab(/<div class="mobile-bar">[\s\S]*?<\/div>/, 'mobile bar'));
const SPRITE = grab(/<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" style="display:none">[\s\S]*?<\/svg>\n/, 'icon sprite');
const FONTS = grab(/<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">[\s\S]*?rel="stylesheet">/, 'font links');
const BUSINESS_ID = `${SITE}/#business`;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const text = (html) => html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&rsquo;/g, '’').replace(/&nbsp;/g, ' ');
const svc = (slug) => SERVICES.find((s) => s.slug === slug);
const area = (slug) => AREAS.find((a) => a.slug === slug);
const quoteLink = ({ service, area: a } = {}) => {
  const q = new URLSearchParams();
  if (service) q.set('service', service);
  if (a) q.set('area', a);
  const qs = q.toString();
  return `/${qs ? `?${qs}` : ''}#quote`;
};

function page({ path, title, description, body, jsonld = [], crumbs = [] }) {
  const url = `${SITE}${path}`;
  const breadcrumbLd = crumbs.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [{ name: 'Home', path: '/' }, ...crumbs].map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: text(c.name),
          item: `${SITE}${c.path}`,
        })),
      }
    : null;
  const ld = [...jsonld, breadcrumbLd].filter(Boolean);
  const crumbHtml = crumbs.length
    ? `<nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a>${crumbs
        .map((c, i) =>
          i === crumbs.length - 1 ? ` <span aria-hidden="true">/</span> <span aria-current="page">${c.name}</span>` : ` <span aria-hidden="true">/</span> <a href="${c.path}">${c.name}</a>`,
        )
        .join('')}</nav>`
    : '';
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} | Reali Clean</title>
  <meta name="description" content="${esc(text(description))}">
  <meta name="theme-color" content="#2f6b1a">
  <link rel="canonical" href="${url}">
  <link rel="icon" type="image/png" href="/assets/img/favicon.png">
  <link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(text(title))} | Reali Clean">
  <meta property="og:description" content="${esc(text(description))}">
  <meta property="og:image" content="${SITE}/assets/img/og-image.jpg">
  <meta property="og:url" content="${url}">
  ${FONTS}
  <link rel="stylesheet" href="/assets/css/styles.css">
${ld.map((x) => `  <script type="application/ld+json">\n${JSON.stringify(x, null, 2)}\n  </script>`).join('\n')}
</head>
<body class="subpage">
  <a class="skip-link" href="#main">Skip to content</a>
  ${HEADER}

  <main id="main">
    <section class="page-hero">
      <div class="container">
        ${crumbHtml}
${body.hero}
      </div>
    </section>
${body.main}
    <section class="section section-green cta-band">
      <div class="container cta-inner">
        <div>
          <h2>Ready for a Reali Clean?</h2>
          <p>Quotes are always free. Call or text <a href="tel:${PHONE_TEL}">${PHONE}</a>, or tell us about your space online.</p>
        </div>
        <div class="cta-actions">
          <a class="btn btn-red btn-lg" href="${body.quote ?? quoteLink()}">Get a free quote</a>
          <a class="btn btn-ghost btn-lg" href="tel:${PHONE_TEL}">Call ${PHONE}</a>
        </div>
      </div>
    </section>
  </main>

  ${FOOTER}

  ${MOBILE_BAR}

  ${SPRITE}
  <script src="/assets/js/main.js" defer></script>
</body>
</html>
`;
}

const faqHtml = (keys) => `
    <section class="section">
      <div class="container narrow">
        <header class="section-head section-head-left">
          <p class="kicker">FAQ</p>
          <h2>Good questions, honest answers</h2>
        </header>
        <div class="faq">
${keys
  .map(
    (k) => `          <details>
            <summary>${FAQ[k].q}</summary>
            <p>${FAQ[k].a}</p>
          </details>`,
  )
  .join('\n')}
        </div>
      </div>
    </section>`;
const faqLd = (keys) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: keys.map((k) => ({
    '@type': 'Question',
    name: text(FAQ[k].q),
    acceptedAnswer: { '@type': 'Answer', text: text(FAQ[k].a) },
  })),
});

const linkCards = (items) => `<ul class="link-cards">
${items.map((i) => `          <li><a href="${i.href}"><strong>${i.title}</strong>${i.sub ? `<span>${i.sub}</span>` : ''}</a></li>`).join('\n')}
        </ul>`;

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------
const out = new Map(); // path -> html
const sitemap = ['/'];

for (const s of SERVICES) {
  const path = `/services/${s.slug}/`;
  sitemap.push(path);
  out.set(
    path,
    page({
      path,
      title: s.title,
      description: s.description,
      crumbs: [
        { name: 'Services', path: '/services/' },
        { name: s.name, path },
      ],
      jsonld: [
        {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: text(s.name),
          serviceType: text(s.name),
          url: `${SITE}${path}`,
          description: text(s.description),
          provider: { '@type': 'HouseCleaningService', '@id': BUSINESS_ID, name: 'Reali Clean LLC', telephone: '+1-315-804-4188', url: `${SITE}/` },
          areaServed: AREAS.map((a) => ({ '@type': 'City', name: `${a.town}, NY` })),
        },
        faqLd(s.faqs),
      ],
      body: {
        quote: quoteLink({ service: s.form }),
        hero: `        <p class="kicker">Cleaning services</p>
        <h1>${s.name}</h1>
        <p class="lede">${s.intro}</p>
        <div class="hero-ctas">
          <a class="btn btn-red btn-lg" href="${quoteLink({ service: s.form })}">Get a free quote</a>
          <a class="btn btn-ghost btn-lg" href="tel:${PHONE_TEL}">Call ${PHONE}</a>
        </div>`,
        main: `
    <section class="section">
      <div class="container two-col">
        <div>
          <h2>What&rsquo;s included</h2>
          <ul class="checklist">
${s.included.map((li) => `            <li>${li}</li>`).join('\n')}
          </ul>
        </div>
        <div>
          <h2>Who it&rsquo;s for</h2>
          <p>${s.who}</p>
          <p>Weekly, bi-weekly, monthly or one time: tell us what you need and we&rsquo;ll tailor a plan around it. We bring all the supplies and equipment.</p>
        </div>
      </div>
    </section>

    <section class="section section-sage">
      <div class="container">
        <header class="section-head">
          <p class="kicker">Where we work</p>
          <h2>${text(s.short)} near you</h2>
          <p>Based in Lowville and serving homes and businesses across the North Country.</p>
        </header>
        ${linkCards(AREAS.map((a) => ({ href: `/areas/${a.slug}/`, title: `${a.town}, NY`, sub: COUNTIES.find((c) => c.id === a.county).name })))}
        <p class="center"><a href="/service-areas/">See all service areas &rarr;</a></p>
      </div>
    </section>
${faqHtml(s.faqs)}`,
      },
    }),
  );
}

out.set(
  '/services/',
  page({
    path: '/services/',
    title: 'Cleaning Services in Lowville &amp; Northern NY',
    description:
      'House, deep, move-in/move-out, commercial, carpet and Airbnb cleaning from Reali Clean, a Lowville, NY cleaning company serving Lewis, Jefferson and Herkimer Counties.',
    crumbs: [{ name: 'Services', path: '/services/' }],
    body: {
      hero: `        <p class="kicker">What we clean</p>
        <h1>Cleaning services for homes, businesses and rentals</h1>
        <p class="lede">Weekly, bi-weekly, monthly or one time. Tell us what you need and we&rsquo;ll tailor a plan around it.</p>`,
      main: `
    <section class="section">
      <div class="container">
        ${linkCards(SERVICES.map((s) => ({ href: `/services/${s.slug}/`, title: s.name, sub: s.intro.split('. ')[0] + '.' })))}
      </div>
    </section>`,
    },
  }),
);
sitemap.push('/services/');

for (const a of AREAS) {
  const path = `/areas/${a.slug}/`;
  sitemap.push(path);
  const county = COUNTIES.find((c) => c.id === a.county);
  const faqs = [a.extraFaq, 'cost', 'oneTime', 'supplies'].filter(Boolean).slice(0, 3);
  out.set(
    path,
    page({
      path,
      title: `Cleaning Services in ${a.town}, NY: House, Carpet &amp; Commercial`,
      description: `Reali Clean provides house cleaning, deep cleaning, carpet cleaning, move-out, commercial and Airbnb cleaning in ${a.town}, NY${county.id === 'fort-drum' ? '' : ` and across ${county.name}`}. Free quotes: ${PHONE}.`,
      crumbs: [
        { name: 'Service areas', path: '/service-areas/' },
        { name: `${a.town}, NY`, path },
      ],
      jsonld: [
        {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: `Cleaning services in ${a.town}, NY`,
          url: `${SITE}${path}`,
          provider: { '@type': 'HouseCleaningService', '@id': BUSINESS_ID, name: 'Reali Clean LLC', telephone: '+1-315-804-4188', url: `${SITE}/` },
          areaServed: { '@type': 'City', name: `${a.town}, NY` },
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: `Cleaning in ${a.town}`,
            itemListElement: SERVICES.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: text(s.name), url: `${SITE}/services/${s.slug}/` } })),
          },
        },
        faqLd(faqs),
      ],
      body: {
        quote: quoteLink({ area: a.formArea }),
        hero: `        <p class="kicker">${county.name}</p>
        <h1>House, carpet &amp; commercial cleaning in ${a.town}, NY</h1>
        <p class="lede">${a.intro}</p>
        <div class="hero-ctas">
          <a class="btn btn-red btn-lg" href="${quoteLink({ area: a.formArea })}">Get a free quote in ${a.town}</a>
          <a class="btn btn-ghost btn-lg" href="tel:${PHONE_TEL}">Call ${PHONE}</a>
        </div>`,
        main: `
    <section class="section">
      <div class="container">
        <header class="section-head">
          <p class="kicker">Services in ${a.town}</p>
          <h2>What we clean in ${a.town}</h2>
        </header>
        ${linkCards(
          [...a.highlight, ...SERVICES.map((s) => s.slug).filter((x) => !a.highlight.includes(x))].map((slug) => {
            const s = svc(slug);
            return { href: `/services/${s.slug}/`, title: `${s.name} in ${a.town}`, sub: s.intro.split('. ')[0] + '.' };
          }),
        )}
      </div>
    </section>

    <section class="section section-sage">
      <div class="container two-col">
        <div>
          <h2>Why ${a.town} chooses Reali Clean</h2>
          <ul class="checklist">
            <li><strong>Local and family-owned</strong> in Lowville, serving ${a.town} and the North Country</li>
            <li><strong>Free quotes</strong>, every job priced to your space and what you need</li>
            <li><strong>We bring everything</strong>: professional-grade products and equipment</li>
            <li><strong>Flexible scheduling</strong>: weekly, bi-weekly, monthly or one time</li>
          </ul>
        </div>
        <div>
          <h2>Nearby areas we serve</h2>
          <ul class="town-links">
${a.nearby.map((n) => `            <li><a href="/areas/${n}/">${area(n).town}, NY</a></li>`).join('\n')}
            <li><a href="/service-areas/">All service areas</a></li>
          </ul>
        </div>
      </div>
    </section>
${faqHtml(faqs)}`,
      },
    }),
  );
}

out.set(
  '/service-areas/',
  page({
    path: '/service-areas/',
    title: 'Service Areas: Lowville, Watertown, Fort Drum &amp; Northern NY',
    description:
      'Reali Clean serves Lowville, Watertown, Carthage, Fort Drum, Croghan, Lyons Falls, Harrisville, Old Forge and all of Lewis, Jefferson and Herkimer Counties.',
    crumbs: [{ name: 'Service areas', path: '/service-areas/' }],
    body: {
      hero: `        <p class="kicker">Service areas</p>
        <h1>Proudly local to Northern New York</h1>
        <p class="lede">Based in Lowville and serving homes and businesses across the North Country. Not sure if we cover you? Just ask.</p>`,
      main: COUNTIES.map(
        (c, i) => `
    <section class="section${i % 2 ? ' section-sage' : ''}" id="${c.id}">
      <div class="container">
        <header class="section-head section-head-left">
          <h2>${c.name}</h2>
          <p>${c.blurb}</p>
        </header>
        ${linkCards(
          AREAS.filter((a) => a.county === c.id).map((a) => ({ href: `/areas/${a.slug}/`, title: `${a.town}, NY`, sub: 'House, carpet, commercial &amp; rental cleaning' })),
        )}
      </div>
    </section>`,
      ).join('\n'),
    },
  }),
);
sitemap.push('/service-areas/');
sitemap.push('/privacy.html');

// ---------------------------------------------------------------------------
// Redirects for old-site addresses.
// ---------------------------------------------------------------------------
const redirectPage = (target) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>This page has moved | Reali Clean</title>
  <meta http-equiv="refresh" content="0; url=${target}">
  <link rel="canonical" href="${SITE}${target.split('#')[0]}">
  <script>location.replace(${JSON.stringify(target)} + location.search.replace(/^\\?$/, ""));</script>
</head>
<body>
  <p>This page has moved to <a href="${target}">${SITE}${target}</a>.</p>
</body>
</html>
`;
const redirectFiles = new Map(); // file path -> html
for (const [from, to] of Object.entries(LEGACY_REDIRECTS)) {
  if (out.has(`${from}/`)) continue; // a real page lives there now
  // One folder serves /x, /x/ and /x/index.html; 404.html covers /x.html and anything else.
  redirectFiles.set(`${from.slice(1)}/index.html`, redirectPage(to));
}

// Any other old address: send it to the closest new page by its words.
const rules = [
  ...AREAS.map((a) => [a.town.toLowerCase().replace(/\s+/g, '[-_ ]?'), `/areas/${a.slug}/`]),
  ['lewis', '/service-areas/#lewis-county'],
  ['jefferson', '/service-areas/#jefferson-county'],
  ['herkimer|adirondack', '/service-areas/#herkimer-county'],
  ['carpet|rug|floor|upholster|strip|wax', '/services/carpet-cleaning/'],
  ['airbnb|rental|vacation|turnover|host|camp', '/services/airbnb-cleaning/'],
  ['move|moving|pcs', '/services/move-in-move-out-cleaning/'],
  ['deep', '/services/deep-cleaning/'],
  ['commercial|office|business|janitor', '/services/commercial-cleaning/'],
  ['residential|house|home-clean|maid|housekeep', '/services/house-cleaning/'],
  ['location|area|town|city|county|serv(e|ing)-', '/service-areas/'],
  ['service', '/services/'],
  ['contact|quote|estimate|book|schedule|appointment', '/#quote'],
  ['about|story|team|owner', '/#about'],
  ['review|testimonial', '/#reviews'],
  ['faq|question', '/#faq'],
  ['gallery|photo|result|before|after', '/#results'],
  ['privacy', '/privacy.html'],
];
const exact = Object.fromEntries(Object.entries(LEGACY_REDIRECTS).map(([k, v]) => [k.replace(/\.html$/, ''), v]));
const notFound = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Page moved | Reali Clean</title>
  <meta name="robots" content="noindex">
  <link rel="icon" type="image/png" href="/assets/img/favicon.png">
  <link rel="stylesheet" href="/assets/css/styles.css">
  <script>
    // Old-site links: send each one to the closest page on the new site.
    (function () {
      var exact = ${JSON.stringify(exact)};
      var rules = ${JSON.stringify(rules)};
      var p = decodeURIComponent(location.pathname).toLowerCase()
        .replace(/\\/(index|default|home)\\.(html?|php|aspx?)$/, "/")
        .replace(/\\.(html?|php|aspx?)$/, "")
        .replace(/\\/+$/, "") || "/";
      var target = exact[p];
      for (var i = 0; !target && i < rules.length; i++) {
        if (new RegExp(rules[i][0]).test(p)) target = rules[i][1];
      }
      location.replace(target || "/");
    })();
  </script>
</head>
<body>
  <main class="container" style="padding:80px 0;text-align:center">
    <h1>This page has moved</h1>
    <p>Taking you to the new Reali Clean site&hellip; If nothing happens, <a href="/">go to the homepage</a>.</p>
  </main>
</body>
</html>
`;

// ---------------------------------------------------------------------------
// Write everything (generated folders are cleared first so removed pages disappear).
// ---------------------------------------------------------------------------
for (const dir of ['services', 'areas', 'service-areas']) rmSync(join(root, dir), { recursive: true, force: true });
for (const file of redirectFiles.keys()) rmSync(join(root, file.split('/')[0]), { recursive: true, force: true });

const write = (rel, html) => {
  const full = join(root, rel);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, html);
};
for (const [path, html] of out) write(`${path.slice(1)}index.html`, html);
for (const [file, html] of redirectFiles) write(file, html);
write('404.html', notFound);
write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap.map((p) => `  <url><loc>${SITE}${p}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`,
);
write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

console.log(`Built ${out.size} pages, ${redirectFiles.size} redirect pages, 404.html, sitemap.xml (${sitemap.length} URLs), robots.txt`);
