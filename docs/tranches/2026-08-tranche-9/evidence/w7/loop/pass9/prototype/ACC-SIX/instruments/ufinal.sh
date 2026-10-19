#!/bin/bash
# ufinal.sh: the union rows (the batch gate) on the served union, then the dev-graph rows (post.sh). no rm, no set -e
S=<SCRATCH>
gate() { while :; do l=$(uptime | sed 's/.*averages: //' | cut -d' ' -f1); [ "${l%.*}" -lt 120 ] && break; echo "load $l > 120, waiting 60 s"; sleep 60; done; }
curl -s http://127.0.0.1:4237/ | grep -q index-BGox1KTDMsaa.js || { $S/stop.sh tree 2>&1 | grep -v "WARNING\|Output information\|assuming"; sleep 2; $S/serve.sh union; }
gate; $S/uspec.sh U-cy count-yield.spec.ts
gate; $S/uspec.sh U-ws wash-step.spec.ts
gate; $S/uspec.sh U-vl viewport-law.spec.ts "chromium webkit" "washi tape covers any part"
gate; $S/uspec.sh U-fl face-law.spec.ts "chromium webkit" "covers its own PAINTED word"
$S/post.sh
echo UFINAL-DONE $(date +%T)
