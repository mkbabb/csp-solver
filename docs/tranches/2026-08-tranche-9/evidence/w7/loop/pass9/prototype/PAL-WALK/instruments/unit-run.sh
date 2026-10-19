#!/bin/bash
# PAL-WALK pass-9 unit battery, chunked by directory; each chunk's exit read bare from its own file.
S=<lane-scratch>
cd <repo>/.claude/worktrees/wf_308fa864-c94-1/web/frontend
i=0
for d in src/games/shared src/pencil src/composables src/games/sudoku src/games/futoshiki src/games/killer src/games/kenken src/games/thermo "src/games/cards.test src/games/posters.test"; do
  i=$((i+1))
  echo "chunk $i $d start $(date +%T) $(sysctl -n vm.loadavg)" > $S/logs/unit-$i.load
  npx vitest run $d > $S/logs/unit-$i.log 2>&1
  echo "exit=$?" > $S/logs/unit-$i.exit
done
echo ALLDONE > $S/logs/unit.done
