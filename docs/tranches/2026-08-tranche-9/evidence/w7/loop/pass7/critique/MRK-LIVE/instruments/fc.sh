#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/mrklivecrit7
cd $S/copy/web/frontend
for arm in "4236 lane" "4239 control"; do set -- $arm
 for th in light dark; do
  cfg=.crit/pw.fc.config.ts
  echo "=== filter-census $2 $th :$1 served $(curl -s http://127.0.0.1:$1/ | grep -o 'index-[A-Za-z0-9_-]*\.js') load $(sysctl -n vm.loadavg)"
  SCHEME=$th PWOUT=fc-$2-$th PLAYWRIGHT_BASE_URL=http://127.0.0.1:$1 npx playwright test --config $cfg filter-census.spec.ts --reporter=list > $S/logs/fc-$2-$th.log 2>&1; echo "EXIT $?"
  grep -E ' passed| failed' $S/logs/fc-$2-$th.log; grep -oE 'crayon-heart[^"]{0,40}' $S/logs/fc-$2-$th.log | sort | uniq -c | head -3
 done
done
echo ALLDONE
