#!/bin/zsh
# pirun.sh <tag> <port> — the π census + filter census, chromium 1280/390 × light/dark (+ webkit 1280 light)
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_b6676cd9-8c6-14/.gt
mkdir -p pi
for S in light dark; do
  node pi.mjs $2 chromium 1280x800 $S 0 pi/$1-chromium-1280-$S.json >> pi.log 2>&1 || echo "FAIL $1 1280 $S" >> pi.log
  node pi.mjs $2 chromium 390x844 $S 1 pi/$1-chromium-390-$S.json >> pi.log 2>&1 || echo "FAIL $1 390 $S" >> pi.log
done
node pi.mjs $2 webkit 1280x800 light 0 pi/$1-webkit-1280-light.json >> pi.log 2>&1 || echo "FAIL $1 webkit" >> pi.log
echo "$(date +%T) PI $1 DONE" >> pi.log
