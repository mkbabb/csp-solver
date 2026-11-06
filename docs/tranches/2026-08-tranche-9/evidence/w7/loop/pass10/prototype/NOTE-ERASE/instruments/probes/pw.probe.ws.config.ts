import { defineConfig } from "@playwright/test";
// NOTE-ERASE pass-10 scratch probes (never banked): the union (:4240) and the control (:4248) are this run's own webServers.
export default defineConfig({
  testDir: ".",
  testMatch: /\.probe\.ts$/,
  timeout: 240000,
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  outputDir: "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/NOTE-ERASE/pw-out-probe",
  webServer: [
    { command: "npx vite preview --config .erase10-build.mts --outDir /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/NOTE-ERASE/dist-u10 --host 127.0.0.1 --port 4240 --strictPort", cwd: "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/NOTE-ERASE/copies/u10f/web/frontend", url: "http://127.0.0.1:4240/", reuseExistingServer: false, timeout: 120000 },
    { command: "npx vite preview --config .vite-control.config.ts --outDir dist --host 127.0.0.1 --port 4248 --strictPort", cwd: "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend", url: "http://127.0.0.1:4248/", reuseExistingServer: false, timeout: 120000 },
  ],
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
});
