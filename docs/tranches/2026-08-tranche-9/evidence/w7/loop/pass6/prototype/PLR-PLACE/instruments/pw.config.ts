import { defineConfig } from "@playwright/test";
// PLR-PLACE pass-6 scratch config (moved out before return).
export default defineConfig({
  testDir: "..",
  testMatch: [/e2e\/player-place\.spec\.ts$/, /\.plr-place\/probe-.*\.spec\.ts$/, /e2e\/(filter-census|presence|player-mark|session-substrate|join-language-prm|multiplayer)\.spec\.ts$/],
  outputDir: "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plr-place-p6-pw-out",
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
