import { defineConfig } from "@playwright/test";

/** Same scratch config at dpr 3 — the crops the brief names, and the adjacency walk at a
 *  resolution that can resolve a 0.78px gap (at dpr 1 it cannot: both marks antialias into it). */
export default defineConfig({
  testDir: ".",
  testMatch: /.*\.probe\.ts$/,
  timeout: 120000,
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
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4239",
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 3,
    screenshot: "off",
  },
});
