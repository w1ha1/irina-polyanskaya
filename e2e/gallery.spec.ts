import { test, expect } from '@playwright/test';

test('gallery filters narrow the visible photos', async ({ page }) => {
  await page.goto('/gallery');
  const allCount = await page.locator('main img').count();
  await page.getByRole('tab', { name: 'Портрет' }).click();
  const portraitCount = await page.locator('main img').count();
  expect(portraitCount).toBeGreaterThan(0);
  expect(portraitCount).toBeLessThan(allCount);
});

test('clicking a photo opens the lightbox and Escape closes it', async ({ page }) => {
  await page.goto('/gallery');
  await page.locator('main img').first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
});
