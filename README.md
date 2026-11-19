# Reali Clean: website redesign

A fresh, single-page marketing site for **Reali Clean LLC** (Lowville, NY), rebuilt from the content on realiclean.net and the Reali Clean Facebook page.

The site is plain HTML, CSS and JS with no build step, so any static host can serve it.

```
index.html            Main page (hero, services, how it works, before/after, story, reviews, areas, FAQ, quote form)
privacy.html          Privacy policy
assets/css/styles.css All styles (brand tokens are at the top in :root)
assets/js/main.js     Mobile nav, before/after sliders, scroll reveals, quote form
assets/img/           Logo mascot, illustration, before/after photos (WebP)
CNAME                 Custom domain for GitHub Pages (reali.evanjennings.com)
```

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploy to reali.evanjennings.com (GitHub Pages)

1. In the repo, go to **Settings → Pages**, set the source to **Deploy from a branch**, and pick the branch and `/ (root)`.
2. In DNS for `evanjennings.com`, add a `CNAME` record: `reali` → `<github-username>.github.io`.
3. Back in **Settings → Pages**, confirm the custom domain is `reali.evanjennings.com` and turn on **Enforce HTTPS** once the certificate is issued.

On Netlify, Vercel or Cloudflare Pages, point the project at the repo root with no build command and add `reali.evanjennings.com` as a custom domain.

## Quote form

By default, **Request my free quote** opens the visitor's email app with a pre-filled message to `realiclean@gmail.com`. To have submissions delivered without relying on the visitor's email app, create a free form endpoint (for example Formspree) and paste its URL into `FORM_ENDPOINT` at the top of `assets/js/main.js`.

## Before going live

- **Service area town names.** The area cards list example towns (Croghan, Lyons Falls, Watertown, Carthage, Old Forge and so on). The old site only said "all surrounding areas", so check these with the owner.
- **Fort Drum PCS move-out cleans.** Mentioned in the Fort Drum card and FAQ; confirm they offer this.
- **Canonical URLs.** `index.html` uses `https://reali.evanjennings.com/`. If the site moves to `realiclean.net`, update the canonical, Open Graph and JSON-LD URLs in the `<head>` and the `CNAME` file.
