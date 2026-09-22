#!/bin/zsh
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-1/web/frontend
for d in src/games src/pencil src/composables src/lib "src/App src/main src/assets"; do
  npx vitest run ${=d} > .pal-walk/vitest-$(echo $d | tr ' /' '__').log 2>&1
  echo "$d → exit $? · $(grep -E 'Test Files' .pal-walk/vitest-$(echo $d | tr ' /' '__').log | tail -1) · $(grep -E '^ +Tests ' .pal-walk/vitest-$(echo $d | tr ' /' '__').log | tail -1)"
done
echo VITEST_DONE
