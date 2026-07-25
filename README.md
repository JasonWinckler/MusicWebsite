# Jason Shadow Website

Modern, mobile-first website built with native ES modules and reusable, data-driven components. Vite produces a self-contained Appwrite Sites deployment; Appwrite's browser SDK is bundled and `node_modules` is never published.

## Local development

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open the URL printed by Vite. Public content remains available at `/`, `/affiliates/`, `/impressum/`, and `/datenschutz/`.

## Appwrite configuration

The browser client is connected to the **Jason Shadow Enterprises** project (`6a64cbeb0009826c9efc`) at `https://fra.cloud.appwrite.io/v1`. These public connection details are fixed in `lib/appwrite.js`.

The optional news identifiers remain configurable. Saved news remains visible if either value is omitted or Appwrite is unavailable. Variables prefixed with `VITE_` are public and embedded in the browser bundle:

| Variable | Purpose |
| --- | --- |
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
- Add the optional news database and collection build variables from `.env.example` when live news should be loaded.
- The browser automatically calls `client.ping()` on startup to verify that the Appwrite backend is reachable.

The generated `dist/_redirects` sends each public route to its matching HTML entry and provides `/index.html` as the final client-side fallback. This keeps direct links and browser refreshes working. Existing files take precedence over the fallback. After deployment, verify all four routes and check the browser console/network panel for errors.
