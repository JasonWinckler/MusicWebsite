# Jason Shadow — MusicWebsite

A static, bilingual website for Jason Shadow — The Healing Shadow — Singer ·
Speaker · Moderator (Sänger · Sprecher · Moderator). Bookable for B2B occasions
including galas, company anniversaries and restaurant events, and private
celebrations including weddings. German is the primary language; English has its own
crawlable URLs. The music brand is separate from Shadow’s Temptation and The
Order of Shadows. Do not introduce either brand’s private or adult content here.

## Production contract

| Setting | Value |
| --- | --- |
| Repository | `JasonWinckler/MusicWebsite` |
| Production branch | `main` |
| Public domain | `https://jason-shadow.com` |
| Hosting | Cloudflare Pages |
| Build command | `npm run build` |
| Output directory | `dist` |
| Backend, database, runtime secrets | None |

This change prepares code for review; it does not itself publish the redesign.
Do not merge or deploy without the owner’s instruction. Preserve the existing
Cloudflare project, domain, Microsoft 365 mail records and DNS. No new paid
service, CMS, analytics package or Appwrite integration is required.

Read-only deployment inspection also found a legacy GitHub Pages configuration
from `main:/`, alongside the Cloudflare Pages project `jason-shadow`. Neither
configuration was changed. The `www` hostname returned HTTP 522 during the
implementation check; treat this as an operator follow-up, not a reason to
modify DNS or mail records during this redesign. Verify the intended host and
redirect behaviour before an authorised release.

## Pages and source of truth

| URL | Purpose | Source |
| --- | --- | --- |
| `/` | German services, real performance and enquiry | `content/site.cjs`, `scripts/render-pages.cjs` |
| `/en/` | Complete English equivalent | same content and template |
| `/affiliates/` | German affiliate links and support | `scripts/secondary-pages.cjs` |
| `/en/affiliates/` | English affiliate links and support | same secondary template |
| `/impressum/` | Existing German legal notice | `impressum/index.html` |
| `/datenschutz/` | Existing German privacy notice, technical form details updated | `datenschutz/index.html` |
| `/404.html` | Bilingual missing-page recovery | `scripts/secondary-pages.cjs` |

Frequently edited offer copy, services and public contact configuration live in
`content/site.cjs`. Keep the professional occupation exactly “Singer · Speaker ·
Moderator” / “Sänger · Sprecher · Moderator”, in that order; the shared
`occupation` values drive the visible identity and structured data. Main and
affiliate HTML files are generated source artifacts;
edit their content/template and regenerate rather than editing generated copy.
Legal pages remain manually maintained source HTML. `assets/css/site.css` is the
shared foundation. `assets/css/home-refresh.css` defines the distinct desktop
and phone homepage layouts; `assets/css/linkhub.css` defines the Instagram
link-in-bio layout. Both are scoped to their page type. `src/motion.js` supplies
one-time entrance animations through the Web Animations API: content is visible
by default, keyboard focus cancels movement, and reduced-motion preferences
disable/cancel animations. `src/main.js` enhances navigation, media and the enquiry form;
headings, descriptions, contacts and language links work without JavaScript.

Keep the brand slogan exactly “The Healing Shadow” in both languages. The hero's
`titleLines` define its intentional phrase breaks; keep their combined wording
consistent with `hero.title`. Review both languages at phone and desktop widths
when changing these short lines. The hero has one live-performance button beside
the enquiry action; the portrait has no duplicate action overlay.

The original brand artwork is [`uploads/logo.png`](uploads/logo.png), supplied
by the owner. `scripts/brand.cjs` renders it and `assets/css/brand.css` handles
its display: a CSS window onto the real JS monogram in compact navigation.
The complete 2:1 artwork sits above the homepage headline and in the affiliate
cover; the homepage footer uses a compact artist-name link. The original image
is unchanged. Keep the full wordmark uncropped at every breakpoint.
Shared colors in `site.css` use deep burgundy (`#240007`), warm gold (`#efd18a`)
and ivory (`#fff5df`); the browser theme color matches the burgundy base.

Favicons in `public/` package that same navigation monogram: 16/32/48 px in
`favicon.ico`, 32/48 px PNGs, and a 180 px Apple touch icon. `iconLinks()` in
`scripts/brand.cjs` supplies the head links for generated pages; legal pages
carry the same static links. To regenerate after a logo/crop change, run
`node scripts/render-icons.cjs` with Playwright Chromium installed. This explicit
asset task is not part of the production build and adds no runtime dependency.

`npm run generate` writes the main and secondary HTML. Both `npm run dev` and
`npm run build` run it automatically. After editing content or templates while a
development server is already running, run `npm run generate` again or restart
the server to refresh the generated HTML. Do not edit files under `dist/`.

See [the phone-friendly owner guide](docs/OWNER-GUIDE.md) for simple copy/media
updates, real performance additions, Search Console and local-discovery steps.
The owner does not need a desktop terminal: future changes can be made in GitHub
in a phone browser or requested from an AI assistant on a review branch.

## Assets and factual claims

Original media stays under `uploads/` for future editing. Only the optimised
files under `public/media/` are shipped as performance and portrait assets. The
current reference is the real KÖPI am Ring Rheine performance; do not infer a
date, audience size, client endorsement or fee from the clip. Another existing
file is not automatically an approved new portfolio reference.

Responsive portraits, the actual performance poster and the social-sharing
image use existing material. Preserve originals. New media must have an
accurate title/context and appropriate publication rights. Never invent reviews,
credentials, repertoire, event experience, travel coverage or language fluency.
Affiliate relationships are disclosed separately from customer references. The
affiliate pages use the shared logo and existing uploaded partner previews, with
image frames fitted to their original proportions, plus large native Instagram,
website and PayPal links. Keep these touch-friendly links usable without JavaScript.
Decorative location labels have been removed; the actual performance caption
and required legal details retain their factual context.

Useful existing media URLs redirect explicitly:

- `/uploads/portfolio/Auftrag1.mp4` → `/media/koepi-live.mp4`;
- `/uploads/profile.png` → `/media/portrait-1023.webp`.

## Development and useful validation

Use the existing checkout in an isolated cloud task; do not create a worktree
unless explicitly requested. Inspect Git status and current instructions first.
Node.js must satisfy Vite’s requirement (`^20.19.0 || >=22.12.0`); the cloud setup
uses Node 24.19.0 and npm 11.9.0. No `.env.local` file is needed. Never put secrets
in Vite variables because browser builds expose them.

```bash
npm ci
npm run install:browsers
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

For the production output and browser tests:

```bash
npm run build
CI=1 npm run test:browser -- --workers=2
```

Playwright builds and starts the production preview on port 4173 itself. Keep
that port free; `CI=1` prevents accidental reuse of a stale preview. Reports and
screenshots are generated in ignored `playwright-report/`, `test-results/` and
`screenshots/` directories. There is no separate lint or typecheck script.

For manual inspection after testing:

```bash
npm run preview -- --port 4173 --strictPort
```

The dependency-free Node preview server serves the actual `dist` files with
correct MIME types, security headers, media byte ranges and real 404 responses.
It is a local validation server, not a replacement production host. Vite’s
editor server is configured as a multi-page app; check production routing using
the production preview rather than relying on development fallback behaviour.

## Enquiry and privacy

The existing public email is `business@jason-shadow.com`. The native form retains
`https://formsubmit.co/business@jason-shadow.com`. JavaScript uses the same
recipient through FormSubmit’s AJAX endpoint for translated in-page handling.
The form requests name, email, desired service and a message; date and location
can be supplied in the message. It does not suggest a fee or collect a budget.

Automated tests must mock FormSubmit. Never send real enquiries or donations as
a test. A success display is conditional on an accepted FormSubmit response;
it does not promise email delivery or confirm a booking. The owner still needs
to verify recipient activation and an actual received email outside automation.
The public email is always available as an alternative.

The privacy notice describes the current fields, AJAX/native transfer and
email alternative. The verified hosting correction, current § 5 DDG citation and closure of the EU
ODR platform are reflected in the legal notice; personal legal/contact details are
preserved. These technical edits are not a legal review or certification. The
owner should review the remaining legal statements, retention wording and
provider arrangements with qualified advice if needed.

## SEO, routing and security

The build emits static HTML, unique titles/descriptions, production canonicals,
reciprocal language alternates for equivalent pages, social metadata,
`robots.txt` and `sitemap.xml`. No fake review, business address, VideoObject
upload date or rating is generated. The six genuine indexable page URLs are in
the sitemap. Existing German legal pages are linked as German on English pages.

Cloudflare Pages uses the actual directory HTML pages. A top-level `404.html`
disables its implicit SPA fallback. `_redirects` contains only deliberate
legacy-media redirects; no catch-all routes nonexistent pages or missing assets
to a successful homepage response. `robots.txt` is plain text and `sitemap.xml`
is XML. Missing paths return 404, including missing image/script requests.

`_headers` applies a restrictive CSP, `nosniff`, referrer policy, disabled camera,
microphone and geolocation, and frame protection. Inline JSON-LD receives hashes
generated from the built output; executable inline scripts are not broadly
allowed. FormSubmit is the only extra connection/form destination. Fingerprinted
Vite assets have immutable caching. Images under `/media/` use stable filenames:
replace them and verify deployed caching when releasing new media.

Cloudflare `pages.dev` project and branch preview hostnames receive
`X-Robots-Tag: noindex, nofollow`; custom production-domain content remains
indexable. A Cloudflare branch build (`CF_PAGES=1`, branch other than `main`)
also receives a global noindex header. For a separately configured custom
staging host, verify this branch flag or configure its own noindex header before
sharing it. Do not block preview crawling in robots.txt and expect Google to see
a noindex header: noindex requires the crawler to be allowed to fetch it.

Build output is not proof of live deployment, public HTTPS, indexing, email
delivery or rankings. Before an authorised release, check production host
headers, canonical redirects and the form’s received-email path separately.
Search Console ownership and Business Profile eligibility are owner actions,
not things a site build can assert.

Official references checked during implementation (29 October 2026):

- [Cloudflare: serving pages and 404 behaviour](https://developers.cloudflare.com/pages/configuration/serving-pages/)
- [Cloudflare: response headers and preview hostname patterns](https://developers.cloudflare.com/pages/configuration/headers/)
- [European Commission: ODR platform discontinued on 20 July 2025](https://consumer-redress.ec.europa.eu/site-relocation_en)

- [Official statute: § 5 Digitale-Dienste-Gesetz](https://www.gesetze-im-internet.de/ddg/__5.html)
