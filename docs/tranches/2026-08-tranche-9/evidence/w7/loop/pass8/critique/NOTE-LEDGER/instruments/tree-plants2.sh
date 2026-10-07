#!/bin/bash
# tree-plants2.sh: the chair's library's OWN reading of the tree (`shape-census --tree`, its "clean" row) under each source plant
SP=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/lcrit8
FE=$SP/tp/web/frontend; SFC=$FE/src/pencil/chrome/MarginNote.vue; O=$SP/t8/web/frontend/src/pencil/chrome/MarginNote.vue; LOG=$SP/logs/tree-plants2.txt
: > $LOG; cd $FE
for n in "C8-N3 seat through a guaranteed-invalid var (--seat: inherit)" "C8-N4 voice font by element: > p:first-child font-size 40px" "C8-N5 seat inside a dead @supports" "C8-N6 seat inside @container (min-width: 5000px)" "C8-N7 seat selector never matches: :not([role])"; do
  cp $O $SFC
  node $SP/bin/plant.mjs $O $SFC "$n" || { echo "[$n] ANCHOR/NAME absent in plant.mjs" >> $LOG; continue; }
  node scripts/shape-census.mjs --tree . > $SP/logs/tp2.out 2>&1; t=$?
  echo "[$n] exit $t · $(grep -m1 'anchor' $SP/logs/tp2.out | cut -c1-140) · CLEAN-ROW: $(grep -m1 'reserve · clean' $SP/logs/tp2.out | cut -c1-200) · load $(uptime | sed 's/.*averages: //')" >> $LOG
  (cd $FE && node scripts/check-ink-pressure.mjs > $SP/logs/tp2-ink.out 2>&1; echo "    lint:ink bare exit $? · $(grep -m2 -i 'R[1-4]\|fail' $SP/logs/tp2-ink.out | tr '\n' ' ' | cut -c1-200)" >> $LOG)
done
cp $O $SFC; node $SP/bin/plant19.mjs $O $SFC; node scripts/shape-census.mjs --tree . > $SP/logs/tp2.out 2>&1; t=$?; echo "[C8-N19 :has(.margin-note-ink) line-height 2.2] exit $t · CLEAN-ROW: $(grep -m1 "reserve · clean" $SP/logs/tp2.out | cut -c1-200)" >> $LOG; node scripts/check-ink-pressure.mjs > $SP/logs/tp2-ink.out 2>&1; echo "    lint:ink bare exit $?" >> $LOG
cp $O $SFC; echo "restored $(cmp -s $O $SFC && echo equal)" >> $LOG; echo DONE >> $LOG
