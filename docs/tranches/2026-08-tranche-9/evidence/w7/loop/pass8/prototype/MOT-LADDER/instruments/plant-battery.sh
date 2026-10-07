#!/bin/bash
# MOT-LADDER pass 8 · the plant battery through CI's exact invocations, one plant per fresh copy.
# No `set -e`, no rm: each plant restores the pristine copy by rsync before it is planted.
L=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ladder8
FE=$L/plant/repo/web/frontend
OUT=$L/plant-battery.tsv
printf "plant\tbands\tverbs\tmotion\ttokens\tpropblock\n" > $OUT
for p in NONE L7a L7b L7e L7f L7c L7d L4 L4p L1 L2 L3 L5 L6 M1 M2 M3 E1 F1 NN1; do
  rsync -a --delete --exclude node_modules $L/plant/pristine/ $FE/
  python3 $L/plant8.py $FE $p > $L/plant-$p.apply 2>&1
  ap=$?
  cd $FE
  npm run --silent lint:bands > $L/plant-$p.bands 2>&1; b=$?
  npm run --silent lint:verbs > $L/plant-$p.verbs 2>&1; v=$?
  npm run --silent lint:motion > $L/plant-$p.motion 2>&1; m=$?
  npm run --silent lint:theme-tokens > $L/plant-$p.tokens 2>&1; t=$?
  node $L/instruments/check-property-block.mjs --fe $FE > $L/plant-$p.prop 2>&1; pb=$?
  printf "%s\t%s\t%s\t%s\t%s\t%s\n" "$p$( [ $ap -ne 0 ] && echo '(APPLY-FAIL)')" $b $v $m $t $pb >> $OUT
done
rsync -a --delete --exclude node_modules $L/plant/pristine/ $FE/
echo DONE >> $OUT
