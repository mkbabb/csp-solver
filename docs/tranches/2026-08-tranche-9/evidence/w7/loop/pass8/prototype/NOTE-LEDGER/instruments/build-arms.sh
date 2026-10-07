#!/bin/bash
# build-arms.sh : the four T9-B-LEDGER arms of L8 (union + homes + ERASE8 + LEDGER8), one const flipped per arm, restored by sha1
P=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ledger8/p8
GB=$P/L8/web/frontend/src/games/shared/GameBoard.vue
O=$P/q/build-arms.txt; echo "start $(date +%T) load $(uptime | sed 's/.*averages: //')" > $O
cp $GB $P/q/L8.GameBoard.orig; S0=$(shasum $GB | cut -c1-12)
for arm in ${ARMS:-hold age step tint}; do
  sed -i '' "s/^const LEDGER_FULFILLED = \"hold\" as/const LEDGER_FULFILLED = \"$arm\" as/" $GB
  echo "$arm const lines $(grep -c "^const LEDGER_FULFILLED = \"$arm\" as" $GB)" >> $O
  bash $P/bin/build.sh $P/L8 $P/dists/u-$arm u-$arm >> $O 2>&1
  cp $P/q/L8.GameBoard.orig $GB
done
echo "restored $(shasum $GB | cut -c1-12) = $S0" >> $O
echo "DONE $(date +%T) load $(uptime | sed 's/.*averages: //')" >> $O
