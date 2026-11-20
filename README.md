# Reali Clean: website redesign

A fresh marketing site for **Reali Clean LLC** (Lowville, NY), rebuilt from the content on realiclean.net and the Reali Clean Facebook page.

The site is plain HTML, CSS and JS with no build step, so any static host can serve it.

```
index.html            Main page (hero, services, how it works, before/after, story, reviews, areas, FAQ, quote form)
privacy.html          Privacy policy
assets/css/styles.css All styles (brand tokens are at the top in :root)
assets/js/main.js     Mobile nav, before/after sliders, scroll reveals, quote form
assets/img/           Logo mascot, illustration, before/after photos (WebP)
CNAME                 Custom domain for GitHub Pages (realiclean.net)
```

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Pages and SEO

`index.html` is the homepage. Everything else is generated from `scripts/site-data.mjs` by
`node scripts/build-pages.mjs` (Node 18+, no dependencies), which copies the header, footer
and icons from `index.html` so every page matches:

```
services/<service>/      6 service pages (house, deep, move-in/out, commercial, carpet, Airbnb)
areas/<town>-ny/         8 town pages (Lowville, Watertown, Carthage, Fort Drum, Croghan,
                         Lyons Falls, Harrisville, Old Forge)
services/, service-areas/  hub pages
<old-path>/index.html    redirect pages for old-site addresses
404.html                 sends any other old address to the closest new page by its words
sitemap.xml, robots.txt
```

Edit the content in `scripts/site-data.mjs` (or the header/footer in `index.html`), run the
build, and commit the generated files. Submit `https://realiclean.net/sitemap.xml` in Google
Search Console.

### Old URLs

Confirmed old-site pages (`/home`, `/about`, `/contact`, `/services-customers`, `/faq-privacy`)
and common page names (`/locations`, `/contact-us`, `/about-us`, …) each have a redirect page
(`LEGACY_REDIRECTS` in `scripts/site-data.mjs`). GitHub Pages can't send server-side 301s, so
these use an instant meta refresh plus a canonical link, which Google treats as a permanent
redirect. Any other old address hits `404.html`, which redirects by keyword (a URL containing
"watertown" goes to the Watertown page, "carpet" to carpet care, "contact" to the quote form,
anything else to the homepage). When Search Console's Pages report lists other old URLs, add
them to `LEGACY_REDIRECTS` and rebuild.

## Deploying (GitHub Pages)

`.github/workflows/pages.yml` publishes the site on every push to `main`.

1. **Settings → Pages → Build and deployment → Source: GitHub Actions.** Custom domain:
   `realiclean.net`, with **Enforce HTTPS** on.
2. DNS (Bluehost): `@` → A records `185.199.108.153`, `.109.153`, `.110.153`, `.111.153`;
   `www` → CNAME `evan-qc.github.io`.

## Quote form

The form posts to a Zapier **Catch Hook** (form-encoded fields `token`, `name`, `phone`,
`email`, `services`, `area`, `frequency`, `message`, `page`, `submitted_at`).

1. In Zapier, create a Zap with **Webhooks by Zapier → Catch Hook**, then a **Filter** step:
   only continue if `token` exactly matches your form token. Add the email/SMS/QuickBooks steps
   after the filter.
2. In GitHub, **Settings → Secrets and variables → Actions**, add `ZAPIER_HOOK_URL` (the catch
   hook URL) and `FORM_TOKEN` (any long random string, the same one the Zap filters on).
3. Push to `main` (or re-run the "Deploy site" workflow). The workflow writes both values into
   the published copy of `assets/js/main.js`; they're never committed to this public repo.

Abuse protection: a hidden spam-trap field, a minimum time on the page before submitting, one
submission per minute per browser, and the token filter in the Zap. The token and hook URL are
visible to anyone who reads the live page's JavaScript, so these stop casual bots, not a
determined attacker. For stronger protection, put Cloudflare Turnstile and a small Worker in
front of the Zap. If either secret is missing, the form falls back to opening the visitor's
email app addressed to `realiclean@gmail.com`.

## Before going live

- **Service area towns.** The town pages (Croghan, Lyons Falls, Harrisville, Watertown,
  Carthage, Old Forge, Fort Drum) come from the homepage's area cards; confirm them with the owner.
- **Fort Drum PCS move-out cleans.** Mentioned on the Fort Drum and move-out pages and in the
  FAQ; confirm they offer this.
