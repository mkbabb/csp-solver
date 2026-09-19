// Scratch Playwright config for the CTRL-TAPE pass-2 lane. The estate's default starts its
// own :3000 dev server and runs the whole suite; this one has NO webServer and points at the
// lane's port. Both engines, as the brief binds.
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 60000,
  expect: { timeout: 15000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4230",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
