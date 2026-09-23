#!/bin/bash
R=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion
W=$R/.claude/worktrees/wf_f72f3b5a-83a-41/web/frontend
K=$R/.claude/worktrees/w7-control/web/frontend
I=$R/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass6/instruments
row() { local name=$1; shift; cd $W; "$@" > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc5crit6/logs/bt-t.log 2>&1; local t=$?; tail -2 /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc5crit6/logs/bt-t.log | tr '\n' ' ' | cut -c1-160 > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc5crit6/logs/bt-tt; cd $K; "$@" > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc5crit6/logs/bt-c.log 2>&1; local c=$?; echo "$name | tree $t | control $c | $(cat /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc5crit6/logs/bt-tt)"; }
row check-copy-register node scripts/check-copy-register.mjs
row lint:lanes npm run -s lint:lanes
row lint:theme-tokens npm run -s lint:theme-tokens
row lint:sleep npm run -s lint:sleep
row test:e2e:projects npm run -s test:e2e:projects
row check-pw-projects node scripts/check-pw-projects.mjs
row "npm run lint (scoped prettier)" npm run -s lint
row "eslint ." npx eslint .
row check-ink-pressure node scripts/check-ink-pressure.mjs
row check-theme-tokens node scripts/check-theme-tokens.mjs
row check-property-block node $I/check-property-block.mjs --fe .
cd $W; FE=$W node $I/undefined-token-census.mjs > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc5crit6/logs/bt-u.log 2>&1; echo "undefined-token-census tree exit $? :: $(tail -4 /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc5crit6/logs/bt-u.log | tr '\n' ' ' | cut -c1-400)"
cd $K; FE=$K node $I/undefined-token-census.mjs > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc5crit6/logs/bt-u2.log 2>&1; echo "undefined-token-census control exit $? :: $(tail -4 /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc5crit6/logs/bt-u2.log | tr '\n' ' ' | cut -c1-400)"
echo BATTERY-DONE
