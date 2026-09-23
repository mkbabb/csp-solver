#!/bin/bash
# Chunk 4 (after chunk 3): arm B photographs with the fixed frame condition, then back to A×Q
# for its WebKit dark handoff pair (frame first, so the draw is not missed).
D=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_b6676cd9-8c6-13/web/frontend/.drawin
cd "$D" || exit 1
until grep -q "chunk3 done" bat-arms.log; do sleep 5; done
bash arm.sh b
for rep in 1 2; do
  export OUT=$D/photos/r$rep
  timeout 120 node shoot.mjs chromium d light http://127.0.0.1:4253 B frame375 predrawn midfade settled
  timeout 120 node shoot.mjs webkit d light http://127.0.0.1:4253 B frame375 predrawn midfade settled
done
bash arm.sh aq
for rep in 1 2; do
  export OUT=$D/photos/r$rep
  timeout 120 node shoot.mjs webkit d dark http://127.0.0.1:4253 AQ2 frame375 predrawn settled
  timeout 120 node shoot.mjs chromium d light http://127.0.0.1:4253 AQ2 frame375 predrawn settled
done
echo "== chunk4 done $(date +%T)"
