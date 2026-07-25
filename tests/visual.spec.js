const { test, expect } = require('@playwright/test');

for (const route of [
  ['/', /Jason Shadow/], ['/affiliates/', /Jason Shadow/], ['/impressum/', /Impressum/], ['/datenschutz/', /Datenschutzerklärung/],
]) {
  test(`direct route ${route[0]} renders without horizontal overflow`, async ({ page }) => {
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto(route[0]);
    await expect(page.getByRole('heading', { name: route[1] }).first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBeTruthy();
    expect(errors).toEqual([]);
  });
}

test('navigation, language, portfolio and budget interactions work', async ({ page }) => {
  await page.goto('/');
  if (await page.locator('.menu-toggle').isVisible()) await page.locator('.menu-toggle').click();
  await page.getByRole('button', { name: 'DE' }).first().click();
  await expect(page.getByText('Bariton Sänger · Sprecher · Moderator')).toBeVisible();
  await page.getByRole('button', { name: /next portfolio item/i }).click();
  await expect(page.locator('[data-portfolio-active-title]')).toContainText(/Order 2|Auftrag 2/);
  await page.locator('#budget').fill('750');
  await expect(page.locator('#budget-output')).toHaveText('750 €');
  await expect(page.locator('[data-news-status]')).not.toHaveText(/Loading/);
});

test('mobile navigation is keyboard accessible', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile-only behavior'); await page.goto('/');
  await page.getByRole('button', { name: /open menu/i }).focus(); await page.keyboard.press('Enter');
  await expect(page.locator('#mobile-site-menu')).toBeVisible(); await page.keyboard.press('Escape');
  await expect(page.locator('.site-header')).not.toHaveClass(/is-menu-open/);
});
