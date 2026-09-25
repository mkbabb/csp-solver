#!/bin/bash
# G10 battery: 6 gated runs per engine on the tree (dev :4237), then the plants once per engine.
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accg7
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-40/web/frontend
OUT=$S/logs/g10.tsv; : > $OUT
one() { # tag proj base clock
  local log=$S/logs/g10-$1-$2.log
  local ld="$(sysctl -n vm.loadavg) sib $(pgrep -f 'playwright|vitest|vite' | wc -l | tr -d ' ')"
  BASE=$3 CLOCK=$4 MATCH=front-rate-p7.spec.ts npx playwright test --config .accg7/pw.config.ts --project $2 > $log 2>&1
  local rc=$?
  echo -e "$1\t$2\t$4\t$rc\t$ld\t$(grep -E '^G10 ' $log | sed 's/^G10 [a-z]* //' | tr '\n' ' ' | cut -c1-600)" >> $OUT
}
for proj in chromium webkit; do
  for i in 1 2 3 4 5 6; do one gated$i $proj http://127.0.0.1:4237 driven; done
  one ablated $proj http://127.0.0.1:4238 driven
  one pass6cmp $proj http://127.0.0.1:4239 driven
  one clock60 $proj http://127.0.0.1:4237 60
done
echo ALLDONE >> $OUT
