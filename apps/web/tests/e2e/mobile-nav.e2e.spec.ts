import { test, expect } from '@playwright/test';

import { checkA11y } from './fixtures/a11y';

// Below the sm breakpoint (640px) the main navigation is the design system's Drawer.
test.use({ viewport: { width: 390, height: 844 } });

test.describe('Mobile navigation', () => {
  test('opens the menu, navigates from it, and closes as it goes', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'Open menu' }).click();
    const menu = page.getByRole('dialog', { name: 'Menu' });
    await expect(menu).toBeVisible();
    await checkA11y(page, '/ (mobile menu open)');

    await menu.getByRole('link', { name: 'Articles' }).click();
    await expect(page).toHaveURL(/\/articles$/);
    await expect(menu).toBeHidden();
  });

  test('closes on Esc and returns focus to the menu button', async ({ page }) => {
    await page.goto('/');

    const trigger = page.getByRole('button', { name: 'Open menu' });
    await trigger.click();
    await expect(page.getByRole('dialog', { name: 'Menu' })).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog', { name: 'Menu' })).toBeHidden();
    await expect(trigger).toBeFocused();
  });
});
