import { defineConfig } from "@playwright/test";

/**
 * T9-W7 pass 3 · CTRL-FACE — the lane's scratch config. NOT the estate's default, which starts
 * its own server on :3000; this one attaches to the lane's charter port (the prototype) or, with
 * PW_BASE, to the HEAD control beside it. Deleted before the lane returns; banked in evidence.
 */
export default defineConfig({
  testDir: "./e2e",
  timeout: 60000,
  expect: { timeout: 10000 },
  fullyParallel: true,
  retries: 0,
  workers: 2,
  reporter: [["line"]],
  projects: [
    { name: "chromium", use: { browserName: "chromium" as const } },
    { name: "webkit", use: { browserName: "webkit" as const } },
  ],
  use: {
    baseURL: process.env.PW_BASE || "http://127.0.0.1:4234",
    viewport: { width: 1280, height: 800 },
    screenshot: "only-on-failure" as const,
  },
});
