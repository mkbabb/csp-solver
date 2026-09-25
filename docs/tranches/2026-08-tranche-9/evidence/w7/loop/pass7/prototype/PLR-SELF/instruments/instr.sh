#!/bin/bash
# PLR-SELF pass 7: the chair's instruments (pass7/instruments, MANIFEST sha1s) against the tree (dev :4241) and the control (:4233).
I=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass7/instruments
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-SELF/web/frontend
echo "sha1 rest-probes $(shasum $I/rest-probes.mjs|cut -c1-12) edge-bands $(shasum $I/edge-bands.mjs|cut -c1-12) glyph-pop $(shasum $I/glyph-pop.mjs|cut -c1-12) paint-lib $(shasum $I/paint-lib.mjs|cut -c1-12) paint-probes $(shasum $I/paint-probes.mjs|cut -c1-12)"
echo "tree sha1 PlayerMark $(shasum src/pencil/chrome/PlayerMark/PlayerMark.vue|cut -c1-12) HeadSheet $(shasum src/pencil/chrome/AttributionCard/HeadSheet.vue|cut -c1-12)"
for e in chromium webkit; do
  node $I/rest-probes.mjs --engine $e --preset self-resize --url http://127.0.0.1:4241; echo "EXIT rest $e self-resize $?"
  node $I/rest-probes.mjs --engine $e --preset self-touch --url http://127.0.0.1:4241; echo "EXIT rest $e self-touch $?"
  node $I/rest-probes.mjs --engine $e --preset self-touch --plant relabel --url http://127.0.0.1:4241; echo "EXIT rest $e self-touch+relabel $?"
done
T='http://127.0.0.1:4241/?size=3&difficulty=EASY&wire=local'
C='http://127.0.0.1:4233/?size=3&difficulty=EASY'
for e in chromium webkit; do for sc in light dark; do
  node $I/paint-probes.mjs --probe edge --engine $e --scheme $sc --url "$T" --click '[data-player-mark]:visible' --subject '[data-lobby]:visible' --edge '[data-lobby]:visible .head-sheet-edge' --plants; echo "EXIT edge lobby tree $e $sc $?"
  node $I/paint-probes.mjs --probe edge --engine $e --scheme $sc --url "$T" --hover '.corner-left .attribution-trigger' --subject '.corner-left .hover-card' --edge '.corner-left .hover-card .head-sheet-edge' --plants; echo "EXIT edge card tree $e $sc $?"
  node $I/paint-probes.mjs --probe glyph --engine $e --scheme $sc --url "$T" --click '[data-player-mark]:visible' --subject '[data-lobby]:visible .pl-state' --plants --frac-bound auto; echo "EXIT glyph state tree $e $sc $?"
  node $I/paint-probes.mjs --probe glyph --engine $e --scheme $sc --url "$C" --hover '.corner-left .attribution-trigger' --subject '.corner-left .hover-card p.italic' --frac-bound auto; echo "EXIT glyph caption control $e $sc $?"
done; done
OUT=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself7b/radius-tree.json U=http://127.0.0.1:4241 node /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself7b/radius.mjs; echo "EXIT radius tree $?"
echo INSTR-DONE
