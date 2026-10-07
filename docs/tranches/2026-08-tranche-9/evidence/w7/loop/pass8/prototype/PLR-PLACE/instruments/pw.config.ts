import { defineConfig } from "@playwright/test";
// PLR-PLACE pass-8 scratch config (moved out before return).
export default defineConfig({
  testDir: "..",
  testMatch: [/\.place8\/p8-.*\.spec\.ts$/, /e2e\/(player-place|player-mark|presence|session-substrate|join-language-prm|multiplayer|filter-census)\.spec\.ts$/],
  outputDir: process.env.P8_OUTDIR ?? "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/place8/pw-out",
  timeout: 150000,
  expect: { timeout: 15000 },
  fullyParallel: false,
  workers: Number(process.env.P8_WK ?? 1),
  retries: 0,
  reporter: "list",
  use: { baseURL: `http://127.0.0.1:${process.env.P8_PORT ?? "4243"}`, trace: "off" },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
});
