#!/bin/bash
# Chunk 3: arm F (ruling front) then arm B (crossfade layer), each served in turn on 4253.
D=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_b6676cd9-8c6-13/web/frontend/.drawin
cd "$D" || exit 1
bash arm.sh f
bash battery.sh F 4253 chromium lite
bash battery.sh F 4253 webkit lite
export OUT=$D/photos/r1
timeout 120 node shoot.mjs chromium d light http://127.0.0.1:4253 F frame375 predrawn settled
timeout 120 node shoot.mjs webkit d dark http://127.0.0.1:4253 F frame375
bash arm.sh b
bash battery.sh B 4253 chromium lite
bash battery.sh B 4253 webkit lite
for rep in 1 2; do
  export OUT=$D/photos/r$rep
  timeout 120 node shoot.mjs chromium d light http://127.0.0.1:4253 B frame375 predrawn midfade settled
  timeout 120 node shoot.mjs webkit d light http://127.0.0.1:4253 B frame375 predrawn midfade settled
done
bash arm.sh aq
# A×Q after the wordmark-residency wait (the ruling waits for both pose-0 encodes)
bash battery.sh AQ2 4253 webkit full
bash battery.sh AQ2 4253 chromium lite
export SP=$D/series
QS="" DEALDELAY=1500 timeout 300 node run3.mjs chromium d cold 3 http://127.0.0.1:4253 light motion "AQ2-DEAL1500"
QS="" DEALDELAY=3500 SPAN=9000 timeout 300 node run3.mjs chromium d cold 3 http://127.0.0.1:4253 light motion "AQ2-DEAL3500"
timeout 200 node pos.mjs http://127.0.0.1:4253 AQ2-POS 2
timeout 200 node pos.mjs http://127.0.0.1:4254 BASE-POS 2
echo "== chunk3 done $(date +%T)"
