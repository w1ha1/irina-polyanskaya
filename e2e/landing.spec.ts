import { test, expect } from '@playwright/test';

test('RU landing shows the hero name and a working Telegram CTA', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Ирина Полянская');
  await expect(page.getByRole('link', { name: 'Записаться на съёмку' })).toHaveAttribute(
    'href',
    /t\.me\/polka977/
  );
});

test('EN landing shows English copy', async ({ page }) => {
  await page.goto('/en');
  await expect(page.locator('h1')).toContainText('Irina Polyanskaya');
  await expect(page.getByRole('link', { name: 'Book a session' }).first()).toBeVisible();
});

test('language switcher moves from RU to EN and back', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Switch language' }).click();
  await expect(page).toHaveURL(/\/en$/);
  await page.getByRole('link', { name: 'Switch language' }).click();
  await expect(page).toHaveURL(/\/$/);
});
