cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-33/web/frontend
for eng in webkit chromium; do
  echo "load $(sysctl -n vm.loadavg)" > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/face8/fl3-$eng.log
  PLAYWRIGHT_JSON_OUTPUT_NAME=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/face8/fl3-$eng.json npx playwright test -c .face8/pw.face8.ts --project=$eng e2e/face-law.spec.ts e2e/keys-crib.spec.ts --reporter=list,json >> /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/face8/fl3-$eng.log 2>&1
  echo "EXIT $?" >> /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/face8/fl3-$eng.log
done
