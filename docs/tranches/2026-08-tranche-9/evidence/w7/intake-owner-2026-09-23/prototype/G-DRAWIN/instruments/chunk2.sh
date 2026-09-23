#!/bin/bash
# Chunk 2: WebKit battery on A×Q (4253) and the control (4254); then the late-deal profile (G-D8).
D=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_b6676cd9-8c6-13/web/frontend/.drawin
cd "$D" || exit 1
bash battery.sh AQ 4253 webkit full
bash battery.sh BASE 4254 webkit full
export SP=$D/series
echo "== G-D8 late deal $(date +%T)"
for dl in 1500 3500; do
  QS="" DEALDELAY=$dl timeout 300 node run3.mjs chromium d cold 3 http://127.0.0.1:4253 light motion "AQ-DEAL$dl"
  QS="" DEALDELAY=$dl timeout 300 node run3.mjs chromium d cold 3 http://127.0.0.1:4254 light motion "BASE-DEAL$dl"
done
echo "== chunk2 done $(date +%T)"
