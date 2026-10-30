const { test, expect } = require('@playwright/test');

const sdkUrl = 'https://www.paypalobjects.com/donate/sdk/donate-sdk.js';
const donationUrl = 'https://www.paypal.com/donate/?hosted_button_id=TBJRBRR6DPW22';

// Test the site's integration with a controlled SDK boundary. The real SDK and
// production donation form are checked separately; these tests never make payments.
const sdk = `
window.PayPal = { Donation: { Checkout(options) {
  if (options.env !== 'production' || options.hosted_button_id !== 'TBJRBRR6DPW22') {
    throw new Error('Unexpected donation destination');
  }
  let overlay;
  let rejectRender;
  const checkout = {
    close() {
      overlay?.remove();
      options.onClose?.();
      if (rejectRender) {
        // Model the SDK's delayed cancellation while its frame is still loading.
        window.finishCancelledDonation = () => {
          rejectRender(new Error('Checkout closed before loading'));
          options.onError?.(new Error('Cancelled checkout teardown'));
        };
      }
      return Promise.resolve();
    },
    render(container, context = 'popup') {
      if (window.failDonationRender) return Promise.reject(new Error('Checkout unavailable'));
      if (context !== 'iframe') {
        window.open('${donationUrl}', 'paypal-donation');
        return Promise.resolve();
      }
      if (window.useSdkShell) {
        overlay = document.createElement('div');
        overlay.className = 'popup-overlay-checkout';
        const shell = document.createElement('iframe');
        shell.title = 'PayPal Checkout Overlay';
        shell.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;border:0;z-index:2147483647';
        overlay.append(shell);
        document.querySelector(container).append(overlay);
        const doc = shell.contentDocument;
        // The actual SDK shell omits <head>; regressions here must exercise the
        // site's real accessibility/style enhancement rather than bypass it.
        doc.documentElement.innerHTML = '<body><div class="paypal-checkout-overlay" style="position:absolute;inset:0"><a class="paypal-checkout-close" href="#" role="button" aria-label="close"></a><div class="paypal-checkout-iframe-container" style="position:absolute"><div class="outlet"><iframe title="PayPal donation form"></iframe></div></div></div></body>';
        doc.head?.remove();
        doc.querySelector('.paypal-checkout-close').addEventListener('click', event => {
          event.preventDefault();
          checkout.close();
        });
        doc.querySelector('iframe').src = '${donationUrl}';
        options.onDisplay?.();
        return Promise.resolve();
      }
      overlay = document.createElement('dialog');
      overlay.setAttribute('aria-label', 'PayPal test checkout');
      const close = document.createElement('button');
      close.type = 'button';
      close.textContent = 'Close PayPal';
      close.addEventListener('click', () => checkout.close());
      const frame = document.createElement('iframe');
      frame.title = 'PayPal donation form';
      frame.src = '${donationUrl}';
      overlay.append(close, frame);
      document.querySelector(container).append(overlay);
      overlay.showModal();
      close.focus();
      options.onDisplay?.();
      if (window.delayDonationRender) return new Promise((resolve, reject) => { rejectRender = reject; });
      return Promise.resolve();
    },
  };
  return checkout;
} } };
`;

test.beforeEach(async ({ context }) => {
  // No request from a payment test reaches PayPal or FormSubmit.
  await context.route('https://formsubmit.co/**', route => route.abort());
  await context.route('https://www.paypalobjects.com/**', route => route.abort());
  await context.route('https://www.paypal.com/**', route => route.fulfill({
    contentType: 'text/html',
    body: '<!doctype html><html lang="en"><head><title>Mock PayPal</title></head><body><h1>Donation form</h1><p>Test only. No payment controls.</p></body></html>',
  }));
});

for (const [path, language] of [['/affiliates/', 'de'], ['/en/affiliates/', 'en']]) {
  test(`${language}: donation opens over the current page, closes and can reopen`, async ({ page, context }) => {
    let sdkRequests = 0;
    await page.route(sdkUrl, route => {
      sdkRequests += 1;
      return route.fulfill({ contentType: 'text/javascript', body: sdk });
    });
    await page.goto(path);
    const originalUrl = page.url();
    const button = page.locator('[data-paypal-donate]');
    await expect(button).toHaveAttribute('aria-haspopup', 'dialog');
    expect(sdkRequests).toBe(0);

    // Keyboard activation must have the same in-page behavior as a tap or click.
    await button.focus();
    await button.press('Enter');
    const overlay = page.getByRole('dialog', { name: 'PayPal test checkout' });
    await expect(overlay).toBeVisible();
    await expect(page.frameLocator('iframe[title="PayPal donation form"]').getByRole('heading')).toHaveText('Donation form');
    expect(context.pages()).toHaveLength(1);
    expect(page.url()).toBe(originalUrl);
    expect(await page.locator('main').evaluate(element => element.inert)).toBe(true);
    expect(sdkRequests).toBe(1);

    await overlay.getByRole('button', { name: 'Close PayPal' }).click();
    await expect(overlay).toHaveCount(0);
    await expect(button).toBeFocused();
    expect(await page.locator('main').evaluate(element => element.inert)).toBe(false);

    // Rapid activation must not start multiple payment views.
    await button.evaluate(element => { element.click(); element.click(); });
    await expect(overlay).toHaveCount(1);
    await expect(overlay).toBeVisible();
    expect(context.pages()).toHaveLength(1);
    expect(page.url()).toBe(originalUrl);
    expect(sdkRequests).toBe(1);
    await overlay.getByRole('button', { name: 'Close PayPal' }).click();
    await expect(button).toBeFocused();
  });

  test(`${language}: failed SDK load stays on the page and supports retry`, async ({ page, context }) => {
    let attempts = 0;
    await page.route(sdkUrl, route => {
      attempts += 1;
      return attempts === 1
        ? route.abort('failed')
        : route.fulfill({ contentType: 'text/javascript', body: sdk });
    });
    await page.goto(path);
    const originalUrl = page.url();
    const button = page.locator('[data-paypal-donate]');
    await button.click();
    await expect(page.getByRole('status')).toContainText(language === 'de' ? 'konnte nicht geladen werden' : 'could not be loaded');
    const fallback = page.locator('[data-paypal-fallback]');
    await expect(fallback).toBeVisible();
    await expect(fallback).toHaveAttribute('href', donationUrl);
    await expect(button).toBeFocused();
    expect(context.pages()).toHaveLength(1);
    expect(page.url()).toBe(originalUrl);
    expect(await page.locator('main').evaluate(element => element.inert)).toBe(false);

    await button.click();
    await expect(page.getByRole('dialog', { name: 'PayPal test checkout' })).toBeVisible();
    await expect(fallback).toBeHidden();
    expect(attempts).toBe(2);
    expect(context.pages()).toHaveLength(1);
    expect(page.url()).toBe(originalUrl);
  });

  test(`${language}: donation SDK shell without a head keeps its close control accessible`, async ({ page, context }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route(sdkUrl, route => route.fulfill({ contentType: 'text/javascript', body: sdk }));
    await page.addInitScript(() => { window.useSdkShell = true; });
    await page.goto(path);
    const originalUrl = page.url();
    const button = page.locator('[data-paypal-donate]');
    await button.click();
    const shellElement = page.locator('iframe[title="PayPal Checkout Overlay"]');
    const shell = page.frameLocator('iframe[title="PayPal Checkout Overlay"]');
    const dialog = shell.getByRole('dialog', { name: language === 'de' ? 'PayPal-Spende' : 'PayPal donation', exact: true });
    const close = shell.getByRole('button', { name: language === 'de' ? 'PayPal-Spendenfenster schließen' : 'Close PayPal donation window' });
    await expect(dialog).toBeVisible();
    await expect(close).toBeFocused();
    expect(await shellElement.evaluate(element => element.contentDocument.head === null)).toBe(true);
    const closeBox = await close.boundingBox();
    const formBox = await shell.locator('iframe[title="PayPal donation form"]').boundingBox();
    expect(closeBox.width).toBeGreaterThanOrEqual(44);
    expect(closeBox.height).toBeGreaterThanOrEqual(44);
    expect(closeBox.y + closeBox.height).toBeLessThanOrEqual(formBox.y);
    expect(formBox.x).toBeGreaterThanOrEqual(0);
    expect(formBox.x + formBox.width).toBeLessThanOrEqual(page.viewportSize().width);
    expect(formBox.y + formBox.height).toBeLessThanOrEqual(page.viewportSize().height);
    await expect(page.getByRole('status')).toBeHidden();
    expect(context.pages()).toHaveLength(1);
    expect(page.url()).toBe(originalUrl);

    await close.press('Escape');
    await expect(shellElement).toHaveCount(0);
    await expect(button).toBeFocused();
    expect(await page.locator('main').evaluate(element => element.inert)).toBe(false);

    await button.click();
    await expect(close).toBeFocused();
    await close.press('Space');
    await expect(shellElement).toHaveCount(0);
    await expect(button).toBeFocused();
    expect(errors).toEqual([]);
  });

  test(`${language}: cancelling a loading checkout cannot disrupt a newly opened checkout`, async ({ page, context }) => {
    await page.route(sdkUrl, route => route.fulfill({ contentType: 'text/javascript', body: sdk }));
    await page.addInitScript(() => { window.delayDonationRender = true; });
    await page.goto(path);
    const originalUrl = page.url();
    const button = page.locator('[data-paypal-donate]');
    const overlay = page.getByRole('dialog', { name: 'PayPal test checkout' });
    await button.click();
    await expect(overlay).toBeVisible();

    // Close the loading view and immediately request another one. The old SDK
    // render failure is released only once the new checkout is already visible.
    await overlay.getByRole('button', { name: 'Close PayPal' }).evaluate(element => {
      element.click();
      window.delayDonationRender = false;
      document.querySelector('[data-paypal-donate]').click();
    });
    await expect(overlay).toHaveCount(1);
    await expect(overlay).toBeVisible();
    await page.evaluate(async () => {
      window.finishCancelledDonation();
      await Promise.resolve();
      await Promise.resolve();
    });

    await expect(overlay).toBeVisible();
    await expect(page.getByRole('status')).toBeHidden();
    await expect(page.locator('[data-paypal-fallback]')).toBeHidden();
    expect(await page.locator('main').evaluate(element => element.inert)).toBe(true);
    expect(context.pages()).toHaveLength(1);
    expect(page.url()).toBe(originalUrl);

    await overlay.getByRole('button', { name: 'Close PayPal' }).click();
    await expect(overlay).toHaveCount(0);
    await expect(button).toBeFocused();
    expect(await page.locator('main').evaluate(element => element.inert)).toBe(false);
    expect(await page.locator('body').evaluate(element => getComputedStyle(element).overflow)).not.toBe('hidden');
  });

  test(`${language}: checkout errors restore the page without automatic navigation`, async ({ page, context }) => {
    await page.route(sdkUrl, route => route.fulfill({ contentType: 'text/javascript', body: sdk }));
    await page.addInitScript(() => { window.failDonationRender = true; });
    await page.goto(path);
    const originalUrl = page.url();
    const button = page.locator('[data-paypal-donate]');
    await button.click();
    await expect(page.getByRole('status')).toContainText(language === 'de' ? 'konnte nicht geladen werden' : 'could not be loaded');
    await expect(page.locator('[data-paypal-fallback]')).toBeVisible();
    await expect(button).toBeFocused();
    expect(await page.locator('main').evaluate(element => element.inert)).toBe(false);
    expect(await page.locator('body').evaluate(element => getComputedStyle(element).overflow)).not.toBe('hidden');
    expect(context.pages()).toHaveLength(1);
    expect(page.url()).toBe(originalUrl);
  });
}
