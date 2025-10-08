import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should open sign in modal when clicking sign in button', async ({ page }) => {
    await page.goto('/');
    const signInButton = page.getByRole('button', { name: /go to dashboard/i });
    await signInButton.click();
    await expect(page.locator('[role="dialog"]')).toBeVisible();
  });

  test('should redirect to "/dashboard" after signing in', async ({ page, baseURL }) => {
    await page.goto('/');
    const signInButton = page.getByRole('button', { name: /go to dashboard/i });
    await signInButton.click();

    const gitHubButton = await page.waitForSelector('button:has-text("GitHub")', {
      timeout: 5_000,
    });
    await gitHubButton.click();

    await page.waitForURL('https://github.com/login**', { timeout: 5_000 });

    await page.fill('input#login_field', process.env.GITHUB_USERNAME);
    await page.fill('input#password', process.env.GITHUB_PASSWORD);

    await page.click('input[type="submit"][value="Sign in"]');

    const authorizeButton = page.locator('button:has-text("Authorize")');

    if (await authorizeButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await authorizeButton.click();
    }

    await page.waitForURL(`${baseURL}/**`, { timeout: 20_000 });

    await expect(page).toHaveURL(`${baseURL}/dashboard`);
  });
});
