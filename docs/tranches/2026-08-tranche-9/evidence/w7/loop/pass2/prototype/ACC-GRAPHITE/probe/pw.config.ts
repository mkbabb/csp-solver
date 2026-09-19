import { defineConfig } from "@playwright/test";

/**
 * ACC-GRAPHITE pass-2 PROTOTYPE scratch config. NOT the estate's default (that one boots
 * :3000 via a webServer block + a globalSetup asserting the SPA). Points at this lane's own
 * dev server on 127.0.0.1:4235, serving the prototype worktree. It lives INSIDE the worktree
 * because the evidence tree has no `node_modules` above it and `@playwright/test` has to
 * resolve; the file is copied back to the lane's `probe/` dir with the readings.
 */
export default defineConfig({
  testDir: "./",
  testMatch: /.*\.probe\.ts$/,
  timeout: 300000,
  expect: { timeout: 15000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4235",
    viewport:
      process.env.VP === "phone"
        ? { width: 393, height: 699 }
        : { width: 1280, height: 800 },
    deviceScaleFactor: process.env.VP === "phone" ? 3 : 1,
    screenshot: "off",
  },
});
