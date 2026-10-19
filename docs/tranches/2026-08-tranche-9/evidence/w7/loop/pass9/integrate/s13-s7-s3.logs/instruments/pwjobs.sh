#!/bin/bash
# pwjobs.sh <outdir> : section specs whole-file, chromium then webkit, tree (:4255) then control (:4256)
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/integrate-s13-s7-s3
G=~/.claude/guard/guarded
OUT=$1; mkdir -p $OUT; RES=$OUT/results.tsv; touch $RES
cd $S/tree/web/frontend; export CI=
load1() { sysctl -n vm.loadavg | awk '{print $2}'; }
boxok() { local l=$(load1); local n=0; while awk "BEGIN{exit !($l > 120)}"; do echo "[$(date +%T)] load $l > 120, waiting 60s"; sleep 60; l=$(load1); n=$((n+1)); [ $n -ge 30 ] && break; done; echo $l; }
SPECS=${SPECS:-"affordances boot-hand count-yield fold-verb frame-halfstroke front-rate join-language ladder-prm live-fit-ablation note-reserve progress-corridor share-truth tally-flash wash-step font-census visual-regression"}
for s in $SPECS; do for p in ${PROJS:-chromium webkit}; do for arm in ${ARMS:-tree:4255 ctrl:4256}; do
  a=${arm%%:*}; port=${arm##*:}; log=$OUT/$s.$p.$a.log
  grep -q "^$s	$p	$a	" $RES && continue
  bash $S/inst/serve.sh $a >> $OUT/serve.log 2>&1 || { printf '%s\t%s\t%s\tSERVE\n' $s $p $a >> $RES; continue; }
  l0=$(boxok | tail -1); t0=$(date +%s)
  if [ $p = webkit ]; then X="--exclusive webkit"; else X=""; fi
  CONTROL=http://127.0.0.1:4256 PLAYWRIGHT_BASE_URL=http://127.0.0.1:$port $G $X --timeout 25 -- npx playwright test -c .pw-s13int.config.ts e2e/$s.spec.ts --project $p --workers 1 --reporter=line > $log 2>&1; echo $? > $log.rc
  sum=$(grep -E '^\s+[0-9]+ (passed|failed|skipped|flaky|did not run)' $log | tr -s ' ' | tr '\n' ' ')
  printf '%s\t%s\t%s\t%s\t%ss\tload %s→%s\t%s\n' $s $p $a "$(cat $log.rc)" $(( $(date +%s)-t0 )) "$l0" "$(load1)" "$sum" >> $RES
  echo "[$(date +%T)] $s $p $a -> $(cat $log.rc) $sum"
done; done; done
echo "PWJOBS DONE $(date +%T)"
