cd /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/face8/s10h/web/frontend
run() { tag=$1; eng=$2; shift 2
  echo "load $(sysctl -n vm.loadavg)" > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/face8/$tag-$eng.log
  PLAYWRIGHT_JSON_OUTPUT_NAME=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/face8/$tag-$eng.json npx playwright test -c .face8s/pw.ts --project=$eng "$@" --reporter=line,json >> /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/face8/$tag-$eng.log 2>&1
  echo "EXIT $?" >> /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/face8/$tag-$eng.log; echo "load $(sysctl -n vm.loadavg)" >> /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/face8/$tag-$eng.log; }
run seal20b webkit e2e/visual-regression.spec.ts -g "separation|P1 seal" --repeat-each=20
run seal20b chromium e2e/visual-regression.spec.ts -g "separation|P1 seal" --repeat-each=20
run vrwhole webkit e2e/visual-regression.spec.ts --repeat-each=7
run vrwhole chromium e2e/visual-regression.spec.ts --repeat-each=3
