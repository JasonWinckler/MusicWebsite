# Jason Shadow — MusicWebsite

Production repository for the public Jason Shadow artist, singer, speaker and
booking website at [jason-shadow.com](https://jason-shadow.com/). It is a
static, mobile-first Vite site hosted by Cloudflare Pages and does not require
an application backend, database or runtime environment variables.

This README is the canonical handoff for a new Codex task or maintainer. Read
it completely before changing the live brand, deployment or legal pages.

## Production identity

| Item | Production value |
| --- | --- |
| Repository | `JasonWinckler/MusicWebsite` |
| Canonical domain | `https://jason-shadow.com` |
| Optional alias | `https://www.jason-shadow.com` if configured in Cloudflare |
| Hosting | Dedicated Cloudflare Pages project |
| Production branch | `main` |
| Build command | `npm run build` |
| Build output | `dist` |
| Runtime variables | None |
| Backend/database | None |
| Appwrite | No SDK, endpoint, build, hosting or runtime dependency |

The music website is a separate brand from Shadow's Temptation and The Order
of Shadows. Do not add adult-platform copy, private membership functions or
Order-specific community content here unless the user explicitly changes that
brand boundary.

## Current site scope

| Route | Purpose | Source |
| --- | --- | --- |
| `/` | Bilingual artist landing page, services, portfolio, news and booking | `index.html`, `src/main.js`, `script.js` |
| `/affiliates/` | Public affiliate LinkHub and PayPal support action | `affiliates/index.html`, `src/affiliates.js` |
| `/impressum/` | German legal notice | `impressum/index.html` |
| `/datenschutz/` | German privacy notice | `datenschutz/index.html` |

The homepage has English and German UI copy, responsive navigation, hero
branding, presentation-video slot, three service cards, portfolio carousel,
version-controlled news and a project-request form. The affiliate route uses
the same brand shell with separate partner artwork.

## Architecture

```text
GitHub main
  |
  | Cloudflare Pages Git integration
  v
npm run build
  |-- Vite multi-page build
  |-- fingerprinted JS/CSS and imported affiliate artwork
  `-- scripts/copy-static.js
       |-- copies uploads/
       |-- writes dist/_redirects
       `-- writes dist/_headers
              |
              v
Cloudflare Pages --> jason-shadow.com
```

All editorial site data is shipped with the build. The browser does not ping a
backend, query a database or need an API token.

### Build entries

`vite.config.js` defines four HTML entries: homepage, affiliates, impressum and
datenschutz. `scripts/copy-static.js` then copies the root `uploads/` directory
and writes Cloudflare Pages routing/security files.

The generated redirects keep direct links and browser refreshes working:

```text
/affiliates/*  -> /affiliates/index.html
/impressum/*   -> /impressum/index.html
/datenschutz/* -> /datenschutz/index.html
/*             -> /index.html
```

Existing output files take precedence over the fallback.

## Repository layout

| Path | Responsibility |
| --- | --- |
| `index.html` | Homepage document metadata and Vite entry |
| `src/main.js` | Homepage markup and initial data rendering |
| `script.js` | Active bilingual copy and homepage interactions; imported by `src/main.js` |
| `src/data.js` | Navigation, services, portfolio, news and affiliate partner data |
| `src/components.js` | Shared header, footer, mobile menu and reveal behavior |
| `src/affiliates.js` | Affiliate cards, social/website links and PayPal support action |
| `assets/css/` | Shared, homepage and affiliate styles |
| `uploads/` | Homepage profile, banner, presentation and portfolio source media |
| `affiliates/uploads/` | Affiliate-only artwork imported and fingerprinted by Vite |
| `impressum/` | Legal notice entry |
| `datenschutz/` | Privacy notice entry |
| `scripts/copy-static.js` | Cloudflare output preparation |
| `tests/visual.spec.js` | Route, responsive and interaction regression tests |
| `playwright.config.js` | Desktop, Pixel 7 and iPad test projects |

Do not edit generated `dist/` files. Change the sources and rebuild.

## Content editing

### Navigation and services

Edit `navigation` and `services` in `src/data.js`. When customer-facing copy
has a German translation in `script.js`, update both languages together.

### Portfolio

Each `portfolio` entry in `src/data.js` has a title, description and file stem.
For a stem such as `Auftrag1`, the UI looks for:

```text
uploads/portfolio/Auftrag1.mp4
uploads/portfolio/Auftrag1.png
```

Video takes precedence when available; the image or an explicit upload
placeholder keeps the card usable otherwise. Preserve the carousel tests and
verify that all media is licensed for publication.

### Presentation video

The homepage expects:

```text
uploads/about/introduction.mp4
```

Until that file exists, the designed placeholder and profile poster remain
visible. The signature-song control is likewise currently a documented audio
placeholder and must not claim playback is available until a real, licensed
asset and interaction are implemented.

### News

`fallbackNews` in `src/data.js` is the only source of news. There is no CMS or
remote feed. Edit, translate and review its release dates before publishing.

### Profile and banner

- `uploads/profile.png` — main profile image;
- `uploads/banner.jfif` — main hero and affiliate banner;
- `affiliates/uploads/profile.png` and `banner.jfif` — retained affiliate
  source variants;
- `affiliates/uploads/*.webp` — affiliate partner tiles.

Keep images web-optimised, correctly licensed and free of embedded secrets or
personal metadata that should not be public.

## External integrations and privacy

The static site currently uses only deliberate outbound integrations:

- the booking form posts to `formsubmit.co` for
  `business@jason-shadow.com`;
- affiliate cards open external partner URLs and use `rel="sponsored"`;
- social/profile links open their declared external destinations;
- the support action opens the configured PayPal hosted donation page.

The site has no account system, cookies, local/session storage, analytics
pixel, database or cross-site tracking code. Do not add tracking or marketing
scripts without an explicit privacy/legal decision and corresponding update to
`datenschutz/index.html`.

Because the booking form transfers name, email and message to FormSubmit, any
change of provider, fields, recipient or retention representation must be
reflected in the privacy notice before release.

## Security and caching

`scripts/copy-static.js` generates Cloudflare Pages headers that enforce:

- `X-Content-Type-Options: nosniff`;
- `Referrer-Policy: strict-origin-when-cross-origin`;
- disabled camera, microphone and geolocation permissions;
- `X-Frame-Options: DENY` and CSP `frame-ancestors 'none'`;
- a restrictive Content Security Policy with an explicit FormSubmit action;
- HTTPS upgrade for insecure subresources;
- one-year immutable caching for fingerprinted `/assets/*` files.

If a new external image, script, frame, form endpoint or connection is added,
update the CSP narrowly rather than weakening it globally. Source images under
`/uploads/` are not fingerprinted; replace them carefully and verify Cloudflare
cache behavior after a deployment.

Never commit credentials. Vite exposes every `VITE_*` value to browsers, so a
future client-side environment variable may contain only public configuration.

## Local development

Prerequisites: a current supported Node.js release and npm.

```bash
npm ci
npm run dev
```

No `.env.local` file is required. `.env.example` exists to make the absence of
runtime variables explicit.

Build and inspect the production output:

```bash
npm run build
npm run preview
```

The build empties and recreates `dist/`, fingerprints imported JS/CSS/media,
copies root uploads and writes `_redirects` plus `_headers`.

## Tests and acceptance

Install Playwright Chromium once when necessary:

```bash
npm run install:browsers
```

Run the production browser suite:

```bash
npm run test:browser
```

Playwright builds and previews the site, then checks desktop, Pixel 7 and iPad
layouts. Existing coverage verifies:

- all four routes load directly without horizontal overflow or page errors;
- mobile navigation and Escape-key behavior;
- German/English switching;
- portfolio navigation and budget interaction;
- affiliate images load from fingerprinted assets.

A release is acceptable only when:

- `npm run build` and `npm run test:browser` pass;
- all four production routes load over valid HTTPS;
- desktop, tablet and mobile layouts have no clipped text or media;
- the booking form, affiliate links and PayPal action use the intended
  destinations;
- metadata, contact details and legal pages are consistent;
- the browser console and network panel show no unexpected failures;
- no adult-platform or Order-specific copy crossed the brand boundary.

## Cloudflare Pages deployment

The dedicated Pages project should remain connected to
`JasonWinckler/MusicWebsite` with:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Root directory | Repository root |
| Build command | `npm run build` |
| Output directory | `dist` |
| Runtime variables | None |
| Custom domain | `jason-shadow.com` |
| Optional custom domain | `www.jason-shadow.com` |

Normal content releases require only a tested push to `main`; they do not
require a DNS change. The zone and mail records must not be modified as part of
a website deployment. In particular, preserve Microsoft 365 MX, SPF, DKIM and
DMARC records when working on the apex domain.

Cloudflare Pages provides deployment history. Roll back by promoting a known-
good deployment. Do not re-point the domain to Appwrite as a release rollback.

## SEO and discoverability

Each HTML entry owns its `<title>` and description. Keep the public homepage
focused on the Jason Shadow music/voice/hosting brand and use natural copy
rather than keyword stuffing.

When improving SEO, review together:

- unique title and description per public route;
- canonical URL and `www` redirect behavior;
- Open Graph/Twitter preview image, title and description;
- structured data appropriate to a performer or professional service;
- `robots.txt` and `sitemap.xml` generation, which are not currently part of
  this repository's build;
- internal links, image alt text and real portfolio/news content;
- Google Search Console verification without adding invasive tracking.

Search indexing is not immediate and cannot be guaranteed by cookies or meta
keywords. Avoid hidden text, unrelated terms and duplicated pages.

## Troubleshooting

### A direct route shows the homepage

Build again and inspect `dist/_redirects`. Confirm that the matching route's
HTML entry exists before the final `/* /index.html 200` fallback.

### Images are missing after deployment

Distinguish imported affiliate assets under fingerprinted `/assets/` from
copied root `/uploads/`. Check filename case, build output and browser CSP/cache
before changing paths.

### Booking submission is blocked

Verify the exact form action, FormSubmit activation/recipient state and the
`form-action` CSP directive. Do not loosen all CSP sources to fix one endpoint.

### Local tests fail to start

Confirm Chromium is installed, port `4173` is free and `npm run build` succeeds.
Playwright starts the preview itself; an unrelated stale server can hide build
problems when `reuseExistingServer` is enabled locally.

### Cloudflare deploys an old revision

Check the Pages repository connection and production branch. A preview branch
deployment does not update the production custom domain.

## Starting a new Codex task

Use the repository's current `main` branch and begin with:

> Read `README.md` completely before acting. Treat `jason-shadow.com` as the
> live, static Cloudflare Pages site for the separate Jason Shadow music,
> singer, speaker and booking brand. Inspect the current git status and Pages
> configuration, preserve unrelated work, do not introduce Appwrite or private
> browser credentials, and do not mix in Shadow's Temptation or Order of
> Shadows content. Implement the requested change in source files, run the
> production build and proportional Playwright tests, then report the exact
> files, deployment state and any remaining authenticated operator step.

For every handoff, state whether the task affects content, media, external
integrations, legal/privacy text, Cloudflare Pages, DNS or email records. Never
infer permission for a production DNS or mail-record mutation from an ordinary
website edit.
