#!/bin/bash
# Chunk 5 (after chunk 4, 4253 back on A×Q): G-D8 late deal at 3.5 s and the positive control.
D=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_b6676cd9-8c6-13/web/frontend/.drawin
cd "$D" || exit 1
until grep -q "chunk4 done" chunk4.log; do sleep 5; done
export SP=$D/series
QS="" DEALDELAY=3500 SPAN=9000 timeout 300 node run3.mjs chromium d cold 3 http://127.0.0.1:4253 light motion "AQ2-DEAL3500"
timeout 200 node pos.mjs http://127.0.0.1:4253 AQ2-POS 2
timeout 200 node pos.mjs http://127.0.0.1:4254 BASE-POS 2
echo "== chunk5 done $(date +%T)"
