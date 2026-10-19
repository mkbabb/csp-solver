#!/bin/bash
# thrjobs.sh <outdir> <engine> : the built-dist projects (filter-census, theme-bake) + boot/rest filter probe + pi, tree then control
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/integrate-s13-s7-s3
G=~/.claude/guard/guarded; OUT=$1; E=$2; mkdir -p $OUT; RES=$OUT/results.tsv; touch $RES
cd $S/tree/web/frontend; export CI=
load1() { sysctl -n vm.loadavg | awk '{print $2}'; }
if [ $E = webkit ]; then X="--exclusive webkit"; else X=""; fi
for pre in filter-census theme-bake; do for arm in tree:4255 ctrl:4256; do a=${arm%%:*}; port=${arm##*:}; log=$OUT/$pre.$E.$a.log
  grep -q "^$pre	$E	$a	" $RES && continue
  bash $S/inst/serve.sh $a >> $OUT/serve.log 2>&1 || { printf '%s\t%s\t%s\tSERVE\n' $pre $E $a >> $RES; continue; }
  l0=$(load1); t0=$(date +%s)
  PLAYWRIGHT_BASE_URL=http://127.0.0.1:$port $G $X --timeout 25 -- npx playwright test -c .pwthr-s13int.config.ts --project $pre-$E --workers 1 --reporter=line > $log 2>&1; echo $? > $log.rc
  sum=$(grep -E '^\s+[0-9]+ (passed|failed|skipped|flaky|did not run)' $log | tr -s ' ' | tr '\n' ' ')
  printf '%s\t%s\t%s\t%s\t%ss\tload %s→%s\t%s\n' $pre $E $a "$(cat $log.rc)" $(( $(date +%s)-t0 )) "$l0" "$(load1)" "$sum" >> $RES
  echo "[$(date +%T)] $pre $E $a -> $(cat $log.rc) $sum"
done; done
for arm in tree:4255 ctrl:4256; do a=${arm%%:*}; port=${arm##*:}; bash $S/inst/serve.sh $a >> $OUT/serve.log 2>&1
  ENGINE=$E $G $X --timeout 10 -- node $S/inst/probe-boot-filter.mjs http://127.0.0.1:$port > $OUT/bootfilter.$E.$a.log 2>&1; echo $? > $OUT/bootfilter.$E.$a.rc
  echo "[$(date +%T)] bootfilter $E $a -> $(cat $OUT/bootfilter.$E.$a.rc) load $(load1)"; done
PRM=1 ENGINE=$E $G $X --timeout 15 -- node $S/inst/probe-pi-wholedom.mjs http://127.0.0.1:4255 http://127.0.0.1:4256 $OUT/pi.$E.txt > $OUT/pi.$E.log 2>&1; echo $? > $OUT/pi.$E.rc
echo "[$(date +%T)] pi $E -> $(cat $OUT/pi.$E.rc) load $(load1)"
echo "THRJOBS DONE $E"
