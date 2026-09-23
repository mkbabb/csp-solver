#!/bin/bash
# E1 tree whole file · E2 the drop-clock row on the SWAP dist (born-RED of the tightened bound) · E3 the control's own spec on the control dist
SP=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad; FE=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-47/web/frontend; CF=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/erase6-ctrl74/web/frontend
cd $FE
PLAYWRIGHT_BASE_URL=http://127.0.0.1:4248 npx playwright test --config .erase6/pw.e2e.config.ts affordances.spec.ts > $SP/erase6-logs/e1-tree.log 2>&1; echo "E1 tree B5bcl whole affordances.spec.ts exit $? :: $(grep -E '[0-9]+ (passed|failed)' $SP/erase6-logs/e1-tree.log | tr '\n' ' ')"
PLAYWRIGHT_BASE_URL=http://127.0.0.1:4246 npx playwright test --config .erase6/pw.e2e.config.ts affordances.spec.ts -g "drop clock" > $SP/erase6-logs/e2-swap.log 2>&1; echo "E2 SWAP dist BnqayoxI drop-clock exit $? :: $(grep -E '[0-9]+ (passed|failed)' $SP/erase6-logs/e2-swap.log | tr '\n' ' ')"
grep -E 'Expected|Received' $SP/erase6-logs/e2-swap.log | head -8
PLAYWRIGHT_BASE_URL=http://127.0.0.1:4248 npx playwright test --config .erase6/pw.e2e.config.ts affordances.spec.ts -g "drop clock" > $SP/erase6-logs/e2b-tree-row.log 2>&1; echo "E2b tree drop-clock row alone exit $?"
cd $CF
PLAYWRIGHT_BASE_URL=http://127.0.0.1:4249 npx playwright test --config .erase6/pw.e2e.config.ts affordances.spec.ts > $SP/erase6-logs/e3-control.log 2>&1; echo "E3 control own spec on control dist exit $? :: $(grep -E '[0-9]+ (passed|failed)' $SP/erase6-logs/e3-control.log | tr '\n' ' ')"
