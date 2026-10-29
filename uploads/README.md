# Main website uploads

Original artwork and media for Jason Shadow — Singer · Speaker · Moderator.

- `logo.png` is the current owner-supplied logo: 1774 × 887 pixels, with the JS
  monogram, The Healing Shadow slogan, artist name and professional occupation.
  Preserve this original. Both the website and affiliate page use it.
- `profile.png` is the original portrait; responsive copies live in `public/media/`.
- `banner.jfif` is the previous banner, retained as source material.

The original logo is referenced by `content/site.cjs` and rendered through
`scripts/brand.cjs`. Vite includes the unchanged PNG as a fingerprinted build
asset, shared by all its appearances. Navigation uses a CSS crop of its monogram;
the full logo keeps its 2:1 proportions above the homepage headline and in the
affiliate cover. The homepage footer uses a compact name link.

Browser icons use the same JS monogram, packaged in `public/favicon.ico`,
`public/favicon-32.png`, `public/favicon-48.png` and `public/apple-touch-icon.png`.
Regenerate these explicitly with `node scripts/render-icons.cjs` when the logo
or navigation crop changes. Keep the original PNG unchanged.

Partner previews remain in `/affiliates/uploads/`.
