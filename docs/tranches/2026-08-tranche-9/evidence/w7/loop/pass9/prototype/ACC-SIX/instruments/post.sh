#!/bin/bash
# post.sh: the DEV-graph rows of front-rate (G10-panel, D10-stallrun) on the tree, and slow49 on G10-panel. no rm, no set -e
S=<SCRATCH>
gate() { while :; do l=$(uptime | sed 's/.*averages: //' | cut -d' ' -f1); [ "${l%.*}" -lt 120 ] && break; echo "load $l > 120, waiting 60 s"; sleep 60; done; }
sv() { $S/stop.sh tree 2>&1 | grep -v "WARNING\|Output information\|assuming"; sleep 2; $S/serve.sh $1; }
sv dev-none; gate; $S/spec.sh P-fr-dev front-rate.spec.ts "chromium webkit" 4237 "G10-panel|D10-stallrun"
sv dev-slow49; gate; $S/spec.sh P-fr-dev-slow49 front-rate.spec.ts "chromium webkit" 4237 "G10-panel"
$S/stop.sh tree 2>&1 | grep -v "WARNING\|Output information\|assuming"
echo POST-DONE $(date +%T)
