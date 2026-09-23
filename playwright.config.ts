import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests', workers: 1, timeout: 120000,
  outputDir: '/tmp/vizard-editor-test-results',
  use: { baseURL: 'http://127.0.0.1:4322/vizard-docs/', browserName: 'chromium',
    launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined } },
  webServer: { command: 'npm run dev -- --host 127.0.0.1 --port 4322', url: 'http://127.0.0.1:4322/vizard-docs/', reuseExistingServer: !process.env.CI,
    env: { ASTRO_DEV_BACKGROUND: '1', VIZARD_SUGGESTIONS_API: 'http://127.0.0.1:8787', VIZARD_TURNSTILE_SITE_KEY: '1x00000000000000000000AA' } },
});
