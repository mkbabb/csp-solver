#!/bin/sh
# The rest of the instruments, sequential, one engine at a time.
P=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_3b66f064-970-17/docs/tranches/2026-08-tranche-9/evidence/w7/intake-owner-2026-09-22/prototype/G-INFO/probe
O=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_3b66f064-970-17/web/frontend/.intake/out
cd "$O" || exit 1
node $P/glitch.mjs webkit dark 5 no $O/glitch-webkit-dark.json > $O/glitch-webkit-dark.log 2>&1; echo "glitch-webkit-dark $?"
node $P/glitch.mjs webkit light 5 no $O/glitch-webkit-light.json > $O/glitch-webkit-light.log 2>&1; echo "glitch-webkit-light $?"
node $P/glitch.mjs webkit light 3 prm $O/glitch-webkit-prm.json > $O/glitch-webkit-prm.log 2>&1; echo "glitch-webkit-prm $?"
for e in chromium webkit; do
  node $P/coarse.mjs $e $O/coarse-$e.json > $O/coarse-$e.log 2>&1; echo "coarse-$e $?"
  node $P/density.mjs $e 1024x768,1280x800 $O/density-$e.json > $O/density-$e.log 2>&1; echo "density-$e $?"
  node $P/aa.mjs $e $O/aa-$e.json > $O/aa-$e.log 2>&1; echo "aa-$e $?"
done
node $P/crops.mjs > $O/crops.log 2>&1; echo "crops $?"
echo DONE
