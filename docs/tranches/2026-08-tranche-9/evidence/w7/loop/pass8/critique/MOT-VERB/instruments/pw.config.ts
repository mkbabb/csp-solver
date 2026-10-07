import base from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59/web/frontend/playwright.config.ts';
export default {
  ...base,
  testDir: '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59/web/frontend/e2e',
  globalSetup: '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59/web/frontend/e2e/global-setup.ts',
  outputDir: process.env.PW_OUT || '/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/verbcrit8/pw-out',
  reporter: [['list']],
  retries: 0,
  webServer: undefined,
};
