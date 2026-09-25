#!/bin/bash
SP=$1; FE=$SP/ledgercrit7-rep/web/frontend; SFC=$FE/src/pencil/chrome/MarginNote.vue; O=$SP/ledgercrit7-bin/MarginNote.orig.vue; L=$SP/ledgercrit7-logs/reserve-plants.txt
cd $FE
node $SP/ledgercrit7-bin/plant.mjs $O /dev/null --list > $SP/ledgercrit7-bin/names.txt 2>/dev/null || node -e "" 
while IFS= read -r n; do
  node $SP/ledgercrit7-bin/plant.mjs $O $SFC "$n"; a=$?
  if [ $a -ne 0 ]; then echo "[$n] anchor exit $a" >> $L; continue; fi
  node scripts/check-ink-pressure.mjs --self-test > $SP/ledgercrit7-logs/ink-plant.out 2>&1; e=$?
  node scripts/shape/reserve-law.mjs . > $SP/ledgercrit7-logs/rl-plant.out 2>&1; r=$?
  echo "[$n] lint:ink(--self-test) exit $e · reserve-law exit $r · $(head -3 $SP/ledgercrit7-logs/rl-plant.out | tr '\n' ' ' | cut -c1-260)" >> $L
done < $SP/ledgercrit7-bin/names.txt
cp $O $SFC
echo "sha1 after $(shasum $SFC | cut -c1-12)" >> $L
