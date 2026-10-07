#!/bin/bash
# The pass-7 gate (e7cc2ae8's check-motion-bands + bank + library) on the same plants: the born-RED.
L=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ladder8
FE=$L/plant7/repo/web/frontend
OUT=$L/bornred7.tsv
printf "plant\tp7-bands\n" > $OUT
for p in NONE L7a L7f L7c L7d L4 L4p L1 L2 L3 L5 L6 M1 M2 M3 E1 F1; do
  rsync -a --delete --exclude node_modules $L/plant7/pristine/ $FE/
  python3 $L/plant8.py $FE $p > /dev/null 2>&1
  cd $FE
  npm run --silent lint:bands > $L/p7-$p.bands 2>&1
  printf "%s\t%s\n" $p $? >> $OUT
done
rsync -a --delete --exclude node_modules $L/plant7/pristine/ $FE/
echo DONE >> $OUT
