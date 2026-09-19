#!/bin/sh
D=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/critique/PLR-SELF/probe
PROTO=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-52/web/frontend
MAIN=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend
export NODE_PATH=$MAIN/node_modules
cd $PROTO
npx playwright test --config $D/crit.config.ts --project=chromium -g "gallery pi" > $D/run-gallery-chromium.log 2>&1
npx playwright test --config $D/crit.config.ts --project=webkit -g "gallery pi" > $D/run-gallery-webkit.log 2>&1
echo GALLERY DONE
