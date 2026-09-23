import { defineConfig } from "@playwright/test";
const port = Number(process.env.CRIT_PORT ?? 4236);
export default defineConfig({
  testDir: process.env.CRIT_DIR ?? "../e2e",
  timeout: 120000,
  expect: { timeout: 15000 },
  fullyParallel: false,
  workers: Number(process.env.CRIT_WORKERS ?? 2),
  retries: 0,
  reporter: "list",
  outputDir: process.env.CRIT_PWOUT ?? "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit-count/pw-out",
  use: { baseURL: `http://127.0.0.1:${port}` },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
});
