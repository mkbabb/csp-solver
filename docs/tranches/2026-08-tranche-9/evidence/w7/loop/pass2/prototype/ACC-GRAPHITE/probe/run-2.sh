#!/bin/zsh
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-40/web/frontend
PW=./node_modules/.bin/playwright
CFG=lane-probe/pw.config.ts

echo "=== G-WASH + G9, both engines ==="
$PW test --config $CFG wash.probe --project=chromium --project=webkit
echo "EXIT_WASH=$?"

echo "=== G0b subpath arms, both engines ==="
$PW test --config $CFG dash-g0b
echo "EXIT_G0B=$?"

echo "=== G1/G5: hue census + accent kinship, both engines ==="
$PW test --config $CFG hue-census.COPY --project=chromium --project=webkit
echo "EXIT_HUE=$?"
$PW test --config $CFG accent-kinship.COPY --project=chromium --project=webkit
echo "EXIT_KIN=$?"

echo "ALL DONE 2"
