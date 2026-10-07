#!/bin/bash
# pwcfg.sh <copy root> <spec regex> : a scratch PW config inside the COPY (never the worktree)
P=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ledger8/p8
mkdir -p $1/web/frontend/.ledger8p
cat > $1/web/frontend/.ledger8p/pw.config.mts <<EOC
import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "..",
  testMatch: $2,
  timeout: 300000,
  retries: 0,
  workers: 2,
  reporter: "list",
  outputDir: "$P/pw-out",
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL, viewport: { width: 1280, height: 800 } },
});
EOC
