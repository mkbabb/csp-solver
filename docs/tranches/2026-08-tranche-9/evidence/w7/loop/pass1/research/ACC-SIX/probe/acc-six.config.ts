import { defineConfig } from "@playwright/test";

/**
 * ACC-SIX pass-1 scratch config. NOT the estate's default (that one boots :3000 through a
 * `webServer` block and a globalSetup). This lane is READ-ONLY on the product and points at
 * the dev server it started itself on 127.0.0.1:4235 (the charter's port).
 */
const here =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/research/ACC-SIX/probe";

export default defineConfig({
  testDir: here,
  testMatch: /acc-six\..*\.probe\.ts$/,
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
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4235",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
