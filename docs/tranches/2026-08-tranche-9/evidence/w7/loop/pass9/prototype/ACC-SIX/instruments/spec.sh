#!/bin/bash
# spec.sh <label> <spec> [engines] [port] [grep]: run one spec against a served build; exits read bare from files. no rm, no set -e
W=<TREE>/web/frontend
S=<SCRATCH>
label=$1; spec=$2; port=${4:-4237}; cd $W
for eng in ${3:-chromium webkit}; do
  ld=$(uptime | sed 's/.*averages: //')
  if [ -n "$5" ]; then g="--grep=$5"; else g=""; fi
  BASE=http://127.0.0.1:$port PWOUT=$S/pw-$label-$eng npx playwright test -c <HELPER>/pw.config.ts e2e/$spec --project=$eng $g > $S/logs/$label-$eng.log 2>&1
  echo $? > $S/logs/$label-$eng.exit
  echo "$label $eng exit $(cat $S/logs/$label-$eng.exit) · load at start $ld · at end $(uptime | sed 's/.*averages: //') · served :$port $(curl -s http://127.0.0.1:$port/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1)"
done
echo SPEC-DONE $label
