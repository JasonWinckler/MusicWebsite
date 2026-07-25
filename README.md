# Jason Shadow Website

Modern, mobile-first website built with native ES modules and reusable, data-driven components. Vite produces a self-contained Appwrite Sites deployment; Appwrite's browser SDK is bundled and `node_modules` is never published.

## Local development

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open the URL printed by Vite. Public content remains available at `/`, `/affiliates/`, `/impressum/`, and `/datenschutz/`.

## Environment variables

All variables are optional, so saved news remains visible if Appwrite is unavailable. Variables prefixed with `VITE_` are public and embedded in the browser bundle:

| Variable | Purpose |
| --- | --- |
| `VITE_APPWRITE_ENDPOINT` | Appwrite API endpoint, e.g. `https://fra.cloud.appwrite.io/v1` |
| `VITE_APPWRITE_PROJECT_ID` | Public Appwrite project ID |
| `VITE_APPWRITE_DATABASE_ID` | Database containing news |
| `VITE_APPWRITE_NEWS_COLLECTION_ID` | News collection; documents use `date`, `dateLabel`, `title`, and `text` |

**Never expose an API key, server secret, or service-account credential through a `VITE_` variable.** Configure the website hostname as a Web platform in Appwrite Console to permit browser requests.

## Production and tests

```bash
npm run build
npm run preview
npm run test:browser
```

`npm run build` always empties and recreates `dist/`, bundles JavaScript (including the npm `appwrite` import), fingerprints CSS/JS, and copies all media plus route fallback rules. Playwright starts the production preview automatically and checks phone, tablet, and desktop layouts.

## Appwrite Sites

Create/import the Site using `appwrite.json` or enter these values in Appwrite Console:

- **Install command:** `npm ci`
- **Build command:** `npm run build`
- **Output directory:** `dist`
- Add the required `VITE_APPWRITE_*` build variables from `.env.example`.

The generated `dist/_redirects` sends each public route to its matching HTML entry and provides `/index.html` as the final client-side fallback. This keeps direct links and browser refreshes working. Existing files take precedence over the fallback. After deployment, verify all four routes and check the browser console/network panel for errors.
