// SCRATCH — pass-7 F3 lane only, deleted at lane close.
//
// Mirrors `playwright.config.ts` EXACTLY except for the server: no `webServer`, because :3000
// is foreign and squatted, and this lane serves its own built dist in the 4230-4260 band.
// The scope lists below are copied verbatim from the real config — a first cut of this file
// omitted them and over-collected four other configs' specs, reddening 10 rows the default
// suite does not own (goldens belong to playwright-golden.config.ts and must never be run,
// let alone re-baselined, from here).
import { defineConfig } from "@playwright/test";

const OTHER_CONFIGS = [
  /visual-golden\.spec\.ts$/,
  /throttled-void\.spec\.ts$/,
  /filter-census\.spec\.ts$/,
  /wordmark-integrity\.spec\.ts$/,
  /theme-bake-freshness\.spec\.ts$/,
];

export default defineConfig({
  testDir: "./e2e",
  testIgnore: OTHER_CONFIGS,
  timeout: 30000,
  expect: { timeout: 10000 },
  fullyParallel: true,
  retries: 0,
  reporter: [["list"]],
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    {
      name: "webkit",
      use: { browserName: "webkit" },
      // PW-WebKit has no clipboard permission — the real config's one hold-out.
      testIgnore: [...OTHER_CONFIGS, /share-truth\.spec\.ts$/],
    },
  ],
  globalSetup: "./e2e/global-setup.ts",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4238",
    viewport: { width: 1280, height: 800 },
    screenshot: "only-on-failure",
  },
});
