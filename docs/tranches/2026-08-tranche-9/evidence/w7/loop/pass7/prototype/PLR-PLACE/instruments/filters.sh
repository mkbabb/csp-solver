#!/bin/bash
N=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrplace7c-work
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-PLACE/web/frontend
O=$N/filters.txt
export PLC_OUTDIR=$N/pw-out-filters
for port in 4246 4247; do echo "load $(uptime | sed 's/.*averages: //')" >> $O; PLC_PORT=$port npx playwright test -c .plr-place/pwc.config.ts e2e/filter-census.spec.ts > $N/filter-$port.log 2>&1; echo "filter-census.spec.ts on :$port ($(curl -s http://127.0.0.1:$port/ | grep -o 'index-[A-Za-z0-9_-]*\.js')) exit=$? $(grep -E '^\s+[0-9]+ (passed|failed|skipped)' $N/filter-$port.log | tr -s ' ' | tr '\n' ' ')" >> $O; done
OUT=$N/filters-estate.jsonl npx playwright test -c .plr-place/pwc.config.ts .plr-place/p7c-filters.spec.ts --repeat-each 5 > $N/filters-estate.log 2>&1; echo "estate filters x5 exit=$?" >> $O
echo DONE >> $O
