#!/bin/bash
C=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc5crit6
until grep -q RUN3-DONE $C/logs/run3.log 2>/dev/null; do sleep 5; done
cd $C
for i in 1 2 3 4; do for eng in webkit chromium; do
  CLOCK=driven BASE=http://127.0.0.1:4241 npx playwright test -c $C/pw-crit.config.ts front-rate-gaps.CRITIC.spec.ts --project=$eng > $C/logs/gaps-$eng-$i.log 2>&1
  rc=$?
  echo "gaps $eng #$i exit $rc :: $(grep -o 'G10 [a-z]* [a-z]*: .*worst [0-9.]*/s' $C/logs/gaps-$eng-$i.log | sed 's/^G10 [a-z]* //; s/ d records.*worst/ worst/' | tr '\n' ' ') :: $(grep -o 'GAPS .*' $C/logs/gaps-$eng-$i.log | grep -v 'short(<15.5) \[\]' | sed 's/^GAPS [a-z]* //' | tr '\n' '|' | cut -c1-600) :: $(grep -m1 -o 'Error: .*' $C/logs/gaps-$eng-$i.log | cut -c1-120)"
done; done
echo RUN4-DONE
