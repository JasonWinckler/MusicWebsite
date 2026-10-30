const { writeFile, readFile, readdir } = require('node:fs/promises');
const { join } = require('node:path');
const { createHash } = require('node:crypto');
const { site } = require('../content/site.cjs');
const routes = ['/', '/en/', '/affiliates/', '/en/affiliates/', '/impressum/', '/datenschutz/'];
async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const groups = await Promise.all(entries.map(entry => entry.isDirectory() ? htmlFiles(join(directory, entry.name)) : entry.name.endsWith('.html') ? [join(directory, entry.name)] : []));
  return groups.flat();
}
async function copyStatic() {
  // Originals stay in the repository; only optimised public/media assets ship.
  // Directory HTML pages and top-level 404.html are native Cloudflare Pages routes.
  // No wildcard rewrite: nonexistent pages and missing assets must stay HTTP 404.
  await writeFile('dist/_redirects', '# Native directory routes; top-level 404.html handles missing resources.\n/uploads/portfolio/Auftrag1.mp4 /media/koepi-live.mp4 301\n/uploads/profile.png /media/portrait-1023.webp 301\n');
  const hashes = new Set();
  for (const file of await htmlFiles('dist')) {
    const html = await readFile(file, 'utf8');
    for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) hashes.add(`'sha256-${createHash('sha256').update(match[1]).digest('base64')}'`);
  }
  const previewBuild = process.env.CF_PAGES === '1' && process.env.CF_PAGES_BRANCH && process.env.CF_PAGES_BRANCH !== 'main';
  const defaultPolicy = `default-src 'self'; img-src 'self' data:; media-src 'self'; style-src 'self'; script-src 'self' ${[...hashes].join(' ')}; connect-src 'self' https://formsubmit.co; frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self' https://formsubmit.co`;
  // The donation SDK writes its overlay styles dynamically. Limit that exception
  // and the PayPal origins to the two affiliate pages, including their aliases.
  const donationPolicy = `default-src 'self'; img-src 'self' data: https://www.paypalobjects.com; media-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' https://www.paypalobjects.com/donate/sdk/donate-sdk.js; connect-src 'self' https://formsubmit.co https://www.paypal.com; frame-src 'self' https://www.paypal.com; frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self' https://formsubmit.co`;
  const donationHeaders = ['/affiliates', '/affiliates/', '/affiliates/index.html', '/en/affiliates', '/en/affiliates/', '/en/affiliates/index.html'].map(route => `${route}\n  ! Content-Security-Policy\n  Content-Security-Policy: ${donationPolicy}\n`).join('\n');
  await writeFile('dist/_headers', `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  X-Frame-Options: DENY
  Content-Security-Policy: ${defaultPolicy}
${previewBuild ? '  X-Robots-Tag: noindex, nofollow\n' : ''}
# Detach the inherited policy before setting the page-specific policy: matching
# Cloudflare header values would otherwise be combined and both enforced.
${donationHeaders}
/assets/*
  Cache-Control: public, max-age=31536000, immutable

/robots.txt
  Content-Type: text/plain; charset=utf-8

/sitemap.xml
  Content-Type: application/xml; charset=utf-8

/404.html
  X-Robots-Tag: noindex, follow

https://:project.pages.dev/*
  X-Robots-Tag: noindex, nofollow

https://:version.:project.pages.dev/*
  X-Robots-Tag: noindex, nofollow
`);
  const origin = site.url.replace(/\/$/, '');
  await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
  await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map(route => `  <url><loc>${origin}${route}</loc></url>`).join('\n')}\n</urlset>\n`);
}
copyStatic().catch(error => { console.error(error); process.exitCode = 1; });
