#!/bin/bash
C=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc5crit6
until grep -q G10-DONE $C/logs/g10-battery.log; do sleep 5; done
cd $C
for i in 1 2; do
  CLOCK=driven BASE=http://127.0.0.1:4241 npx playwright test -c $C/pw.config.ts front-rate.spec.ts --project=webkit > $C/logs/g10-gated-driven-webkit-re$i.log 2>&1
  echo "gated-driven webkit re$i exit $? :: $(grep -o 'G10 [a-z]* .*' $C/logs/g10-gated-driven-webkit-re$i.log | sed 's/^G10 [a-z]* //' | tr '\n' '|' | cut -c1-500) :: $(grep -m1 -o 'Error: .*' $C/logs/g10-gated-driven-webkit-re$i.log | cut -c1-150)"
done
for eng in chromium webkit; do
  BASE=http://127.0.0.1:4248 npx playwright test -c $C/pw.config.ts progress-corridor.spec.ts --project=$eng > $C/logs/corridor-$eng.log 2>&1
  echo "corridor $eng exit $? :: $(grep -E 'passed|failed' $C/logs/corridor-$eng.log | tr '\n' ' ')"
done
echo RUN2-DONE
