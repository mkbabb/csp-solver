#!/bin/bash
C=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc5crit6
until grep -q RUN2-DONE $C/logs/run2.log; do sleep 5; done
cd $C
node /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass6/critique/ACC-FIVE/instruments/g5-deeper-arms.CRITIC.mjs http://127.0.0.1:4248 http://127.0.0.1:4242 $C/g5-critic.json > $C/logs/g5-critic.log 2>&1
echo "g5 exit $?"
for arm in tree:4248 control:4242; do n=${arm%%:*}; p=${arm##*:}
  for s in light dark; do
    SCHEME=$s BASE=http://127.0.0.1:$p npx playwright test -c $C/pw.config.ts filter-census.spec.ts > $C/logs/fc-$n-$s.log 2>&1
    echo "filter-census $n $s exit $? :: $(grep -E '[0-9]+ (passed|failed)' $C/logs/fc-$n-$s.log | tr '\n' ' ') :: $(grep -o '[a-z-]*\.idle ⟨[^⟩]*⟩' $C/logs/fc-$n-$s.log | sort | uniq -c | tr '\n' ' ')"
  done
done
echo RUN3-DONE
