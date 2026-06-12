import { test, expect } from '@playwright/test';

import { checkA11y } from './fixtures/a11y';

test.describe('Home', () => {
  test('renders hero and primary navigation', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('navigation').first()).toBeVisible();

    await checkA11y(page, '/');
  });
});
