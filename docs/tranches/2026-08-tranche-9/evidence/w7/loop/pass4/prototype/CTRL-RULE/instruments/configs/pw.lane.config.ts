// CTRL-RULE pass 3 — the LANE's playwright config: the estate's default suite with its
// `webServer` dropped (it starts :3000, which is foreign to this band) and the baseURL pointed
// at this lane's own :4231. Never the estate's default config.
import { defineConfig } from "@playwright/test";

const OTHER_CONFIGS = [
  /visual-golden\.spec\.ts$/,
  /throttled-void\.spec\.ts$/,
  /filter-census\.spec\.ts$/,
  /wordmark-integrity\.spec\.ts$/,
  /theme-bake-freshness\.spec\.ts$/,
  /theme-quadrants\.spec\.ts$/,
];

export default defineConfig({
  testDir: "../e2e",
  testIgnore: OTHER_CONFIGS,
  timeout: 30000,
  expect: { timeout: 10000 },
  fullyParallel: true,
  retries: 0,
  reporter: [["line"], ["json", { outputFile: process.env.PW_JSON || "e2e-scratch-report.json" }]],
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" }, testIgnore: [...OTHER_CONFIGS] },
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4231",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
