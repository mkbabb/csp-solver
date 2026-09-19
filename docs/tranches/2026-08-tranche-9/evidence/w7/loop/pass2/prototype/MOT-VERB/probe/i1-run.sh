#!/bin/zsh
# I1 (the gallery exit's board fold must play), r0's instrument run from a COPY, against both
# dists: the prototype (which carries W8 C06 as its one commit) and the control (HEAD + C06).
# The instrument banks nothing to disk — it prints — so no OUT needed re-pointing.
SC=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
E=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/prototype/MOT-VERB
WT=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-64

node $SC/serve.mjs $WT/web/frontend/dist 4247 &
SRV_A=$!
node $SC/serve.mjs $SC/control/web/frontend/dist 4248 &
SRV_B=$!
sleep 2

for tree in prototype control; do
  if [[ $tree == prototype ]]; then PORT=4247; else PORT=4248; fi
  for eng in chromium webkit; do
    for size in "390 844" "1280 800"; do
      set -- ${=size}
      print "---- $tree $eng $1x$2"
      BASE=http://127.0.0.1:$PORT/ ENGINE=$eng VW=$1 VH=$2 node $E/instruments/i1-exit-fold-plays.COPY.mjs 2>&1 | tail -6
    done
  done
done

kill $SRV_A $SRV_B 2>/dev/null
print "servers killed"
