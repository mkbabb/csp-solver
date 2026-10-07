#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself8
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-SELF/web/frontend
cd $W
sha() { echo "PlayerMark $(shasum src/pencil/chrome/PlayerMark/PlayerMark.vue | cut -c1-12) HeadSheet $(shasum src/pencil/chrome/AttributionCard/HeadSheet.vue | cut -c1-12) spec $(shasum e2e/player-mark.spec.ts | cut -c1-12)"; }
echo "SHA1 start $(sha) LOAD $(sysctl -n vm.loadavg)"
python3 $S/plant.py E1 apply; sleep 4
npx playwright test --config $S/probe/pw-spec.mts --project webkit -g "in both themes" > $S/logs/plant-E1-webkit-rerun.log 2>&1; x=$?
echo "PLANT E1 rerun webkit exit $x :: $(grep -m1 -E '^\s+Error: ' $S/logs/plant-E1-webkit-rerun.log | sed 's/^ *//' | cut -c1-260) :: LOAD $(sysctl -n vm.loadavg)"
python3 $S/plant.py E1 restore; sleep 4
echo "SHA1 after-plant $(sha)"
for e in chromium webkit; do
  npx playwright test --config $S/probe/pw-spec.mts --project $e > $S/logs/spec-final-$e.log 2>&1; x=$?
  echo "SPEC player-mark.spec.ts $e exit $x :: $(grep -E '^\s+[0-9]+ (passed|failed|flaky|skipped)' $S/logs/spec-final-$e.log | tr -s ' ' | tr '\n' ' ') :: LOAD $(sysctl -n vm.loadavg)"
done
echo "SHA1 after-spec $(sha)"
for d in src/composables src/games/futoshiki src/games/kenken src/games/killer src/games/sudoku src/games/thermo src/games/shared src/pencil src/components src/lib; do
  [ -d $d ] || { echo "VT $d absent"; continue; }
  npx vitest run $d > $S/logs/vt-$(echo $d | tr / _).log 2>&1; ec=$?
  echo "VT $d exit $ec :: $(grep -E 'Test Files|Tests ' $S/logs/vt-$(echo $d | tr / _).log | tr -s ' ' | tr '\n' ' ')"
done
echo "SHA1 end $(sha) LOAD $(sysctl -n vm.loadavg)"
echo FINAL-DONE
