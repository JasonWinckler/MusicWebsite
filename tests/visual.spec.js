const { test, expect } = require('@playwright/test');
const { mkdir } = require('node:fs/promises');
const { join } = require('node:path');
const copy = require('../content/site.cjs');

const origin = 'https://jason-shadow.com';
const endpoint = 'https://formsubmit.co/ajax/business@jason-shadow.com';
const pages = [['/', 'de'], ['/en/', 'en'], ['/affiliates/', 'de'], ['/en/affiliates/', 'en'], ['/impressum/', 'de'], ['/datenschutz/', 'de']];

// Never send real enquiries. Form tests override this with controlled mocks.
test.beforeEach(async ({ context }) => {
  await context.route('https://formsubmit.co/**', route => route.abort());
});

for (const [path, language] of pages) {
  test(`${path} is readable, indexable and has no horizontal overflow`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(path);
    expect(response.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', language);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', origin + path);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /\S.{50,}/);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', origin + path);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /^https:\/\/jason-shadow\.com\//);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    const robots = await page.locator('meta[name="robots"]').evaluateAll(items => items.map(item => item.content).join(' '));
    expect(robots).not.toMatch(/noindex/i);
    expect(response.headers()['x-robots-tag'] || '').not.toMatch(/noindex/i);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    expect(errors).toEqual([]);
  });
}

for (const [path, language] of [['/', 'de'], ['/en/', 'en']]) {
  test(`${language}: offer and contact work without JavaScript`, async ({ browser, baseURL }, testInfo) => {
    const { viewport, isMobile, hasTouch, deviceScaleFactor, userAgent } = testInfo.project.use;
    const context = await browser.newContext({ javaScriptEnabled: false, baseURL, viewport, isMobile, hasTouch, deviceScaleFactor, userAgent });
    await context.route('https://formsubmit.co/**', route => route.abort());
    const page = await context.newPage();
    try {
      await page.goto(path);
      await expect(page.locator('h1')).toContainText(copy[language].hero.title);
      for (const service of copy[language].services.items) await expect(page.locator('#leistungen')).toContainText(service.title);
      await expect(page.locator('#eindruck')).toContainText('KÖPI am Ring');
      await expect(page.locator('#kontakt')).toContainText('business@jason-shadow.com');
      await expect(page.locator('.enquiry-form')).toHaveAttribute('action', copy.site.formAction);
      await expect(page.locator('.enquiry-form')).toHaveAttribute('method', /post/i);
      await expect(page.locator('.desktop-nav a').first()).toBeVisible();
      const other = language === 'de' ? 'en' : 'de';
      await page.locator(`header a[hreflang="${other}"]`).first().click();
      await expect(page.locator('html')).toHaveAttribute('lang', other);
      await expect(page.locator('h1')).toContainText(copy[other].hero.title);
    } finally { await context.close(); }
  });

  test(`${language}: invalid enquiries are explained and never sent`, async ({ page }) => {
    let submissions = 0;
    await page.route(endpoint, async route => { submissions += 1; await route.fulfill({ json: { success: true } }); });
    await page.goto(path + '#kontakt');
    const form = page.locator('.enquiry-form');
    await form.locator('button[type="submit"]').click();
    expect(submissions).toBe(0);
    await expect(form.locator('[name="name"]')).toBeFocused();
    await expect(form.locator('[name="name"]')).toHaveAttribute('aria-invalid', 'true');
    await expect(form.getByRole('alert')).toContainText(copy[language].contact.form.invalid);
    await form.locator('[name="name"]').fill('Test Guest');
    await form.locator('[name="email"]').fill('not-an-email');
    await form.locator('[name="service"]').selectOption('unsure');
    await form.locator('[name="message"]').fill('Test only; this must not be sent.');
    await form.locator('button[type="submit"]').click();
    expect(submissions).toBe(0);
    await expect(form.locator('[name="email"]')).toBeFocused();
    await expect(form.locator('[name="email"]')).toHaveAttribute('aria-invalid', 'true');
    await expect(form).toContainText(copy[language].contact.form.invalidEmail);
    await expect(page.locator('#kontakt a[href="mailto:business@jason-shadow.com"]')).toBeVisible();
  });

  test(`${language}: confirmation waits for actual mocked service acceptance`, async ({ page }) => {
    let release;
    const gate = new Promise(resolve => { release = resolve; });
    let received;
    await page.route(endpoint, async route => {
      received = route.request();
      await gate;
      await route.fulfill({ status: 200, json: { success: 'true', message: 'Accepted' } });
    });
    await page.goto(path + '#kontakt');
    const form = await fillEnquiry(page);
    await form.locator('button[type="submit"]').click();
    await expect.poll(() => Boolean(received)).toBe(true);
    expect(received.method()).toBe('POST');
    expect(decodeURIComponent(received.postData())).toContain('guest@example.test');
    await expect(form.locator('button[type="submit"]')).toBeDisabled();
    await expect(form).toContainText(copy[language].contact.form.pending);
    await expect(form).not.toContainText(copy[language].contact.form.success);
    release();
    await expect(form.getByRole('status')).toContainText(copy[language].contact.form.success);
    await expect(form.locator('button[type="submit"]')).toBeEnabled();
  });

  test(`${language}: rejection retains the enquiry and supports retry`, async ({ page }) => {
    let attempt = 0;
    await page.route(endpoint, async route => {
      attempt += 1;
      await route.fulfill({ status: 200, json: { success: attempt > 1, message: attempt > 1 ? 'Accepted' : 'Rejected' } });
    });
    await page.goto(path + '#kontakt');
    const form = await fillEnquiry(page);
    await form.locator('button[type="submit"]').click();
    await expect(form.getByRole('alert')).toContainText(copy[language].contact.form.error);
    await expect(form.locator('[name="email"]')).toHaveValue('guest@example.test');
    await expect(form.locator('[name="message"]')).toHaveValue('Test only: a private event in Rheine, date undecided.');
    await expect(form).not.toContainText(copy[language].contact.form.success);
    await expect(form.locator('button[type="submit"]')).toBeEnabled();
    await form.locator('button[type="submit"]').click();
    await expect(form.getByRole('status')).toContainText(copy[language].contact.form.success);
    expect(attempt).toBe(2);
  });

  test(`${language}: network failure offers recovery without simulated success`, async ({ page }) => {
    await page.route(endpoint, route => route.abort('failed'));
    await page.goto(path + '#kontakt');
    const form = await fillEnquiry(page);
    await form.locator('button[type="submit"]').click();
    await expect(form.getByRole('alert')).toContainText(copy[language].contact.form.error);
    await expect(form.locator('[name="name"]')).toHaveValue('Test Guest');
    await expect(form.locator('button[type="submit"]')).toBeEnabled();
    await expect(form).not.toContainText(copy[language].contact.form.success);
  });
}

test('mobile disclosure navigation manages focus, Tab exit and Escape', async ({ page }) => {
  await page.goto('/');
  const toggle = page.locator('.menu-toggle');
  test.skip(!(await toggle.isVisible()), 'Desktop uses the visible primary navigation.');
  const menu = page.locator('#mobile-menu');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).toBeHidden();
  await toggle.focus();
  await page.keyboard.press('Tab');
  expect(await menu.evaluate(element => element.contains(document.activeElement))).toBe(false);
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(menu).toBeVisible();
  expect(await menu.evaluate(element => element.contains(document.activeElement))).toBe(true);
  for (let step = 0; step < 15 && await menu.isVisible(); step += 1) {
    await page.keyboard.press('Tab');
  }
  await expect(menu).toBeHidden();
  expect(await menu.evaluate(element => element.contains(document.activeElement))).toBe(false);
  await toggle.focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();
  await menu.locator('a[href="#leistungen"]').click();
  await expect(menu).toBeHidden();
  await expect(page).toHaveURL(/#leistungen$/);
  await expect(page.locator('#leistungen')).toBeFocused();
});

test('genuine performance loads and plays with byte ranges and no autoplay', async ({ page, request }) => {
  await page.goto('/');
  const video = page.locator('#eindruck video');
  await expect(video).toHaveCount(1);
  await expect(video).toHaveAttribute('preload', 'none');
  await expect(video).toHaveAttribute('controls', '');
  expect(await video.getAttribute('autoplay')).toBeNull();
  await expect(video).toHaveAttribute('poster', '/media/performance-poster.webp');
  const response = await request.get('/media/koepi-live.mp4', { headers: { Range: 'bytes=0-63' } });
  expect(response.status()).toBe(206);
  expect(response.headers()['content-type']).toContain('video/mp4');
  expect((await response.body()).length).toBe(64);
  await video.evaluate(element => { element.preload = 'metadata'; element.load(); });
  await expect.poll(() => video.evaluate(element => element.readyState), { timeout: 15000 }).toBeGreaterThanOrEqual(1);
  expect(await video.evaluate(element => Number.isFinite(element.duration) && element.duration > 0)).toBe(true);
  await video.evaluate(async element => { element.muted = true; await element.play(); });
  await expect.poll(() => video.evaluate(element => element.currentTime), { timeout: 10000 }).toBeGreaterThan(0);
  await video.evaluate(element => element.pause());
});

test('failed video loading reveals an honest alternative', async ({ page }) => {
  await page.route('**/media/koepi-live.mp4', route => route.abort());
  await page.goto('/en/');
  await page.locator('#eindruck video').evaluate(element => { element.preload = 'auto'; element.load(); });
  await expect(page.locator('[data-video-fallback]')).toBeVisible();
  await expect(page.locator('[data-video-fallback]')).toContainText(copy.en.performance.fallback);
});

test('sitemap, robots, reciprocal languages and missing-route statuses agree', async ({ request, page }) => {
  const robots = await request.get('/robots.txt');
  expect(robots.status()).toBe(200);
  expect(robots.headers()['content-type']).toContain('text/plain');
  const robotsText = await robots.text();
  expect(robotsText).toContain('Sitemap: https://jason-shadow.com/sitemap.xml');
  expect(robotsText).not.toMatch(/Disallow:\s*\/\s*(?:\n|$)/);
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  expect(sitemap.headers()['content-type']).toMatch(/(?:application|text)\/xml/);
  await page.goto('/');
  const locations = await page.evaluate(text => {
    const xml = new DOMParser().parseFromString(text, 'application/xml');
    if (xml.querySelector('parsererror')) throw new Error('Invalid sitemap XML');
    return [...xml.querySelectorAll('url > loc')].map(element => element.textContent);
  }, await sitemap.text());
  expect(locations.sort()).toEqual(pages.map(([path]) => origin + path).sort());
  for (const [path, de, en] of [['/', '/', '/en/'], ['/en/', '/', '/en/'], ['/affiliates/', '/affiliates/', '/en/affiliates/'], ['/en/affiliates/', '/affiliates/', '/en/affiliates/']]) {
    await page.goto(path);
    await expect(page.locator('head link[rel="alternate"][hreflang="de"]')).toHaveAttribute('href', origin + de);
    await expect(page.locator('head link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', origin + en);
    await expect(page.locator('head link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute('href', origin + de);
  }
  for (const missing of ['/does-not-exist/', '/assets/missing.png', '/missing.xml', '/affiliates/not-a-page/']) {
    expect((await request.get(missing)).status(), missing).toBe(404);
  }
  expect((await page.goto('/does-not-exist/')).status()).toBe(404);
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
});

test('affiliate relationships and images are clear; language links preserve the page', async ({ page }) => {
  await page.goto('/affiliates/');
  const links = page.locator('a[rel~="sponsored"]');
  await expect(links).toHaveCount(2);
  for (const link of await links.all()) {
    await expect(link).toHaveAttribute('href', /^https:\/\/(?:corissia\.com|www\.waterdrop\.de)\//);
    const image = link.locator('img');
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate(element => element.complete && element.naturalWidth > 0)).toBe(true);
  }
  await expect(page.locator('main')).toContainText(/Affiliate/);
  await page.locator('header a[hreflang="en"]').first().click();
  await expect(page).toHaveURL(/\/en\/affiliates\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('main')).toContainText(/affiliate/i);
});

for (const [path, language] of [['/affiliates/', 'de'], ['/en/affiliates/', 'en']]) {
  test(`${language}: social linkhub works without JavaScript on narrow phones`, async ({ browser, baseURL }, testInfo) => {
    const { isMobile, hasTouch, deviceScaleFactor, userAgent } = testInfo.project.use;
    const context = await browser.newContext({ javaScriptEnabled: false, baseURL, isMobile, hasTouch, deviceScaleFactor, userAgent, viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    try {
      for (const width of [320, 390]) {
        await page.setViewportSize({ width, height: 844 });
        await page.goto(path);
        await expect(page.locator('h1')).toContainText('Jason Shadow');
        await expect(page.locator('main')).toContainText(copy[language].occupation);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        const partners = page.locator('a[rel~="sponsored"]');
        await expect(partners).toHaveCount(2);
        for (const partner of await partners.all()) {
          const image = partner.locator('img');
          await image.scrollIntoViewIfNeeded();
          await expect.poll(() => image.evaluate(element => element.complete && element.naturalWidth > 0)).toBe(true);
          expect(await image.evaluate(element => getComputedStyle(element).objectFit)).toBe('contain');
          const box = await partner.boundingBox();
          expect(box.width).toBeGreaterThanOrEqual(44);
          expect(box.height).toBeGreaterThanOrEqual(44);
          await partner.focus();
          await expect(partner).toBeFocused();
        }
        const destinations = [
          'https://www.instagram.com/jason.shadow_official/',
          'https://www.paypal.com/donate/?hosted_button_id=6XPT97RRUBEA6',
          language === 'de' ? '/' : '/en/',
        ];
        for (const href of destinations) {
          const link = page.locator(`main a[href="${href}"]`).first();
          await expect(link).toBeVisible();
          const box = await link.boundingBox();
          expect(box.width).toBeGreaterThanOrEqual(44);
          expect(box.height).toBeGreaterThanOrEqual(44);
          await link.focus();
          await expect(link).toBeFocused();
        }
      }
    } finally { await context.close(); }
  });
}

test('reduced motion leaves the homepage and social linkhub fully readable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const path of ['/', '/affiliates/']) {
    await page.goto(path);
    expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true);
    await expect(page.locator('h1')).toBeVisible();
    expect(await page.locator('[data-reveal]').count()).toBeGreaterThan(0);
    await page.locator('main').evaluate(element => element.lastElementChild.scrollIntoView());
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    expect(await page.evaluate(() => document.getAnimations().filter(animation => animation.playState === 'running').length)).toBe(0);
    expect(await page.locator('[data-reveal]').evaluateAll(elements => elements.every(element => {
      const style = getComputedStyle(element);
      return Number(style.opacity) === 1 && style.visibility !== 'hidden' && style.display !== 'none';
    }))).toBe(true);
  }
});

test('occupation remains exact without repeated location labels', async ({ page }) => {
  for (const [path, language] of [['/', 'de'], ['/en/', 'en']]) {
    await page.goto(path);
    await expect(page.locator('.hero')).toContainText(copy[language].occupation);
    const branding = await page.locator('.hero, #kontakt, .site-footer').allInnerTexts();
    expect(branding.join(' ')).not.toMatch(/Rheine|based in/i);
    const mainText = await page.locator('main').textContent();
    expect((mainText.match(/Rheine/gi) || []).length).toBeLessThanOrEqual(1);
  }
});

test('labelled desktop and phone review screenshots', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'chromium-tablet', 'Phone and desktop screenshots cover the review deliverables.');
  // The combined home/linkhub review creates eight images per device. Keep the
  // capture budget separate from functional assertions and avoid oversized DPR PNGs.
  test.setTimeout(60000);
  const device = testInfo.project.name === 'chromium-mobile' ? 'phone' : 'desktop';
  const directory = join(__dirname, '..', 'screenshots');
  await mkdir(directory, { recursive: true });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const [path, language] of [['/', 'de'], ['/en/', 'en']]) {
    await page.goto(path);
    await page.evaluate(async () => {
      await document.fonts.ready;
      // Full-page captures also include the lazy footer logo outside the viewport.
      await Promise.all([...document.images].map(image => {
        image.loading = 'eager';
        return image.decode().catch(() => {});
      }));
    });
    await page.screenshot({ path: join(directory, `${language}-${device}-full.png`), fullPage: true, scale: 'css' });
    if (language === 'de') {
      await page.screenshot({ path: join(directory, `de-${device}-opening.png`), scale: 'css' });
      // Isolate this section after saving the unmodified page captures. Removing
      // fixed UI in this test page avoids overlays without injecting inline CSS
      // (which the site's Content Security Policy correctly blocks).
      await page.locator('.site-header, .skip-link').evaluateAll(elements => elements.forEach(element => element.remove()));
      await page.locator('#kontakt').screenshot({ path: join(directory, `de-${device}-contact.png`), scale: 'css' });
    }
  }
  for (const [path, language] of [['/affiliates/', 'de'], ['/en/affiliates/', 'en']]) {
    await page.goto(path);
    // Decode all previews, including lazily loaded cards below the first screen.
    await page.locator('main img').evaluateAll(async images => {
      await Promise.all(images.map(async image => {
        image.loading = 'eager';
        await image.decode().catch(() => {});
      }));
    });
    await page.screenshot({ path: join(directory, `${language}-affiliates-${device}-full.png`), fullPage: true, scale: 'css' });
    await page.screenshot({ path: join(directory, `${language}-affiliates-${device}-opening.png`), scale: 'css' });
  }
});

async function fillEnquiry(page) {
  const form = page.locator('.enquiry-form');
  await form.locator('[name="name"]').fill('Test Guest');
  await form.locator('[name="email"]').fill('guest@example.test');
  await form.locator('[name="service"]').selectOption('combined');
  await form.locator('[name="message"]').fill('Test only: a private event in Rheine, date undecided.');
  return form;
}
