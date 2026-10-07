#!/bin/bash
# run-plants.sh : each plant written to the tp copy's MarginNote.vue, the bare gate (no --self-test) read, restored by copy
SP=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/lcrit8
FE=$SP/tp/web/frontend; SFC=$FE/src/pencil/chrome/MarginNote.vue; O=$SP/t8/web/frontend/src/pencil/chrome/MarginNote.vue; LOG=$SP/logs/plants-src.txt
: > $LOG; echo "orig sha1 $(shasum $O | cut -c1-12) load $(uptime | sed 's/.*averages: //')" >> $LOG
cd $FE
node $SP/bin/plant.mjs $O /dev/null --list | while IFS= read -r n; do
  node $SP/bin/plant.mjs $O $SFC "$n"; a=$?
  if [ $a -ne 0 ]; then echo "[$n] ANCHOR exit $a" >> $LOG; continue; fi
  node scripts/check-ink-pressure.mjs > $SP/logs/plant.out 2>&1; e=$?
  t=skipped
  echo "[$n] lint:ink(bare) exit $e · shape-census --tree exit $t · $(grep -m2 'note reserve' $SP/logs/plant.out | tr '\n' ' ' | cut -c1-300)" >> $LOG
done
cp $O $SFC
echo "restored sha1 $(shasum $SFC | cut -c1-12) load $(uptime | sed 's/.*averages: //')" >> $LOG
echo DONE >> $LOG
