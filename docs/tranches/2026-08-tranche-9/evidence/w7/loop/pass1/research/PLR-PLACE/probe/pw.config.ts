// PLR-PLACE pass-1 scratch config. A copy of web/frontend/playwright.config.ts with
// `webServer` and `globalSetup` dropped and baseURL pinned to this lane's own dev server
// (127.0.0.1:4243, `npx vite --host 127.0.0.1 --port 4243 --strictPort` from web/frontend).
// NEVER the estate's default config — that one starts :3000.
//
// Run from web/frontend:
//   npx playwright test -c <this file> --project=chromium
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: __dirname,
  testMatch: /\.spec\.ts$/,
  timeout: 300000,
  expect: { timeout: 20000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  use: {
    baseURL: "http://127.0.0.1:4243",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
