// Display the owner's original logo. The compact navigation uses a CSS window
// onto its monogram; the source image is never redrawn or altered.
const { site } = require('../content/site.cjs');
const { logo } = site.media;
const e = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const image = (alt, lazy = false) => `<img src="${e(logo.src)}" width="${logo.width}" height="${logo.height}" alt="${e(alt)}" decoding="async"${lazy ? ' loading="lazy"' : ''}>`;
const symbol = () => `<span class="brand-symbol" aria-hidden="true">${image('')}</span>`;
const wordmark = (home = '/', lazy = true) => `<a class="brand-logo-full" href="${home}">${image('Jason Shadow — The Healing Shadow', lazy)}</a>`;
const iconLinks = () => '<link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48">\n<link rel="icon" type="image/png" href="/favicon-32.png" sizes="32x32">\n<link rel="icon" type="image/png" href="/favicon-48.png" sizes="48x48">\n<link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180">';

module.exports = { symbol, wordmark, image, iconLinks };
