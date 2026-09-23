#!/bin/bash
# ACC-FIVE pass 6 · row 6: join-language.spec.ts whole, landed and with the ring capped at 0.99
# (the ring never stands whole), both engines, same batch. Restore by shasum.
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-41/web/frontend
SP=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc5-p6
V=$W/src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue
cd $W
shasum $V > $SP/hdg.sha; cp $V $SP/hdg.orig
trap 'cp $SP/hdg.orig $V; shasum -c $SP/hdg.sha' EXIT
for eng in chromium webkit; do
  BASE=http://127.0.0.1:4236 npx playwright test -c .acc-five/pw.config.ts join-language.spec.ts -g "rings the board|baked geometry" --project=$eng > $SP/logs/join-landed-$eng.log 2>&1
  echo "LANDED $eng exit $? :: $(grep -E '^\s+[0-9]+ (passed|failed)' $SP/logs/join-landed-$eng.log | tr -s ' ' | tr '\n' ' ')"
done
sed -i '' 's/^const joinGate = frontGate((v) => (joinFraction.value = v));/const joinGate = frontGate((v) => (joinFraction.value = Math.min(v, 0.99)));/' $V
echo "ablation sites: $(grep -c 'Math.min(v, 0.99)' $V)"
sleep 3
for eng in chromium webkit; do
  BASE=http://127.0.0.1:4236 npx playwright test -c .acc-five/pw.config.ts join-language.spec.ts -g "rings the board|baked geometry" --project=$eng > $SP/logs/join-capped-$eng.log 2>&1
  echo "CAPPED-0.99 $eng exit $? :: $(grep -E '^\s+[0-9]+ (passed|failed)' $SP/logs/join-capped-$eng.log | tr -s ' ' | tr '\n' ' ') :: $(grep -m2 -E 'Error:|Expected|Received' $SP/logs/join-capped-$eng.log | tr -s ' ' | tr '\n' ' ' | cut -c1-200)"
done
echo ALLDONE
