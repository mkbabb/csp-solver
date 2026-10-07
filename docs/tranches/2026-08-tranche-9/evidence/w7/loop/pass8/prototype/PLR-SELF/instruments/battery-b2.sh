#!/bin/bash
# PLR-SELF pass 8 (resumed) · the spec whole (both engines, dev :4241, 1 worker), then the born-RED battery
# (plant -> the row in both engines -> restore, sha1 verified). Plants wait for battery-a to end.
R=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself8r
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-SELF/web/frontend
cd $W
sha() { echo "PlayerMark $(shasum src/pencil/chrome/PlayerMark/PlayerMark.vue | cut -c1-12) HeadSheet $(shasum src/pencil/chrome/AttributionCard/HeadSheet.vue | cut -c1-12) spec $(shasum e2e/player-mark.spec.ts | cut -c1-12)"; }
echo "SHA1 start $(sha) LOAD $(sysctl -n vm.loadavg)"
echo "RESUMED plants begin LOAD $(sysctl -n vm.loadavg)"
for row in "N0|four rows over four" "D1|no press after" "D2|labelled as a mouse" "E1|in both themes" "R1|18px root"; do
  p=${row%%|*}; g=${row#*|}
  python3 $R/plant.py $p apply
  sleep 4
  for e in chromium webkit; do
    npx playwright test --config $R/probe/pw-spec.mts --project $e -g "$g" > $R/logs/plant-$p-$e.log 2>&1
    x=$?
    why=$(grep -m2 -E "^\s+Error: " $R/logs/plant-$p-$e.log | sed 's/^ *//' | cut -c1-230 | tr '\n' ' ')
    echo "PLANT $p [$g] $e exit $x :: $why :: load $(sysctl -n vm.loadavg)"
  done
  python3 $R/plant.py $p restore
  sleep 3
done
echo "SHA1 end $(sha) LOAD $(sysctl -n vm.loadavg)"
echo BATTERY-B2-DONE
