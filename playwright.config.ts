import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  // `next start` needs a server output next.config.ts no longer produces
  // (output: 'export', for GitHub Pages — see there). `next dev` still works
  // normally against this config: none of the features that config disallows
  // (redirects, cookies, ISR, etc.) are used anywhere on the site.
  // A dedicated port, not 3000: other local projects run dev servers on the
  // default port too, and Playwright's reuseExistingServer would happily
  // attach to whichever one got there first.
  webServer: {
    command: 'npm run dev -- -p 3211',
    port: 3211,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  use: {
    baseURL: 'http://localhost:3211',
  },
});
