#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself-crit7; F=$S/tree/web/frontend; cd $F
PM=src/pencil/chrome/PlayerMark/PlayerMark.vue; HS=src/pencil/chrome/AttributionCard/HeadSheet.vue
restore() { cp $S/hold.PlayerMark.vue $PM; cp $S/hold.HeadSheet.vue $HS; echo "RESTORED $(sha1sum < $PM | cut -c1-12) $(sha1sum < $HS | cut -c1-12)"; sleep 3; }
echo "load $(uptime | sed 's/.*averages: //')"
echo "== CLEAN whole file"; npx playwright test --config .crit7/pw-landed.mts; echo "EXIT clean-whole $?"
echo "load $(uptime | sed 's/.*averages: //')"
for p in X6 DARK P1; do
  python3 $S/plant.py $F $p; sleep 4
  case $p in X6|DARK) G='paint a drawn edge on all four sides';; P1) G='a portrait phone compresses';; esac
  npx playwright test --config .crit7/pw-landed.mts -g "$G"; echo "EXIT plant-$p $?"
  restore
done
echo "load $(uptime | sed 's/.*averages: //')"
echo PLANTS-DONE
