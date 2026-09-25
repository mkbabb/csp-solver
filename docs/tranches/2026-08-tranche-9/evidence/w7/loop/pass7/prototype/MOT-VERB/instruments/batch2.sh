#!/bin/bash
Q="?game=sudoku&board=ATMuMDM0NjA4OTEyNjAyMTk1MzQ4MTk4MzAyNTY3ODU5NzYxNDIzMDI2ODAzNzkxNzEzOTI0ODU2OTAxNTM3MjA0Mjg3NDE5NjM1MzA1Mjg2MTcw"
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59/web/frontend
BASE=http://127.0.0.1:4247 npx playwright test --config .verb7/pw.config.mts fold-verb --repeat-each 5 > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/verb7/logs/fv-tree5b.log 2>&1; echo "GA1 tree x5 exit $?"
grep -E "passed|failed|flaky" /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/verb7/logs/fv-tree5b.log | tail -3
cd /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/verb7/inst
echo "== FLIP (computed colours post-paint; payload pinned)"
for arm in "hinge 4247" "sheet 4246" "snap 4243" "control 4248"; do set -- $arm
 for eng in chromium webkit; do
  echo -n "$1 "; node flip-probe.mjs "http://127.0.0.1:$2/$Q" $eng 1280x800 0 2
  echo -n "$1 "; node flip-probe.mjs "http://127.0.0.1:$2/$Q" $eng 390x844 1 2
  echo -n "$1 "; node flip-probe.mjs "http://127.0.0.1:$2/$Q" $eng 1280x800 0 2 1
 done
done
echo "== META"
for eng in chromium webkit; do for sc in light dark; do echo -n "meta-on "; node meta-probe.mjs "http://127.0.0.1:4245/$Q" $eng $sc; echo -n "default "; node meta-probe.mjs "http://127.0.0.1:4247/$Q" $eng $sc; done; done
echo "== PRM boot (payload pinned)"
for arm in "serial 4247" "control 4248"; do set -- $arm
 for eng in chromium webkit; do node boot-probe.mjs "http://127.0.0.1:$2/$Q" $eng 3 light reduce 2>&1 | sed "s/^/$1 /" | cut -c1-420; done
done
echo ALLDONE
