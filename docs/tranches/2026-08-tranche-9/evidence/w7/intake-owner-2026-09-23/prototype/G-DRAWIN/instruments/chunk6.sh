#!/bin/bash
# Chunk 6: G-D8 positive control (a second generation bump still erases once), prototype and HEAD.
D=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_b6676cd9-8c6-13/web/frontend/.drawin
cd "$D" || exit 1
export SP=$D/series
timeout 200 node pos.mjs http://127.0.0.1:4253 AQ2-POS 2
timeout 200 node pos.mjs http://127.0.0.1:4254 BASE-POS 2
echo "== chunk6 done"
