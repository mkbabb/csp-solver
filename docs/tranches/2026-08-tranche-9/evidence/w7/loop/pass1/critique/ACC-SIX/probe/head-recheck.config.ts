import { defineConfig } from "@playwright/test";

/**
 * ACC-SIX pass-1 CRITIQUE — the HEAD re-check config.
 *
 * NOT the estate's default (that one boots :3000 through `webServer` + globalSetup). This
 * points at the MAIN tree's own dev server, already live on 127.0.0.1:4239 — HEAD aab67b92,
 * `git status` clean under web/. The whole 4230-4249 band was held by concurrent lanes when
 * this ran, so the prototype's own worktree could not be re-served; the proto side of every
 * comparison below is therefore computed from its bytes, not from a second server.
 */
const here =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/critique/ACC-SIX/probe";

export default defineConfig({
  testDir: here,
  testMatch: /head-recheck\.probe\.ts$/,
  timeout: 180000,
  expect: { timeout: 20000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4239",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
