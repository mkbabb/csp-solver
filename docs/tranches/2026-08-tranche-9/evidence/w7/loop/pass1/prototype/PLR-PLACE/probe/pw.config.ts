// PLR-PLACE pass-1 PROTOTYPE scratch config. A copy of web/frontend/playwright.config.ts with
// `webServer` and `globalSetup` dropped and baseURL pinned to this lane's own dev server.
// The lane's charter port 4243 was TAKEN (the pass-1 research server is still on it, serving the
// MAIN tree), so this runs on the next free port in the 4230–4249 band: 4246, --strictPort,
// serving the PROTOTYPE worktree. NEVER the estate's default config — that one starts :3000.
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
    baseURL: "http://127.0.0.1:4246",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
