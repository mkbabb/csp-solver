#!/bin/bash
# unit.sh <plant>... : bootHand.test.ts under each one-edit plant in ubank; exit per plant in logs/unit.tsv
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/crit-MOT-VERB
U=$S/ubank/web/frontend; B=$S/bank/web/frontend
[ -e $S/ubank ] || cp -R $S/bank $S/ubank
for p in "$@"; do
  cp $B/src/pencil/composables/bootHand.ts $U/src/pencil/composables/bootHand.ts
  cp $B/src/pencil/config/pencilConfig.ts $U/src/pencil/config/pencilConfig.ts
  python3 $S/bin/plant.py $U $p > $S/logs/unit-$p.log 2>&1
  (cd $U && npx vitest run src/pencil/composables/bootHand.test.ts >> $S/logs/unit-$p.log 2>&1; echo "$p $? $(grep -cE '^ +(×|✗|FAIL)' $S/logs/unit-$p.log) $(uptime | sed 's/.*averages: //')" >> $S/logs/unit.tsv)
done
cp $B/src/pencil/composables/bootHand.ts $U/src/pencil/composables/bootHand.ts; cp $B/src/pencil/config/pencilConfig.ts $U/src/pencil/config/pencilConfig.ts
echo UNITDONE >> $S/logs/unit.tsv
