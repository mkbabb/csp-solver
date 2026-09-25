#!/bin/bash
# SAFE: a server is killed only when it is the listener THIS script started AND it serves this script's identity.
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad; F=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-47/web/frontend
L() { echo "load=$(uptime | sed 's/.*averages: //') sibs=$(pgrep -f 'node|playwright|vitest' | wc -l | tr -d ' ')"; }
serve() { # name dist -> sets PORT PID or fails
  local ID=$(ls $2/assets | grep -E '^index-.*\.js$'); PORT=""; PID=""
  for p in 4236 4237 4235 4234 4243 4245 4246 4231 4230; do lsof -nP -iTCP:$p -sTCP:LISTEN -t >/dev/null || { PORT=$p; break; }; done
  [ -z "$PORT" ] && { echo "NO FREE PORT"; return 1; }
  cd $F; nohup npx vite preview --config .erase7/preview.mts --outDir $2 --host 127.0.0.1 --port $PORT --strictPort > $S/erase7s-logs/serve2-$1.log 2>&1 &
  local W=$!
  for i in $(seq 1 60); do curl -s http://127.0.0.1:$PORT/ | grep -q "$ID" && break; sleep 0.5; done
  local LP=$(lsof -nP -iTCP:$PORT -sTCP:LISTEN -t | head -1)
  # the listener must descend from the wrapper this function started
  local anc=$LP; local ok=0; for k in 1 2 3 4 5; do [ "$anc" = "$W" ] && ok=1 && break; anc=$(ps -o ppid= -p $anc 2>/dev/null | tr -d ' '); [ -z "$anc" ] && break; done
  curl -s http://127.0.0.1:$PORT/ | grep -q "$ID" || ok=0
  [ $ok = 1 ] && { PID=$LP; echo "$1 :$PORT served=$ID listener=$PID (child of $W)"; } || { echo "$1 :$PORT NOT MINE or not serving $ID (listener=$LP wrapper=$W)"; kill $W 2>/dev/null; return 1; }
}
cd $F
if serve union-hold $S/erase7s-dist-union-hold; then
  ARM=hold ARM_ID=C4rwyft5SG8y ARM_URL=http://127.0.0.1:$PORT PANELS=$S/erase7s-panels OUT=$S/erase7s-out npx playwright test --config .erase7/pw.probe.config.ts ledger.probe.ts > $S/erase7s-logs/ledger-hold.log 2>&1
  echo "LEDGER hold exit=$? :: $(grep -E '[0-9]+ (passed|failed)' $S/erase7s-logs/ledger-hold.log | tr -s ' ' | tr '\n' ' ') $(L)"; kill $PID; echo "killed own $PID"
fi
if serve s10 $S/erase7s-dist-s10; then
  SP=$PORT; SPID=$PID
  ARMS="s10:$SP,control:4249,tree:4248" OUT=$S/erase7s-out npx playwright test --config .erase7/pw.probe.config.ts park.probe.ts > $S/erase7s-logs/park.log 2>&1
  echo "PARK exit=$? :: $(grep -E '[0-9]+ (passed|failed)' $S/erase7s-logs/park.log | tr -s ' ' | tr '\n' ' ') $(L)"; kill $SPID; echo "killed own $SPID"
fi
echo BROWSER2DONE
