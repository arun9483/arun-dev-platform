import { test, expect } from '@playwright/test';

import { checkA11y } from './fixtures/a11y';

test.describe('Search journey', () => {
  test('searching surfaces matching content', async ({ page }) => {
    await page.goto('/search');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    const searchInput = page.locator('input[type="search"], input[type="text"]').first();
    await expect(searchInput).toBeVisible();
    await searchInput.fill('design system');

    await expect(page.locator('main a[href^="/"]').first()).toBeVisible();

    await checkA11y(page, '/search');
  });
});
