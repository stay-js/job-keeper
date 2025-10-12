import { test, expect } from '@playwright/test';
import { clerk, setupClerkTestingToken } from '@clerk/testing/playwright';

test.describe('User Preferences', () => {
  test('should open user preferences modal when signing in with a fresh account', async ({
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
        identifier: process.env.FRESH_E2E_CLERK_USER_EMAIL,
        password: process.env.FRESH_E2E_CLERK_USER_PASSWORD,
      },
    });

    await page.waitForURL(`${baseURL}/dashboard`, { timeout: 20_000 });

    await expect(page.locator('text=Set Locale & Currency')).toBeVisible();
  });
});
