#!/bin/bash
cd /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/rep/web/frontend || exit 1
out=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/logs/filter.txt; : > $out
for sch in dark light; do for arm in tree:4238 control:4239; do n=${arm%%:*}; p=${arm#*:}; for e in chromium webkit; do
  CR_SCHEME=$sch PLAYWRIGHT_BASE_URL=http://127.0.0.1:$p CR_OUT=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/tr/filter-$n-$sch-$e npx playwright test --config .critpw6/pw-filter.mts --project $e > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/logs/filter-$n-$sch-$e.log 2>&1
  echo "$n $sch $e exit $? · $(grep -E '^ +[0-9]+ (passed|failed)' /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/logs/filter-$n-$sch-$e.log | tr -s ' ' | tr '\n' ' ')" >> $out
done; done; done
echo FILTER_DONE >> $out
