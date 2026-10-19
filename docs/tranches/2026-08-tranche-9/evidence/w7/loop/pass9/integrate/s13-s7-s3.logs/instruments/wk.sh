#!/bin/bash
# wk.sh : the WebKit column, ONE guarded --exclusive webkit call per project per arm (the lock is re-queued per call)
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/integrate-s13-s7-s3
G=~/.claude/guard/guarded; OUT=$S/logs/wk; mkdir -p $OUT
cd $S/tree/web/frontend; export CI=; unset PLAYWRIGHT_BASE_URL
load1() { sysctl -n vm.loadavg | awk '{print $2}'; }
SPECS="affordances boot-hand count-yield fold-verb frame-halfstroke front-rate join-language ladder-prm live-fit-ablation note-reserve progress-corridor share-truth tally-flash wash-step font-census visual-regression"
FILES=$(for s in $SPECS; do printf 'e2e/%s.spec.ts ' $s; done)
run() { local name=$1; shift; [ -f $OUT/$name.rc ] && return; local l0=$(load1) t0=$(date +%s)
  "$@" > $OUT/$name.log 2>&1; echo $? > $OUT/$name.rc
  echo "[$(date +%T)] $name -> $(cat $OUT/$name.rc) $(( $(date +%s)-t0 ))s load $l0→$(load1) $(grep -E '^\s+[0-9]+ (passed|failed|skipped|flaky|did not run)' $OUT/$name.log | tr -s ' ' | tr '\n' ' ')"; }
for a in tree ctrl; do
  run specs-$a env SRV=$a PLAYWRIGHT_JSON_OUTPUT_NAME=$OUT/specs-$a.json $G --exclusive webkit --timeout 80 -- npx playwright test -c .pw-s13int-srv.config.ts $FILES --project webkit --workers 1 --reporter=line,json
done
for a in tree ctrl; do
  run thr-$a env SRV=$a PLAYWRIGHT_JSON_OUTPUT_NAME=$OUT/thr-$a.json $G --exclusive webkit --timeout 40 -- npx playwright test -c .pwthr-s13int-srv.config.ts --project filter-census-webkit --project theme-bake-webkit --workers 1 --reporter=line,json
done
run front-rate-dev env SRV=dev $G --exclusive webkit --timeout 20 -- npx playwright test -c .pw-s13int-srv.config.ts e2e/front-rate.spec.ts --project webkit --workers 1 --reporter=line --grep "G10-panel|D10-stallrun"
echo "WK DONE $(date +%T)"
