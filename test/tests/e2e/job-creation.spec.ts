import { test, expect } from '@playwright/test';
import { clerk, setupClerkTestingToken } from '@clerk/testing/playwright';

test.describe('Job Creation', () => {
  test('should display error message when trying to create job without available positions', async ({
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

    await page.click("button:has-text('Jobs')");

    await page.click("button:has-text('Add new')");

    await expect(
      page.locator('text=In order to add jobs, you need to create at least one position first!'),
    ).toBeVisible();
  });
});
