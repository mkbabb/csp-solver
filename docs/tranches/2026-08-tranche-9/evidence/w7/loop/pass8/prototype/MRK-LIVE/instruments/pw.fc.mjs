export default {
  testDir: "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-35/web/frontend/e2e",
  testMatch: /filter-census\.spec\.ts$/,
  outputDir: "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/mrklive8b/pw-out-fc-" + (process.env.SCHEME || "light"),
  timeout: 90000,
  expect: { timeout: 10000 },
  fullyParallel: true,
  workers: 2,
  retries: 0,
  globalSetup: "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-35/web/frontend/e2e/global-setup.ts",
  reporter: "list",
  projects: ["chromium", "webkit"].map((browserName) => ({ name: "filter-census-" + browserName, use: { browserName, colorScheme: process.env.SCHEME || "light" } })),
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL },
};
