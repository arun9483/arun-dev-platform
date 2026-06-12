import { test, expect } from '@playwright/test';

import { checkA11y } from './fixtures/a11y';

test.describe('Achievements', () => {
  test('renders achievements list', async ({ page }) => {
    await page.goto('/achievements');

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    await checkA11y(page, '/achievements');
  });
});
