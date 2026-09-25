import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: '..',
  testMatch: ['e2e/fold-verb.spec.ts', '.verbcrit7/*.spec.ts'],
  outputDir: '/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/verbcrit7/pw-out',
  reporter: 'list',
  workers: 2,
  timeout: 90000,
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL, viewport: { width: 1280, height: 800 } },
});
