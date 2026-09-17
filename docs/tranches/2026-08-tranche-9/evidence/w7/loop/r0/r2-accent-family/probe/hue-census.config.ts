import { defineConfig } from "@playwright/test";

/**
 * R2 scratch config. NOT the estate's default (that one boots :3000 through a
 * `webServer` block and a globalSetup that asserts the SPA on it). Round zero is
 * READ-ONLY on the product, so this config lives under the wave's evidence dir and
 * points at a dev server the lane starts itself on 127.0.0.1:4237.
 */
const here =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/r0/r2-accent-family/probe";

export default defineConfig({
  testDir: here,
  testMatch: /.*\.probe\.ts$/,
  timeout: 120000,
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
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4237",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
