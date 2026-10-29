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
the full logo keeps its 2:1 proportions in footers and the affiliate cover.

Partner previews remain in `/affiliates/uploads/`.
