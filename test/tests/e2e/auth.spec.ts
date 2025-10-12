import { test, expect } from '@playwright/test';
import { clerk, setupClerkTestingToken } from '@clerk/testing/playwright';

test.describe('Authentication', () => {
  test('should open sign in modal when clicking sign in button', async ({ page }) => {
    await page.goto('/');

    await page.click("button:has-text('Go to Dashboard')");

    await expect(page.locator('[role="dialog"]')).toBeVisible();
  });

  test('should redirect to "/dashboard" after signing in via email and password', async ({
    page,
    baseURL,
    browserName,
  }) => {
    if (browserName === 'webkit' && process.env.TEST_ENV === 'prod') test.skip();

    await setupClerkTestingToken({ page });

    await page.goto('/');

    await page.click("button:has-text('Go to Dashboard')");

    await page.fill('input#identifier-field', process.env.E2E_CLERK_USER_EMAIL);
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
        identifier: process.env.E2E_CLERK_USER_EMAIL,
        password: process.env.E2E_CLERK_USER_PASSWORD,
      },
    });

    await page.waitForURL(`${baseURL}/**`, { timeout: 20_000 });

    await expect(page).toHaveURL(/dashboard/, { timeout: 30_000 });
  });

  test('should redirect to "/" after signing out (clerk signIn, signOut)', async ({
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
        identifier: process.env.E2E_CLERK_USER_EMAIL,
        password: process.env.E2E_CLERK_USER_PASSWORD,
      },
    });

    await page.waitForURL(`${baseURL}/dashboard`, { timeout: 20_000 });

    await clerk.signOut({ page });

    await page.waitForURL(`${baseURL}/**`, { timeout: 20_000 });
    await expect(page).toHaveURL(`${baseURL}/`, { timeout: 30_000 });
  });

  test('should redirect to "/" after signing out (email and password)', async ({
    page,
    baseURL,
    browserName,
  }) => {
    if (browserName === 'webkit' && process.env.TEST_ENV === 'prod') test.skip();

    await setupClerkTestingToken({ page });

    await page.goto('/');

    await page.click("button:has-text('Go to Dashboard')");

    await page.fill('input#identifier-field', process.env.E2E_CLERK_USER_EMAIL);
    await page.click('button:has-text("Continue")');
    await page.fill('input#password-field', process.env.E2E_CLERK_USER_PASSWORD);
    await page.click('button:has-text("Continue")');

    await page.waitForURL(`${baseURL}/dashboard`, { timeout: 20_000 });

    await page.click('button.cl-userButtonTrigger');
    await page.click('button:has-text("Sign out")');

    await page.waitForURL(`${baseURL}/**`, { timeout: 20_000 });
    await expect(page).toHaveURL(`${baseURL}/`, { timeout: 30_000 });
  });
});
