import { test, expect } from '@playwright/test';
import { clerk, setupClerkTestingToken } from '@clerk/testing/playwright';

test.describe('Authentication', () => {
  test('should open sign in modal when clicking sign in button', async ({ page }) => {
    await page.goto('/');

    const signInButton = page.getByRole('button', { name: /go to dashboard/i });
    await signInButton.click();

    await expect(page.locator('[role="dialog"]')).toBeVisible();
  });

  test('should sign in with GitHub and redirect to "/dashboard" after signing in (only dev, because of bot detection)', async ({
    page,
    baseURL,
  }) => {
    if (process.env.TEST_ENV !== 'dev') test.skip();

    await page.goto('/');

    const signInButton = page.getByRole('button', { name: /go to dashboard/i });
    await signInButton.click();

    const gitHubButton = await page.waitForSelector('button:has-text("GitHub")', {
      timeout: 5_000,
    });
    await gitHubButton.click();

    await page.waitForURL('https://github.com/login**', { timeout: 5_000 });

    await page.fill('input#login_field', process.env.E2E_GITHUB_USERNAME);
    await page.fill('input#password', process.env.E2E_GITHUB_PASSWORD);

    await page.click('input[type="submit"][value="Sign in"]');

    const authorizeButton = page.locator('button:has-text("Authorize")');

    if (await authorizeButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await authorizeButton.click();
    }

    await page.waitForURL(`${baseURL}/**`, { timeout: 20_000 });

    await expect(page).toHaveURL(/dashboard/, { timeout: 15_000 });
  });

  test('should redirect to "/dashboard" after signing in via email and password', async ({
    page,
    baseURL,
    browserName,
  }) => {
    if (browserName === 'webkit' && process.env.TEST_ENV === 'prod') test.skip();

    await setupClerkTestingToken({ page });

    await page.goto('/');

    const signInButton = page.getByRole('button', { name: /go to dashboard/i });
    await signInButton.click();

    await page.fill('input#identifier-field', process.env.E2E_CLERK_USER_USERNAME);
    await page.click('button:has-text("Continue")');
    await page.fill('input#password-field', process.env.E2E_CLERK_USER_PASSWORD);
    await page.click('button:has-text("Continue")');

    await page.waitForURL(`${baseURL}/**`, { timeout: 20_000 });

    await expect(page).toHaveURL(/dashboard/, { timeout: 30_000 });
  });

  test('should redirect to "/dashboard" after signing in via clerk signIn', async ({
    page,
    baseURL,
    browserName,
  }) => {
    if (browserName === 'webkit' && process.env.TEST_ENV === 'prod') test.skip();

    await setupClerkTestingToken({ page });

    await page.goto('/');

    await clerk.signIn({
      page,
      signInParams: {
        strategy: 'password',
        identifier: process.env.E2E_CLERK_USER_USERNAME || process.env.E2E_CLERK_USER_EMAIL!,
        password: process.env.E2E_CLERK_USER_PASSWORD!,
      },
    });

    await page.waitForURL(`${baseURL}/**`, { timeout: 20_000 });

    await expect(page).toHaveURL(/dashboard/, { timeout: 30_000 });
  });
});
