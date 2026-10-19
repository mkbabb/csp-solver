#!/bin/bash
# PAL-TIN pass 9 · the unit battery chunked by directory; each chunk's exit to its own file. No rm, no set -e.
S=$SCRATCH
cd $WORKTREES/wf_308fa864-c94-2/web/frontend || exit 9
O=$S/logs/units; mkdir -p $O
echo "start $(date +%T) load $(uptime | sed 's/.*averages*: //')" > $O/HEAD.txt
for d in src/games/shared src/games/futoshiki src/games/killer src/games/kenken src/games/thermo src/games/sudoku src/pencil src/composables src/lib; do
  n=$(echo $d | tr '/' '_'); t0=$(date +%s)
  npx vitest run --config $SCRATCH/cfg/vitest.mts $d > $O/$n.txt 2>&1; echo $? > $O/$n.exit
  echo "$d exit $(cat $O/$n.exit) · $(grep -E 'Tests +[0-9]' $O/$n.txt | tail -1 | sed 's/\x1b\[[0-9;]*m//g') · $(( $(date +%s) - t0 )) s · load $(uptime | sed 's/.*averages*: //')" >> $O/HEAD.txt
done
npx vitest run --config $SCRATCH/cfg/vitest.mts src/games/posters.test.ts src/games/cards.test.ts > $O/games_root.txt 2>&1; echo $? > $O/games_root.exit
echo "src/games (root files) exit $(cat $O/games_root.exit) · $(grep -E 'Tests +[0-9]' $O/games_root.txt | tail -1 | sed 's/\x1b\[[0-9;]*m//g')" >> $O/HEAD.txt
echo "end $(date +%T)" >> $O/HEAD.txt; echo done > $O/DONE
