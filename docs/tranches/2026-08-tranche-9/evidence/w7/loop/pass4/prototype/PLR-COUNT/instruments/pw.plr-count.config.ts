import { defineConfig } from "@playwright/test";
const port = Number(process.env.PLRC_PORT ?? 4242);
export default defineConfig({
  testDir: process.env.PLRC_DIR ?? "../e2e",
  timeout: 90000,
  expect: { timeout: 15000 },
  fullyParallel: false,
  workers: 2,
  retries: 0,
  reporter: "list",
  outputDir: "./test-results",
  use: { baseURL: `http://127.0.0.1:${port}` },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
});
