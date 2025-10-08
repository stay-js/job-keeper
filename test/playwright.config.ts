import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

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
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  webServer,
});
