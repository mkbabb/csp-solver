import { defineConfig } from "@playwright/test";
const port = Number(process.env.PLRC_PORT ?? 4242);
export default defineConfig({
  testDir: process.env.PLRC_DIR ?? "$TREE/web/frontend/e2e",
  timeout: Number(process.env.PLRC_TIMEOUT ?? 300000),
  expect: { timeout: 20000 },
  fullyParallel: false,
  workers: Number(process.env.PLRC_WORKERS ?? 2),
  retries: 0,
  reporter: "list",
  outputDir: process.env.PLRC_PWOUT ?? "$LANE/pw-out",
  use: { baseURL: `http://127.0.0.1:${port}` },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
});
