#!/bin/sh
# After the press cure (the note's berth survives :active): re-read the jump and a desk subset on the rebuilt dist.
P=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_3b66f064-970-17/docs/tranches/2026-08-tranche-9/evidence/w7/intake-owner-2026-09-22/prototype/G-INFO/probe
O=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_3b66f064-970-17/web/frontend/.intake/out
cd "$O" || exit 1
for e in webkit chromium; do
  node $P/active.mjs $e 3 $O/active2-$e.json > $O/active2-$e.log 2>&1; echo "active2-$e $?"
  node $P/active.mjs $e 2 $O/active2-share-$e.json share > $O/active2-share-$e.log 2>&1; echo "active2-share-$e $?"
done
node $P/glitch.mjs webkit light 5 no $O/glitch2-webkit-light.json > $O/glitch2-webkit-light.log 2>&1; echo "glitch2-webkit-light $?"
node $P/glitch.mjs webkit dark 5 no $O/glitch2-webkit-dark.json > $O/glitch2-webkit-dark.log 2>&1; echo "glitch2-webkit-dark $?"
node $P/probe.mjs webkit 1280x800,1024x768 light no mouse,key top,end $O/desk2-webkit-light.json > $O/desk2-webkit-light.log 2>&1; echo "desk2-webkit-light $?"
node $P/probe.mjs webkit 1280x800 dark no mouse,key top,end $O/desk2-webkit-dark.json > $O/desk2-webkit-dark.log 2>&1; echo "desk2-webkit-dark $?"
node $P/probe.mjs chromium 1280x800 light no mouse,key top,end $O/desk2-chromium-light.json > $O/desk2-chromium-light.log 2>&1; echo "desk2-chromium-light $?"
echo DONE
