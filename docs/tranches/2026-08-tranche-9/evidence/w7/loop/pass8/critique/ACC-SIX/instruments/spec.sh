#!/bin/bash
# spec.sh <label> <spec> [engines]
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc6-crit8
cd $S/base/web/frontend
for eng in ${3:-chromium webkit}; do
  ld=$(uptime | sed 's/.*averages: //' | cut -d' ' -f1)
  env $EXTRA BASE=http://127.0.0.1:4237 CONTROL=http://127.0.0.1:4250 PWOUT=$S/pw-$1-$eng npx playwright test -c .acc6crit/pw.config.ts e2e/$2 --project=$eng > $S/logs/$1-$eng.log 2>&1
  rc=$?
  echo "$1 $eng exit $rc · load $ld · served $(curl -s http://127.0.0.1:4237/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1)"
done
