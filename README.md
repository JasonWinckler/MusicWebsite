# Jason Shadow Website

Modern, mobile-first website built with native ES modules and reusable, data-driven components. Vite produces a self-contained static build for Cloudflare Pages; no Appwrite runtime or browser SDK is used.

## Local development

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open the URL printed by Vite. Public content remains available at `/`, `/affiliates/`, `/impressum/`, and `/datenschutz/`.

The news section is generated from the version-controlled entries in `src/data.js`. The production browser performs no backend availability ping and does not depend on a third-party database.

## Production and tests

```bash
npm run build
npm run preview
npm run test:browser
```

`npm run build` always empties and recreates `dist/`, fingerprints CSS/JS, and copies all media plus route fallback rules. Playwright starts the production preview automatically and checks phone, tablet, and desktop layouts.

## Cloudflare Pages

Create a dedicated Cloudflare Pages project connected to `JasonWinckler/MusicWebsite` with these values:

- **Production branch:** `main`
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Custom domains after DNS cutover:** `jason-shadow.com` and optionally `www.jason-shadow.com`
- **Runtime variables:** none

The generated `dist/_redirects` sends each public route to its matching HTML entry and provides `/index.html` as the final client-side fallback. This keeps direct links and browser refreshes working. Existing files take precedence over the fallback. After deployment, verify all four routes and check the browser console/network panel for errors.
