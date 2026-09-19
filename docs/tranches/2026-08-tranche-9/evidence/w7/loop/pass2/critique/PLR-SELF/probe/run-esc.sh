#!/bin/sh
D=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/critique/PLR-SELF/probe
export NODE_PATH=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-52/web/frontend
npx playwright test --config $D/crit.config.ts --project=chromium -g "escape after" > $D/run-esc-chromium.log 2>&1
npx playwright test --config $D/crit.config.ts --project=webkit -g "escape after" > $D/run-esc-webkit.log 2>&1
echo ESC DONE
