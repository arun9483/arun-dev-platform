import { test, expect } from '@playwright/test';

import { checkA11y } from './fixtures/a11y';

test.describe('Projects journey', () => {
  test('lists projects and navigates to a case study', async ({ page }) => {
    await page.goto('/projects');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await checkA11y(page, '/projects');

    const firstProject = page.locator('main a[href^="/projects/"]').first();
    await expect(firstProject).toBeVisible();
    await firstProject.click();

    await expect(page).toHaveURL(/\/projects\/.+/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await checkA11y(page, '/projects/[slug]');
  });
});
