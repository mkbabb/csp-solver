// PAL-WALK pass 6 scratch: filter-census.spec.ts against a BUILT dist, both themes via prefers-color-scheme.
import { defineConfig } from "@playwright/test";
const scheme = (process.env.WALK_SCHEME || "light") as "light" | "dark";
export default defineConfig({
  timeout: 300000, expect: { timeout: 20000 }, workers: 1, retries: 0, reporter: "list",
  outputDir: process.env.WALK_OUT || "./test-results",
  projects: ["chromium", "webkit"].map((b) => ({ name: b, testDir: "../e2e", testMatch: /filter-census\.spec\.ts$/, use: { browserName: b as "chromium" | "webkit" } })),
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL, viewport: { width: 1280, height: 800 }, colorScheme: scheme, screenshot: "off" },
});
