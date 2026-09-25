#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself-crit7; F=$S/tree/web/frontend; cd $F
PM=src/pencil/chrome/PlayerMark/PlayerMark.vue; HS=src/pencil/chrome/AttributionCard/HeadSheet.vue
restore() { cp $S/hold.PlayerMark.vue $PM; cp $S/hold.HeadSheet.vue $HS; echo "RESTORED $(sha1sum < $PM | cut -c1-12) $(sha1sum < $HS | cut -c1-12)"; sleep 3; }
echo "load $(uptime | sed 's/.*averages: //')"
for p in PTE PRS; do
  python3 $S/plant.py $F $p; sleep 4
  npx playwright test --config .crit7/pw-landed.mts -g "an open sheet reads the space again"; echo "EXIT plant-$p $?"
  node /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass7/instruments/rest-probes.mjs --engine webkit --preset self-resize --url http://127.0.0.1:4231 | grep -v LOAD; echo "EXIT rest-webkit-$p $?"
  restore
done
echo PLANTS2-DONE
