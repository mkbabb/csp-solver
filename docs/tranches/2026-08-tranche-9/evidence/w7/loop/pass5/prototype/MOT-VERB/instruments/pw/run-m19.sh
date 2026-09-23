#!/bin/bash
cd "$(dirname "$0")"
L=../m19
r() { local name=$1 proj=$2; shift 2; env "$@" npx playwright test -c pw.config.mts specs/m19.spec.ts --project=$proj > $L-$name.log 2>&1; echo "EXIT $?" >> $L-$name.log; echo "done $name $(date +%T)"; }
r chromium chromium
r webkit webkit
r prm-chromium chromium PRM=1 ARMS=after,main CELLS=1280x800-light-fine,390x844-light-coarse
r prm-webkit webkit PRM=1 ARMS=after,main CELLS=1280x800-light-fine,390x844-light-coarse
r neglift-chromium chromium NEG=lift ARMS=after CELLS=1280x800-light-fine,390x844-light-coarse
r neglift-webkit webkit NEG=lift ARMS=after CELLS=1280x800-light-fine,390x844-light-coarse
r negnofit-chromium chromium NEG=nofit ARMS=after,main CELLS=1280x800-light-fine
r negnofit-webkit webkit NEG=nofit ARMS=after,main CELLS=1280x800-light-fine
echo ALLDONE
