#!/bin/sh
# G-INFO desk battery: the same probe on HEAD (4256) and the prototype (4255), chunked by engine.
P=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_3b66f064-970-17/docs/tranches/2026-08-tranche-9/evidence/w7/intake-owner-2026-09-22/prototype/G-INFO/probe
O=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_3b66f064-970-17/web/frontend/.intake/out
cd "$O" || exit 1
for e in chromium webkit; do
  node $P/probe.mjs $e 1280x800,1024x768,1440x900,1280x720 light no mouse,key top,end $O/desk-$e-light.json > $O/desk-$e-light.log 2>&1; echo "desk-$e-light $?"
  node $P/probe.mjs $e 1280x800 dark no mouse,key top,end $O/desk-$e-dark.json > $O/desk-$e-dark.log 2>&1; echo "desk-$e-dark $?"
  node $P/probe.mjs $e 1280x800 light prm mouse,key top,end $O/desk-$e-prm.json > $O/desk-$e-prm.log 2>&1; echo "desk-$e-prm $?"
  node $P/probe.mjs $e 1728x1117 light no mouse top $O/desk-$e-1728.json > $O/desk-$e-1728.log 2>&1; echo "desk-$e-1728 $?"
done
echo DONE
