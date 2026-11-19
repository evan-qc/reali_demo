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

The form is in **demo mode** (`DEMO_MODE = true` in `assets/js/main.js`). A yellow banner on the form and a "Demo preview" card beside it explain what the live version will automate. Submitting plays an animated walkthrough of the production flow using the visitor's own details. Nothing is sent.

The demo flow shows:

1. Email to Reali Clean with every detail of the request
2. Text alert to the owner's phone
3. Auto-reply text to the customer
4. QuickBooks Online customer created
5. QuickBooks Online draft estimate created from the selected services
6. Lead logged in a tracker (Airtable or Google Sheets) with a follow-up reminder

The side card also lists a booking link and post-job review requests.

### Going live

1. Point the form at an automation endpoint (Zapier/Make webhook, or a small serverless function) by setting `FORM_ENDPOINT` in `assets/js/main.js`. The form POSTs JSON with `name`, `phone`, `email`, `services`, `area`, `frequency` and `message`.
2. Wire that endpoint to email, SMS (e.g. Twilio), QuickBooks Online (customer + estimate), and the lead tracker.
3. Set `DEMO_MODE = false` and remove the `.demo-banner` and `.automation-card` markup from `index.html`.

If `DEMO_MODE` is false and `FORM_ENDPOINT` is empty, the form opens the visitor's email app with a pre-filled message to `realiclean@gmail.com`.

## Before going live

- **Service area town names.** The area cards list example towns (Croghan, Lyons Falls, Watertown, Carthage, Old Forge and so on). The old site only said "all surrounding areas", so check these with the owner.
- **Fort Drum PCS move-out cleans.** Mentioned in the Fort Drum card and FAQ; confirm they offer this.
- **Canonical URLs.** `index.html` uses `https://reali.evanjennings.com/`. If the site moves to `realiclean.net`, update the canonical, Open Graph and JSON-LD URLs in the `<head>` and the `CNAME` file.
