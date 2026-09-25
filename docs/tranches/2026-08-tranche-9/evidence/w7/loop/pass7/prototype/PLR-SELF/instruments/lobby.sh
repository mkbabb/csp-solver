#!/bin/bash
# the lobby's four bands and the state line's glyph population (the chair's probes take a CSS selector, never :visible)
I=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass7/instruments
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-SELF/web/frontend
echo "tree sha1 PlayerMark $(shasum src/pencil/chrome/PlayerMark/PlayerMark.vue|cut -c1-12) HeadSheet $(shasum src/pencil/chrome/AttributionCard/HeadSheet.vue|cut -c1-12)"
T='http://127.0.0.1:4241/?size=3&difficulty=EASY&wire=local'
for e in chromium webkit; do for sc in light dark; do
  node $I/paint-probes.mjs --probe edge --engine $e --scheme $sc --url "$T" --click '.corner-left [data-player-mark]' --subject '.corner-left [data-lobby]' --edge '.corner-left [data-lobby] .head-sheet-edge' --plants; echo "EXIT edge lobby tree $e $sc $?"
  node $I/paint-probes.mjs --probe glyph --engine $e --scheme $sc --url "$T" --click '.corner-left [data-player-mark]' --subject '.corner-left [data-lobby] .pl-state' --plants --frac-bound auto; echo "EXIT glyph state tree $e $sc $?"
done; done
echo LOBBY-DONE
