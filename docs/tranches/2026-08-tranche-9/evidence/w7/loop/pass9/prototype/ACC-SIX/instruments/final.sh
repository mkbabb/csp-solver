#!/bin/bash
# final.sh: every battery row on the FINAL bytes, each opened under a 1-min load of 120 (60 s polls). no rm, no set -e
S=<SCRATCH>
W=<TREE>/web/frontend
gate() { while :; do l=$(uptime | sed 's/.*averages: //' | cut -d' ' -f1); [ "${l%.*}" -lt 120 ] && break; echo "load $l > 120, waiting 60 s"; sleep 60; done; }
sv() { $S/stop.sh tree 2>&1 | grep -v "WARNING\|Output information\|assuming"; sleep 2; $S/serve.sh $1; }
$S/buildall.sh w7
sv none
gate; $S/spec.sh F-cy count-yield.spec.ts
gate; $S/spec.sh F-ws wash-step.spec.ts
gate; $S/spec.sh F-fr front-rate.spec.ts
for e in chromium webkit; do gate; (cd $W && node <HELPER>/count-aa-sweep.mjs --url http://127.0.0.1:4237 --engine $e > $S/logs/F-aa-$e.log 2>&1; echo $? > $S/logs/F-aa-$e.exit); echo "F-aa $e exit $(cat $S/logs/F-aa-$e.exit)"; done
sv slow49; gate; $S/spec.sh F-fr-slow49 front-rate.spec.ts "chromium webkit" 4237 "G10: every"
for p in noro overyield late150; do sv $p; gate; $S/spec.sh F-cy-$p count-yield.spec.ts; done
sv w7; gate; $S/spec.sh F-ws-w7 wash-step.spec.ts
sv union
gate; $S/uspec.sh U-cy count-yield.spec.ts
gate; $S/uspec.sh U-ws wash-step.spec.ts
gate; $S/uspec.sh U-vl viewport-law.spec.ts "chromium webkit" "washi tape covers any part"
gate; $S/uspec.sh U-fl face-law.spec.ts "chromium webkit" "covers its own PAINTED word"
$S/stop.sh tree 2>&1 | grep -v "WARNING\|Output information\|assuming"
echo FINAL-DONE $(date +%T)
