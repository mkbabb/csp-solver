#!/bin/bash
SP=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/lcrit8
FE=$SP/tp/web/frontend; SFC=$FE/src/pencil/chrome/MarginNote.vue; O=$SP/t8/web/frontend/src/pencil/chrome/MarginNote.vue; LOG=$SP/logs/tree-plants.txt
: > $LOG; cd $FE
node scripts/shape-census.mjs --tree . > $SP/logs/tp-clean.out 2>&1; echo "[clean] shape-census --tree exit $? · $(tail -1 $SP/logs/tp-clean.out | cut -c1-160)" >> $LOG
for n in "C8-N3 seat through a guaranteed-invalid var (--seat: inherit)" "C8-N5 seat inside a dead @supports" "C8-N7 seat selector never matches: :not([role])" "C8-N4 voice font by element: > p:first-child font-size 40px"; do
  node $SP/bin/plant.mjs $O $SFC "$n" || { echo "[$n] ANCHOR" >> $LOG; continue; }
  node scripts/shape-census.mjs --tree . > $SP/logs/tp.out 2>&1; t=$?
  echo "[$n] shape-census --tree exit $t · $(grep -i -m2 'FAIL\|✗' $SP/logs/tp.out | tr '\n' ' ' | cut -c1-240) · load $(uptime | sed 's/.*averages: //')" >> $LOG
done
cp $O $SFC; echo "restored $(cmp -s $O $SFC && echo equal)" >> $LOG; echo DONE >> $LOG
