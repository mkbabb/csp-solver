#!/bin/bash
# vitest.sh <label> <fe> : the unit battery chunked by directory, exits written here
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/NOTE-LEDGER
LB=$1; FE=$2; LOG=$S/logs/vitest-$LB.txt; : > $LOG; cd $FE
for d in $(ls -d src/*/ | sed 's|/$||'); do
  n=$(find $d -name "*.test.ts" | wc -l | tr -d ' '); [ "$n" = 0 ] && continue
  npx vitest run $d > $S/logs/vt-$LB-$(basename $d).txt 2>&1; e=$?
  echo "$d exit $e · $(grep -E '^ +Tests ' $S/logs/vt-$LB-$(basename $d).txt | tr -s ' ') · $(grep -E '^ +Test Files ' $S/logs/vt-$LB-$(basename $d).txt | tr -s ' ') · load $(uptime | sed 's/.*averages: //')" >> $LOG
done; echo DONE >> $LOG
