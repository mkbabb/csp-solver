#!/bin/bash
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-35/web/frontend
for c in 60 driven native; do for base in "4238 lane" "4251 control"; do set -- $base
  echo "=== CLOCK=$c $2 load $(sysctl -n vm.loadavg)"
  CLOCK=$c PLAYWRIGHT_BASE_URL=http://127.0.0.1:$1 npx playwright test --config /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/mrklive8b/pw.hz.mjs 2>&1 | grep -E '^HZ|passed|failed|Error'
done; done
echo ALLDONE
