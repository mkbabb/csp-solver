#!/bin/bash
# r5unit.sh <label> <frontend dir>: the unit battery chunked by directory, each chunk its own guarded call, --maxWorkers=2, exits bare
S=$LANE; L=$S/logs/r5
lab=$1; cd $2 || exit 9
for c in src/composables src/games/futoshiki src/games/kenken src/games/killer src/games/sudoku src/games/thermo src/games/cards.test.ts src/games/posters.test.ts src/games/shared src/pencil; do
  k=$(echo $c | tr '/.' '__')
  while [ "$(sysctl -n vm.loadavg | awk '{print int($2)}')" -gt 120 ]; do sleep 60; done
  echo "$k open $(date +%T) $(sysctl -n vm.loadavg)" >> $L/unit-$lab.load
  $GUARDED --timeout 20 -- npx vitest run --maxWorkers=2 $c > $L/unit-$lab-$k.log 2>&1; echo "exit=$?" > $L/unit-$lab-$k.exit
done
echo done > $L/unit-$lab.done
