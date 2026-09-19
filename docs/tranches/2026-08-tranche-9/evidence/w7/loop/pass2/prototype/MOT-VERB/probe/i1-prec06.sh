#!/bin/zsh
# I1 against the PRE-C06 build (aab67b92, no cure): the RED this family cites.
SC=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
E=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/prototype/MOT-VERB
node $SC/serve.mjs $SC/prec06/web/frontend/dist 4249 &
SRV=$!
sleep 2
for eng in chromium webkit; do
  echo "==== pre-C06 $eng 390x844"
  BASE=http://127.0.0.1:4249/ ENGINE=$eng VW=390 VH=844 node $E/instruments/i1-exit-fold-plays.COPY.mjs 2>&1 | tail -6
done
kill $SRV 2>/dev/null
echo "server killed"
