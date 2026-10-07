#!/bin/bash
# pwjobs.sh <outdir> : every section spec whole-file, chromium + webkit, tree (:4255) then control (:4256)
SP=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/s13i8r
OUT=$1; mkdir -p $OUT; RES=$OUT/results.tsv; : > $RES
cd $SP/tree/web/frontend; export CI=
SPECS=${SPECS:-"affordances boot-hand count-yield fold-verb frame-halfstroke front-rate join-language ladder-prm live-fit-ablation note-reserve progress-corridor tally-flash wash-step font-census visual-regression"}
for s in $SPECS; do for p in chromium webkit; do for arm in ${ARMS:-tree:4255 ctrl:4256}; do
  a=${arm%%:*}; port=${arm##*:}; log=$OUT/$s.$p.$a.log; t0=$(date +%s)
  CONTROL=http://127.0.0.1:4256 PLAYWRIGHT_BASE_URL=http://127.0.0.1:$port PW_JSON=$OUT/$s.$p.$a.json npx playwright test -c $SP/cfg/pw.config.ts e2e/$s.spec.ts --project $p --workers 2 --reporter=line > $log 2>&1; rc=$?
  sum=$(grep -E '^\s+[0-9]+ (passed|failed|skipped|flaky|did not run)' $log | tr -s ' ' | tr '\n' ' ')
  printf '%s\t%s\t%s\t%s\t%ss\tload %s\t%s\n' $s $p $a $rc $(( $(date +%s)-t0 )) "$(sysctl -n vm.loadavg | awk '{print $2}')" "$sum" >> $RES
  echo "[$(date +%T)] $s $p $a -> $rc $sum"
done; done; done
for pre in filter-census theme-bake; do for sc in light dark; do for arm in tree:4255 ctrl:4256; do a=${arm%%:*}; port=${arm##*:}
  [ $pre = theme-bake ] && [ $sc = dark ] && continue
  log=$OUT/$pre.$sc.$a.log
  PROJ_PREFIX=$pre FC_SCHEME=$sc PLAYWRIGHT_BASE_URL=http://127.0.0.1:$port npx playwright test -c $SP/cfg/thr.config.ts --workers 2 --reporter=line > $log 2>&1; rc=$?
  sum=$(grep -E '^\s+[0-9]+ (passed|failed|skipped|flaky|did not run)' $log | tr -s ' ' | tr '\n' ' ')
  printf '%s\t%s\t%s\t%s\t-\tload %s\t%s\n' $pre $sc $a $rc "$(sysctl -n vm.loadavg | awk '{print $2}')" "$sum" >> $RES
  echo "[$(date +%T)] $pre $sc $a -> $rc $sum"
done; done; done
echo "PWJOBS DONE $(date +%T)"
