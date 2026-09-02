import { test, expect } from '@playwright/test';

test('clicking a photo opens the lightbox and Escape closes it', async ({ page }) => {
  await page.goto('/gallery');
  await page.locator('main img').first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
});
