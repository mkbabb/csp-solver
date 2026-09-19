import { defineConfig } from "@playwright/test";

/**
 * ACC-SIX pass-1 PROTOTYPE scratch config. NOT the estate's default (that one boots :3000
 * through a `webServer` block and a globalSetup). This one points at the prototype's own dev
 * server — a throwaway worktree carrying plan steps 1-8, served on 127.0.0.1:4241 (4235, the
 * charter's port, was held by a concurrent lane; 4241 is the next free in the band).
 */
const here =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/prototype/ACC-SIX/probe";

export default defineConfig({
  testDir: here,
  testMatch: /acc-six-proto\.probe\.ts$/,
  timeout: 240000,
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
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4241",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
