#!/bin/bash
# ACC-SIX pass-7 CRITIC: G10 (e2e/front-rate.spec.ts, landed, unmodified) on the critic's BUILT dist of the tree (:4232, index-Dx4v3BgsblSf.js), CLOCK=driven,
# N runs per engine, bare exits, load + sibling count per run; CLOCK=60 once per engine (the precondition's negative).
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-45/web/frontend; O=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc6crit7-g10; mkdir -p $O; cd $W
for i in $(seq 1 ${N:-3}); do for eng in chromium webkit; do ld=$(uptime | sed 's/.*averages: //' | cut -d' ' -f1); sib=$(ps aux | grep -c "[p]laywright\|[v]itest")
  CLOCK=driven BASE=http://127.0.0.1:4232 PWOUT=$O/pw-g$i-$eng npx playwright test -c .acc6crit7/pw2.config.ts e2e/front-rate.spec.ts --project=$eng > $O/g$i-$eng.log 2>&1; rc=$?
  echo "gated$i $eng exit $rc · load $ld · sib $sib :: $(grep -o 'G10 [a-z]* .*' $O/g$i-$eng.log | sed 's/^G10 //' | tr '\n' '|') :: $(grep -m1 'clock ' $O/g$i-$eng.log | grep -o 'measured [0-9.]* Hz') :: $(grep -m1 'Error: ' $O/g$i-$eng.log | sed 's/^ *//' | cut -c1-140)"; done; done
for eng in chromium webkit; do CLOCK=60 BASE=http://127.0.0.1:4232 PWOUT=$O/pw-c60-$eng npx playwright test -c .acc6crit7/pw2.config.ts e2e/front-rate.spec.ts --project=$eng > $O/c60-$eng.log 2>&1; echo "clock60 $eng exit $? :: $(grep -m1 'Error: ' $O/c60-$eng.log | sed 's/^ *//' | cut -c1-120)"; done
echo ALLDONE
