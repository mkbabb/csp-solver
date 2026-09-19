#!/bin/zsh
# The lane's remaining browser arms, one shell script so the agent polls a log instead of
# waiting in the foreground (the stall trap).
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-40/web/frontend
PW=./node_modules/.bin/playwright
CFG=lane-probe/pw.config.ts

echo "=== desk webkit ==="
VP=desk $PW test --config $CFG proto-board --project=webkit
echo "EXIT_DW=$?"

echo "=== phone chromium ==="
VP=phone $PW test --config $CFG proto-board --project=chromium
echo "EXIT_PC=$?"

echo "=== phone webkit ==="
VP=phone $PW test --config $CFG proto-board --project=webkit
echo "EXIT_PW=$?"

echo "=== G0 dash, both engines ==="
$PW test --config $CFG dash-g0
echo "EXIT_G0=$?"

echo "ALL DONE"
