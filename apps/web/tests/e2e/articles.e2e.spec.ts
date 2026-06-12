import { test, expect } from '@playwright/test';

import { checkA11y } from './fixtures/a11y';

test.describe('Articles journey', () => {
  test('lists articles and navigates to an article', async ({ page }) => {
    await page.goto('/articles');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await checkA11y(page, '/articles');

    const firstArticle = page.locator('main a[href^="/articles/"]').first();
    await expect(firstArticle).toBeVisible();
    await firstArticle.click();

    await expect(page).toHaveURL(/\/articles\/.+/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await checkA11y(page, '/articles/[slug]');
  });

  test('article renders highlighted code blocks', async ({ page }) => {
    await page.goto('/articles/react-server-components-deep-dive');

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('pre code').first()).toBeVisible();
  });
});
