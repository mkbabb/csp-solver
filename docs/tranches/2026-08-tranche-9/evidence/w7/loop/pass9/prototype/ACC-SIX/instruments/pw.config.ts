import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "..",
  testMatch: ["e2e/*.spec.ts"],
  outputDir: process.env.PWOUT,
  reporter: "list",
  workers: 1,
  timeout: 180000,
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  use: { baseURL: process.env.BASE, viewport: { width: 1280, height: 800 } },
});
