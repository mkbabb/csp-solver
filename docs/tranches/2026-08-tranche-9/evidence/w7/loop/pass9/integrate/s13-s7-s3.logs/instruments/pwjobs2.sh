#!/bin/bash
# pwjobs2.sh <outdir> <engine> : section specs whole-file, each run serving its own dist inside one guarded call
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/integrate-s13-s7-s3
G=~/.claude/guard/guarded; OUT=$1; p=$2; mkdir -p $OUT; RES=$OUT/results.tsv; touch $RES
cd $S/tree/web/frontend; export CI=; unset PLAYWRIGHT_BASE_URL
load1() { sysctl -n vm.loadavg | awk '{print $2}'; }
boxok() { local l=$(load1); local n=0; while awk "BEGIN{exit !($l > 120)}"; do sleep 60; l=$(load1); n=$((n+1)); [ $n -ge 30 ] && break; done; echo $l; }
if [ $p = webkit ]; then X="--exclusive webkit"; else X=""; fi
SPECS=${SPECS:-"affordances boot-hand count-yield fold-verb frame-halfstroke front-rate join-language ladder-prm live-fit-ablation note-reserve progress-corridor share-truth tally-flash wash-step font-census visual-regression"}
for s in $SPECS; do for a in ${ARMS:-tree ctrl}; do
  [ -f e2e/$s.spec.ts ] || continue; log=$OUT/$s.$p.$a.log; grep -q "^$s	$p	$a	" $RES && continue
  l0=$(boxok); t0=$(date +%s)
  SRV=$a $G $X --timeout 25 -- npx playwright test -c .pw-s13int-srv.config.ts e2e/$s.spec.ts --project $p --workers 1 --reporter=line > $log 2>&1; echo $? > $log.rc
  sum=$(grep -E '^\s+[0-9]+ (passed|failed|skipped|flaky|did not run)' $log | tr -s ' ' | tr '\n' ' ')
  printf '%s\t%s\t%s\t%s\t%ss\tload %s→%s\t%s\n' $s $p $a "$(cat $log.rc)" $(( $(date +%s)-t0 )) "$l0" "$(load1)" "$sum" >> $RES
  echo "[$(date +%T)] $s $p $a -> $(cat $log.rc) $sum"
done; done
for pre in ${THR:-filter-census theme-bake}; do [ "$pre" = __none ] && continue; for a in tree ctrl; do log=$OUT/thr-$pre.$p.$a.log; grep -q "^thr-$pre	$p	$a	" $RES && continue
  l0=$(load1); t0=$(date +%s)
  SRV=$a $G $X --timeout 25 -- npx playwright test -c .pwthr-s13int-srv.config.ts --project $pre-$p --workers 1 --reporter=line > $log 2>&1; echo $? > $log.rc
  sum=$(grep -E '^\s+[0-9]+ (passed|failed|skipped|flaky|did not run)' $log | tr -s ' ' | tr '\n' ' ')
  printf '%s\t%s\t%s\t%s\t%ss\tload %s→%s\t%s\n' thr-$pre $p $a "$(cat $log.rc)" $(( $(date +%s)-t0 )) "$l0" "$(load1)" "$sum" >> $RES
  echo "[$(date +%T)] thr-$pre $p $a -> $(cat $log.rc) $sum"; done; done
if [ -n "$DEV" ]; then log=$OUT/front-rate-dev.$p.log; l0=$(load1)
  SRV=dev $G $X --timeout 25 -- npx playwright test -c .pw-s13int-srv.config.ts e2e/front-rate.spec.ts --project $p --workers 1 --reporter=line --grep "G10-panel|D10-stallrun" > $log 2>&1; echo $? > $log.rc
  echo "[$(date +%T)] front-rate-dev $p -> $(cat $log.rc) load $l0→$(load1) $(grep -E '^\s+[0-9]+ (passed|failed)' $log | tr -s ' ' | tr '\n' ' ')"; fi
echo "PWJOBS2 DONE $p $(date +%T)"
