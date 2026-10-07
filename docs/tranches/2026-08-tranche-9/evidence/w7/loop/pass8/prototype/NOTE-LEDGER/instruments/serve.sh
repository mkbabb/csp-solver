#!/bin/bash
# serve.sh up <port> <cwd> <config> <outDir> <expected index js> | serve.sh down <port>
# up never frees a held port (exit 3); down kills only the RECORDED listener, only when its cwd is the recorded one,
# the recorded wrapper is among its ancestors, and the page still serves the recorded identity (LAWS P7 §B)
P=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ledger8/p8
REC=$P/servers.txt
cwdof() { lsof -a -p $1 -d cwd -Fn 2>/dev/null | grep ^n | cut -c2-; }
if [ "$1" = up ]; then
  PT=$2; C=$3; CFG=$4; OUT=$5; ID=$6
  H=$(lsof -nP -iTCP:$PT -sTCP:LISTEN -t 2>/dev/null | head -1)
  if [ -n "$H" ]; then echo "HELD :$PT by pid $H cwd $(cwdof $H) — not freed"; exit 3; fi
  (cd $C && exec npx vite preview --config $CFG --outDir $OUT --host 127.0.0.1 --port $PT --strictPort > $P/logs/serve-$PT.log 2>&1) &
  WR=$!
  for i in $(seq 1 120); do L=$(lsof -nP -iTCP:$PT -sTCP:LISTEN -t 2>/dev/null | head -1); [ -n "$L" ] && break; sleep 0.5; done
  GOT=$(curl -s http://127.0.0.1:$PT/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1)
  echo "up :$PT wrapper $WR listener $L cwd $(cwdof $L) serves $GOT want $ID $(date +%T)" | tee -a $REC
  [ "$GOT" = "$ID" ] || { echo "IDENTITY MISMATCH"; exit 4; }
elif [ "$1" = down ]; then
  PT=$2; LINE=$(grep "^up :$PT " $REC | tail -1)
  WR=$(echo "$LINE" | awk '{print $4}'); L=$(echo "$LINE" | awk '{print $6}'); C=$(echo "$LINE" | awk '{print $8}'); ID=$(echo "$LINE" | awk '{print $10}')
  NOW=$(lsof -nP -iTCP:$PT -sTCP:LISTEN -t 2>/dev/null | head -1); NC=$(cwdof $NOW)
  GOT=$(curl -s http://127.0.0.1:$PT/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1)
  A=$NOW; ANC=no; for i in 1 2 3 4 5 6; do A=$(ps -o ppid= -p $A 2>/dev/null | tr -d ' '); [ -z "$A" ] && break; [ "$A" = "$WR" ] && { ANC=yes; break; }; done
  if [ -n "$NOW" ] && [ "$NOW" = "$L" ] && [ "$NC" = "$C" ] && [ "$GOT" = "$ID" ] && [ $ANC = yes ]; then kill $L; kill $WR 2>/dev/null; sleep 1; echo "down :$PT killed listener $L wrapper $WR $(date +%T)" | tee -a $REC
  else echo "REFUSED down :$PT — now '$NOW' cwd '$NC' serves '$GOT' ancestry $ANC; recorded '$L' '$C' '$ID'" | tee -a $REC; fi
fi
