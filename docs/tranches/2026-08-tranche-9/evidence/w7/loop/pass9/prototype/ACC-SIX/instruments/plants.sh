#!/bin/bash
# plants.sh <spec> <plant...>: serve each plant on :4237 in turn and run the spec both engines. no rm, no set -e
S=<SCRATCH>
spec=$1; shift
for p in "$@"; do
  $S/stop.sh tree 2>&1 | grep -v "WARNING\|Output information\|assuming"
  sleep 2
  $S/serve.sh $p
  $S/spec.sh $(echo $spec | cut -d. -f1 | cut -c1-6)-$p $spec "chromium webkit"
done
echo PLANTS-DONE
