#!/bin/zsh
# G-LIVE-17 battery: the copied coarse-tape instrument at 9x9 and 16x16, both engines.
EV=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/prototype/MRK-LIVE
SC=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-35/web/frontend
for run in "16 4 chromium" "9 3 webkit" "16 4 webkit"; do
  set -- ${=run}
  label="p3-$1x$1-$3"
  echo "== $label =="
  node $EV/instruments/coarse-tape-delta.COPY.mjs http://127.0.0.1:4238/ $label $SC/frames $3 393 699 $2 \
    > $EV/logs/COARSE-$label.json 2>$SC/tape-$label.err
  echo "exit=$? $(head -c 120 $EV/logs/COARSE-$label.json)"
done
echo "BATTERY DONE"
