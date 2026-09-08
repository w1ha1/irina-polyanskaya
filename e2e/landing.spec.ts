import { test, expect } from '@playwright/test';

test('root redirects to the RU landing', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/ru\/?$/);
  await expect(page.locator('h1')).toContainText('Ирина Полянская');
});

test('RU landing shows the hero name and a working Telegram CTA', async ({ page }) => {
  await page.goto('/ru/');
  await expect(page.locator('h1')).toContainText('Ирина Полянская');
  await expect(page.getByRole('link', { name: 'Записаться на съёмку' })).toHaveAttribute(
    'href',
    /t\.me\/polka977/
  );
});

test('EN landing shows English copy', async ({ page }) => {
  await page.goto('/en/');
  await expect(page.locator('h1')).toContainText('Irina Polyanskaya');
  await expect(page.getByRole('link', { name: 'Book a session' }).first()).toBeVisible();
});

test('language switcher moves between RU, EN, and HY', async ({ page }) => {
  await page.goto('/ru/');
  await page.getByRole('link', { name: 'EN', exact: true }).click();
  await expect(page).toHaveURL(/\/en\/?$/);
  await page.getByRole('link', { name: 'HY', exact: true }).click();
  await expect(page).toHaveURL(/\/hy\/?$/);
  await page.getByRole('link', { name: 'RU', exact: true }).click();
  await expect(page).toHaveURL(/\/ru\/?$/);
});
