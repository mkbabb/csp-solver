#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/tape8
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-27/web/frontend
until grep -q "^EXIT" $S/logs/m8-whole.txt 2>/dev/null; do sleep 20; done
M=$S/arch-m8/web/frontend
for side in m8:4230 control:4252; do n=${side%%:*}; p=${side##*:}
  (cd $M && PLAYWRIGHT_BASE_URL=http://127.0.0.1:$p/ npx playwright test -c playwright-golden.config.ts --output $S/pw-out/golden-$n > $S/logs/golden-$n.txt 2>&1; echo "EXIT $?" >> $S/logs/golden-$n.txt)
  (cd $W && TAPE8_BASE=http://127.0.0.1:$p/ TAPE8_TAG=vreg-$n TAPE8_E2E=$M/e2e npx playwright test -c .ctrl-tape8/pw.config.ts visual-regression.spec.ts > $S/logs/vreg-$n.txt 2>&1; echo "EXIT $?" >> $S/logs/vreg-$n.txt)
done
