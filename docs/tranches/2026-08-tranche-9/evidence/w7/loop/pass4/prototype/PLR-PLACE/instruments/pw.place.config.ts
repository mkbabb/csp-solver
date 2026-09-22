import { defineConfig } from "@playwright/test";
// PLR-PLACE pass-4 scratch config: the estate spec + the lane's probes against 127.0.0.1:<PLC_PORT>.
export default defineConfig({
  testDir: "..",
  testMatch: [/e2e\/player-place\.spec\.ts$/, /\.plr-place\/probe-.*\.spec\.ts$/, /e2e\/(filter-census|presence|access|follow-still-authorship|join-language-prm|zone-grammar|player-mark|session-substrate)\.spec\.ts$/],
  timeout: 120000,
  expect: { timeout: 15000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  use: { baseURL: `http://127.0.0.1:${process.env.PLC_PORT ?? "4243"}`, trace: "off" },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
});
