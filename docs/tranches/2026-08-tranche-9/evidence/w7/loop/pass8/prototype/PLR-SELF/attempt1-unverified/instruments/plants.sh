#!/bin/bash
# PLR-SELF pass 8 · born-RED battery: plant → the row in both engines → restore (sha1 verified).
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself8
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-SELF/web/frontend
cd $W
echo "SHA1 start PlayerMark $(shasum src/pencil/chrome/PlayerMark/PlayerMark.vue | cut -c1-12) HeadSheet $(shasum src/pencil/chrome/AttributionCard/HeadSheet.vue | cut -c1-12) spec $(shasum e2e/player-mark.spec.ts | cut -c1-12)"
for row in "K1|flips where" "K2|flips where" "K3|flips where" "N0|four rows over four" "D1|no press after" "E1|in both themes" "R1|18px root"; do
  p=${row%%|*}; g=${row#*|}
  python3 $S/plant.py $p apply
  sleep 4
  for e in chromium webkit; do
    npx playwright test --config $S/probe/pw-spec.mts --project $e -g "$g" > $S/logs/plant-$p-$e.log 2>&1
    x=$?
    why=$(grep -m2 -E "^\s+Error: " $S/logs/plant-$p-$e.log | sed 's/^ *//' | cut -c1-230 | tr '\n' ' ')
    echo "PLANT $p [$g] $e exit $x :: $why :: load $(sysctl -n vm.loadavg)"
  done
  python3 $S/plant.py $p restore
  sleep 3
done
echo "SHA1 end PlayerMark $(shasum src/pencil/chrome/PlayerMark/PlayerMark.vue | cut -c1-12) HeadSheet $(shasum src/pencil/chrome/AttributionCard/HeadSheet.vue | cut -c1-12) spec $(shasum e2e/player-mark.spec.ts | cut -c1-12)"
echo PLANTS-DONE
