#!/bin/zsh
# horun.sh <tag> <port> — census handoff2 (live at identity vs the 4 rest poses), both engines × both themes
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_b6676cd9-8c6-14/.gt
for E in chromium webkit; do for S in light dark; do
  node handoff2.mjs $2 $E $S ho-$1 >> ho.log 2>&1 || echo "FAIL $1 $E $S" >> ho.log
done; done
echo "$(date +%T) HO $1 DONE" >> ho.log
