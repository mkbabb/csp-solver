#!/bin/bash
# the reserve law's BEHAVIOURAL half, paired with the source gate, per plant (critic, pass 7). Plants written to the SCRATCH replica only.
SP=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
C=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass7/critique/NOTE-LEDGER
FE=$SP/ledgercrit7-rep/web/frontend; SFC=$FE/src/pencil/chrome/MarginNote.vue; O=$SP/ledgercrit7-bin/MarginNote.orig.vue
echo "sha1-at-start $(shasum $SFC | cut -c1-12)"
for eng in chromium webkit; do node $C/instruments/critic7.mjs $eng control http://127.0.0.1:4231 index-CubiZsMVSwTc.js reserve 2>&1 | grep -E 'ROW|Error'; done
for n in "clean" "M1 E3 inside the <1024 block (block min-height 1px there)" "M3 seat moved to the landscape block only" "M6 the voice by another name: .margin-note-block > p:first-child { min-height: 0 }" "M4 block font-size 1px under <1024 (1.3em -> 1.3px)"; do
  node $SP/ledgercrit7-bin/plant.mjs $O $SFC "$n"; sleep 4
  (cd $FE && node scripts/check-ink-pressure.mjs --self-test > $SP/ledgercrit7-logs/ink-p.out 2>&1); e=$?
  echo "PLANT [$n] sha1 $(shasum $SFC | cut -c1-12) · lint:ink --self-test exit $e · load $(sysctl -n vm.loadavg)"
  for eng in chromium webkit; do node $C/instruments/critic7.mjs $eng "tree:$n" http://127.0.0.1:4234 dev reserve 2>&1 | grep -E 'ROW|Error'; done
done
cp $O $SFC; echo "sha1-at-end $(shasum $SFC | cut -c1-12)"
echo RESERVE-DONE
