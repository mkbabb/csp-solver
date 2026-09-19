import { defineConfig } from "@playwright/test";

/**
 * CTRL-FACE pass-1 SCRATCH CONFIG. Copied from `r0/r1-controls/probe/pw.config.ts`; the only
 * edits are the default baseURL (this lane's port, 4234) and the comment. No `webServer` (the
 * estate's default starts :3000, which this lane may not touch), no `globalSetup`, no goldens.
 * Both engines.
 */
export default defineConfig({
  testDir: ".",
  timeout: 180000,
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
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4234",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
