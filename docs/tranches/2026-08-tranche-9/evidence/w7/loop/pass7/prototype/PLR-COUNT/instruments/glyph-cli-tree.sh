#!/bin/bash
# PLR-COUNT pass 7: the chair's glyph probe on the tree's solo sheet lines (plain CSS subjects: the probe's OFF style and TAIL Range need CSS, not a locator).
I=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass7/instruments
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52/web/frontend
echo "sha1 glyph-pop $(shasum $I/glyph-pop.mjs|cut -c1-12) paint-lib $(shasum $I/paint-lib.mjs|cut -c1-12) paint-probes $(shasum $I/paint-probes.mjs|cut -c1-12)"
T='http://127.0.0.1:4242/?size=3&difficulty=EASY&wire=local'
for e in chromium webkit; do for sc in light dark; do for d in 1 2; do for q in pl-state pl-qual; do
  node $I/paint-probes.mjs --probe glyph --engine $e --scheme $sc --dpr $d --viewport 1280x720 --url "$T" --click '[data-player-mark]:visible' --subject ".corner-left [data-lobby] .$q" --plants --frac-bound auto; echo "EXIT glyph $q tree $e $sc dpr$d $?"
done; done; done; done
echo "LOAD $(uptime)"
echo GLYPH-CLI-TREE-DONE
