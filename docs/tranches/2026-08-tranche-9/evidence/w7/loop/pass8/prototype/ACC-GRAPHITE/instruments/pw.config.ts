import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./spec",
  testMatch: process.env.MATCH ?? "bandc.crit.ts",
  outputDir: process.env.PW_OUT ?? "./out",
  timeout: 240_000,
  workers: 1,
  reporter: [["list"]],
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
