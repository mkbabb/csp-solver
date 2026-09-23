#!/bin/bash
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-41/web/frontend
SP=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc5-p6
E=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass6/prototype/ACC-FIVE/instruments
V=$W/src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue
cd $W
shasum $V > $SP/hdg.sha; cp $V $SP/hdg.orig
trap 'cp $SP/hdg.orig $V; shasum -c $SP/hdg.sha' EXIT
node $E/p6-ring-samples.mjs http://127.0.0.1:4236 LANDED
sed -i '' 's/^const joinGate = frontGate((v) => (joinFraction.value = v));/const joinGate = frontGate((v) => (joinFraction.value = Math.min(v, 0.99)));/' $V
echo "ablation sites: $(grep -c 'Math.min(v, 0.99)' $V)"
sleep 3
node $E/p6-ring-samples.mjs http://127.0.0.1:4236 CAPPED-0.99
echo ALLDONE
