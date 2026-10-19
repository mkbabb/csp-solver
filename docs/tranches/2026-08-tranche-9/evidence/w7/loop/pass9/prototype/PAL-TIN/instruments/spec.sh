#!/bin/bash
# PAL-TIN pass 9 · one spec (or a -g filter) per engine; exit read from the log the run writes. No rm, no set -e.
S=$SCRATCH
cd $SCRATCH/cfg || exit 9
d=${1:-1}; tag=${2:-tree}; g=${3:-}; engines=${ENGINES:-chromium webkit}
for eng in $engines; do
  lg=$S/logs/spec-$tag-$eng-dpr$d.log
  echo "spec ${TIN_MATCH:-peer-tin} · base ${BASE:-http://127.0.0.1:4245} $(curl -s ${BASE:-http://127.0.0.1:4245}/ | grep -o 'index-[A-Za-z0-9_-]*\.js') · load $(uptime | sed 's/.*averages*: //') · start $(date +%T)" > $lg
  PLAYWRIGHT_BASE_URL=${BASE:-http://127.0.0.1:4245} TIN_DPR=$d TIN_OUT=$S/pw-out/$tag-$eng-$d npx playwright test --config $S/cfg/pw.mts --project $eng ${g:+-g "$g"} >> $lg 2>&1
  echo "EXIT=$? · load after $(uptime | sed 's/.*averages*: //') · end $(date +%T)" >> $lg
done
echo done > $S/logs/spec-$tag-dpr$d.done
