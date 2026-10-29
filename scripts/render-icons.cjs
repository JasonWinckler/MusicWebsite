// Package the existing navigation monogram as browser icons. Chromium renders
// the same original PNG and CSS crop; the logo artwork is never redrawn.
// Run explicitly after changing the logo: node scripts/render-icons.cjs
// Requires the existing Playwright Chromium installation, not a new dependency.
const { readFile, writeFile, mkdir } = require('node:fs/promises');
const { resolve } = require('node:path');
const { chromium } = require('@playwright/test');
const { site } = require('../content/site.cjs');

const root = resolve(__dirname, '..');
const publicDirectory = resolve(root, 'public');
// Match the navigation window in assets/css/brand.css: x=105–565, y=175–685.
const navigationAspectRatio = 460 / 510;
const outputs = new Map([
  [32, 'favicon-32.png'],
  [48, 'favicon-48.png'],
  [180, 'apple-touch-icon.png'],
]);

function packageIco(images) {
  // ICO supports PNG entries; modern browsers select the closest native size.
  const header = Buffer.alloc(6 + 16 * images.length);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, png }, index) => {
    const entry = 6 + 16 * index;
    header[entry] = size;
    header[entry + 1] = size;
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(24, entry + 6);
    header.writeUInt32LE(png.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += png.length;
  });
  return Buffer.concat([header, ...images.map(({ png }) => png)]);
}

async function renderIcons() {
  const [source, brandCss] = await Promise.all([
    readFile(resolve(root, `.${site.media.logo.src}`)),
    readFile(resolve(root, 'assets/css/brand.css'), 'utf8'),
  ]);
  await mkdir(publicDirectory, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ deviceScaleFactor: 1 });
    // A square burgundy backing centers the unchanged, proportionate nav crop.
    // Touch icons stay opaque because the operating system supplies its own mask.
    await page.setContent(`<!doctype html><html><head><style>
      ${brandCss}
      html, body { margin: 0; width: 100%; height: 100%; background: #40000b; }
      .icon-frame { display: flex; align-items: center; justify-content: center; width: 100vw; height: 100vh; overflow: hidden; background: #40000b; }
      .icon-frame .brand-symbol { width: ${navigationAspectRatio * 100}%; height: 100%; flex: none; aspect-ratio: auto; border-radius: 0; }
    </style></head><body><div class="icon-frame"><span class="brand-symbol"><img src="data:image/png;base64,${source.toString('base64')}" width="${site.media.logo.width}" height="${site.media.logo.height}" alt=""></span></div></body></html>`);
    await page.locator('img').evaluate(image => image.decode());
    const iconEntries = [];
    for (const size of [16, 32, 48, 180]) {
      await page.setViewportSize({ width: size, height: size });
      const png = await page.screenshot({ type: 'png', scale: 'css' });
      if (png.readUInt32BE(16) !== size || png.readUInt32BE(20) !== size) {
        throw new Error(`Expected a ${size} × ${size} icon.`);
      }
      if (outputs.has(size)) await writeFile(resolve(publicDirectory, outputs.get(size)), png);
      if (size <= 48) iconEntries.push({ size, png });
    }
    await writeFile(resolve(publicDirectory, 'favicon.ico'), packageIco(iconEntries));
    console.log('Rendered navigation monogram: favicon.ico (16/32/48), PNG (32/48), touch icon (180).');
  } finally {
    await browser.close();
  }
}

renderIcons().catch(error => { console.error(error); process.exitCode = 1; });
