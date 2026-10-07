#!/bin/bash
# discriminator: join-language (chromium x2) + count-yield (chromium x1) per layer dist on :4255, control 74a2b5d9 on :4256
SP=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/s13i8r
OUT=$SP/logs/disc; mkdir -p $OUT; RES=$OUT/results.tsv; : > $RES; export CI=
stop4255() { local P=$(lsof -nP -iTCP:4255 -sTCP:LISTEN 2>/dev/null | awk 'NR>1{print $2}' | head -1); [ -z "$P" ] && return 0
  local C=$(lsof -p $P -a -d cwd 2>/dev/null | tail -1 | awk '{print $NF}'); case "$C" in $SP/*) local PP=$(ps -o ppid= -p $P | tr -d ' '); kill $P $PP 2>/dev/null;; *) echo "4255 held by $P cwd $C: NOT MINE, stop"; exit 3;; esac
  local t=0; while lsof -nP -iTCP:4255 -sTCP:LISTEN >/dev/null 2>&1 && [ $t -lt 20 ]; do sleep 1; t=$((t+1)); done; }
serve() { local dir=$1 cfg=$2 dist=$3; stop4255; (cd $dir && nohup npx vite preview --config $cfg --outDir $dist --host 127.0.0.1 --port 4255 --strictPort > $OUT/srv-4255.log 2>&1 < /dev/null &); local t=0; until curl -sf -o /dev/null http://127.0.0.1:4255/ || [ $t -ge 60 ]; do sleep 1; t=$((t+1)); done; curl -s http://127.0.0.1:4255/ | grep -o 'index-[A-Za-z0-9_-]*\.js' > $OUT/id.txt; }
for st in U0 U1 U2 U3 F; do
  if [ $st = F ]; then serve $SP/tree/web/frontend $SP/cfg/vite-tree.config.mts $SP/dist-tree; else serve $SP/step-$st/web/frontend $SP/cfg/vite-step-$st.config.mts $SP/dist-step-$st; fi; id=$(cat $OUT/id.txt)
  echo "[$(date +%T)] $st served $id"
  cd $SP/tree/web/frontend
  for i in 1 2; do log=$OUT/join.$st.$i.log
    PLAYWRIGHT_BASE_URL=http://127.0.0.1:4255 npx playwright test -c $SP/cfg/pw.config.ts e2e/join-language.spec.ts --project chromium --workers 1 --reporter=line > $log 2>&1; rc=$?
    printf 'join\t%s\t%s\t%s\t%s\tload %s\t%s\n' $st "$id" $i $rc "$(sysctl -n vm.loadavg | awk '{print $2}')" "$(grep -E '^\s+[0-9]+ (passed|failed)' $log | tr -s ' ' | tr '\n' ' ')" >> $RES; done
  log=$OUT/count.$st.log
  CONTROL=http://127.0.0.1:4256 PLAYWRIGHT_BASE_URL=http://127.0.0.1:4255 npx playwright test -c $SP/cfg/pw.config.ts e2e/count-yield.spec.ts --project chromium --workers 2 --reporter=line > $log 2>&1; rc=$?
  printf 'count\t%s\t%s\t1\t%s\tload %s\t%s\n' $st "$id" $rc "$(sysctl -n vm.loadavg | awk '{print $2}')" "$(grep -E '^\s+[0-9]+ (passed|failed)' $log | tr -s ' ' | tr '\n' ' ')" >> $RES
done
echo "DISC DONE $(date +%T)" >> $RES
