#!/bin/bash
# T9-B30's cost on the chair's four-band probe: FULL (the tree) and QUIET (EDGE_QUIET flipped, hot-swapped, restored by sha1).
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself7b; I=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass7/instruments
FE=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-SELF/web/frontend; HS=$FE/src/pencil/chrome/AttributionCard/HeadSheet.vue
cd $FE
T='http://127.0.0.1:4241/?size=3&difficulty=EASY&wire=local'
before=$(shasum $HS|cut -c1-40); cp $HS $S/hold.ARM-quiet; python3 $S/plant.py ARM-quiet; sleep 3
for e in chromium webkit; do for sc in light dark; do
  node $I/paint-probes.mjs --probe edge --engine $e --scheme $sc --url "$T" --hover '.corner-left .attribution-trigger' --subject '.corner-left .hover-card' --edge '.corner-left .hover-card .head-sheet-edge'; echo "EXIT quiet card $e $sc $?"
  node $I/paint-probes.mjs --probe edge --engine $e --scheme $sc --url "$T" --click '.corner-left [data-player-mark]' --subject '.corner-left [data-lobby]' --edge '.corner-left [data-lobby] .head-sheet-edge'; echo "EXIT quiet lobby $e $sc $?"
done; done
cp $S/hold.ARM-quiet $HS; sleep 2; after=$(shasum $HS|cut -c1-40); echo "HeadSheet restored $([ "$before" = "$after" ] && echo OK || echo MISMATCH)"
echo QUIET-DONE
