import { defineConfig } from "@playwright/test";
// MOT-LADDER pass 10 · spoken-gallery:254 ablation (CHAIR pick 13): the tree's own spec, served dist,
// no webServer (:3000 is foreign), one worker, headless default shell.
const FE = process.env.SG_FE;
export default defineConfig({
  testDir: `${FE}/e2e`,
  testMatch: /spoken-gallery\.spec\.ts/,
  outputDir: process.env.SG_OUT,
  reporter: [["list"], ["json", { outputFile: `${process.env.SG_OUT}/report.json` }]],
  workers: 1,
  retries: 0,
  timeout: 60000,
  expect: { timeout: 10000 },
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL, viewport: { width: 1280, height: 800 } },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
});
