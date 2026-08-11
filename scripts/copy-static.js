const { cp, mkdir, writeFile } = require('fs/promises');
const { join } = require('path');

async function copyStatic() {
  await mkdir('dist/uploads', { recursive: true });
  await cp('uploads', 'dist/uploads', { recursive: true });
  await writeFile(join('dist', '_redirects'), '/affiliates/* /affiliates/index.html 200\n/impressum/* /impressum/index.html 200\n/datenschutz/* /datenschutz/index.html 200\n/* /index.html 200\n');
  await writeFile(join('dist', '_headers'), `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  X-Frame-Options: DENY
  Content-Security-Policy: default-src 'self'; img-src 'self' data:; media-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self' https://formsubmit.co; upgrade-insecure-requests

/assets/*
  Cache-Control: public, max-age=31536000, immutable
`);
}
copyStatic().catch(error => { console.error(error); process.exitCode = 1; });
