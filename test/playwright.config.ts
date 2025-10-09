import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const ENV = process.env.TEST_ENV || 'dev';
const isDev = ENV === 'dev';

const baseURL = isDev ? 'http://localhost:3000' : 'https://job-keeper.znagy.hu';

const webServer = isDev
  ? {
      command: 'cd ../web && pnpm dev',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
    }
  : undefined;

process.env.CLERK_PUBLISHABLE_KEY = isDev
  ? process.env.DEV_CLERK_PUBLISHABLE_KEY
  : process.env.PROD_CLERK_PUBLISHABLE_KEY;

process.env.CLERK_SECRET_KEY = isDev
  ? process.env.DEV_CLERK_SECRET_KEY
  : process.env.PROD_CLERK_SECRET_KEY;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [['html', { outputFolder: './coverage/playwright-report' }]],
  outputDir: './coverage/test-results',

  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'setup clerk',
      testMatch: /global\.setup\.ts/,
    },

    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
      dependencies: ['setup clerk'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup clerk'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      dependencies: ['setup clerk'],
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
      dependencies: ['setup clerk'],
    },
  ],

  webServer,
});
