import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should open sign in modal when clicking sign in button', async ({ page }) => {
    await page.goto('/');
    const signInButton = page.getByRole('button', { name: /go to dashboard/i });
    await signInButton.click();
    await expect(page.locator('[role="dialog"]')).toBeVisible();
  });
});
