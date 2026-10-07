export default {
  testDir: process.env.PWDIR || "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-35/web/frontend/e2e",
  testMatch: /focus-ring\.spec\.ts$/,
  outputDir: "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/mrklive8b/pw-out-" + (process.env.PWOUT || "lane"),
  timeout: 30000,
  expect: { timeout: 10000 },
  fullyParallel: true,
  workers: process.env.PWW ? +process.env.PWW : 3,
  retries: 0,
  reporter: "list",
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4238", viewport: { width: 1280, height: 800 }, screenshot: "off" },
};
