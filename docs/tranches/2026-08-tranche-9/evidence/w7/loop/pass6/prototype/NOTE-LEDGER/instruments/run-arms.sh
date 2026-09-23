#!/bin/bash
# NOTE-LEDGER pass 6 — serve each arm's built dist on :4249 in turn (killed by RECORDED PID between
# arms), verify it by its asset hash, run probe/ledger6.mjs on both engines. The control's pre-built
# dist stays on :4248 (started here if absent, its PID recorded in $S/srv-control.pid).
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-46/web/frontend
C=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ledger6
P=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass6/prototype/NOTE-LEDGER/probe/ledger6.mjs
if ! curl -s http://127.0.0.1:4248/ | grep -q index-CubiZsMVSwTc.js; then
  (cd $C && nohup npx vite preview --config .vite-control.config.ts --outDir dist --host 127.0.0.1 --port 4248 --strictPort > $S/srv-control.log 2>&1 & echo $! > $S/srv-control.pid)
  for i in $(seq 1 60); do curl -s http://127.0.0.1:4248/ | grep -q index-CubiZsMVSwTc.js && break; sleep 0.5; done
  lsof -nP -iTCP:4248 -sTCP:LISTEN -t > $S/srv-control.lpid
fi
echo "control :4248 serves $(curl -s http://127.0.0.1:4248/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1) pid $(cat $S/srv-control.pid) listener $(cat $S/srv-control.lpid)"
cd $W
for spec in ${RUNS:-"hold:push,pi,rest,land,aa,frames,desk" "age:push,frames" "step:push,frames" "tint:push,aa,frames" "timed:watch"}; do
  arm=${spec%%:*}; modes=${spec#*:}
  for f in $S/srv-proto.pid $S/srv-proto.lpid; do [ -f $f ] && kill $(cat $f) 2>/dev/null; done
  for i in $(seq 1 20); do lsof -nP -iTCP:4249 -sTCP:LISTEN -t >/dev/null || break; sleep 0.5; done
  nohup npx vite preview --config .note-ledger/vite.preview.mts --outDir $S/dist-$arm --host 127.0.0.1 --port 4249 --strictPort > $S/srv-proto-$arm.log 2>&1 &
  echo $! > $S/srv-proto.pid
  ID=$(ls $S/dist-$arm/assets | grep -E '^index-.*\.js$')
  for i in $(seq 1 60); do curl -s http://127.0.0.1:4249/ | grep -q "$ID" && break; sleep 0.5; done
  lsof -nP -iTCP:4249 -sTCP:LISTEN -t > $S/srv-proto.lpid
  echo "ARM=$arm serving $(curl -s http://127.0.0.1:4249/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1) (want $ID) pid $(cat $S/srv-proto.pid) listener $(cat $S/srv-proto.lpid)"
  for eng in ${ENGINES:-chromium webkit}; do
    PROTO_ID=$ID node $P $eng $arm $modes > $S/probe-$arm-$eng.log 2>&1
    echo "ARM=$arm $eng exit=$? rows=$(grep -c '^ROW' $S/probe-$arm-$eng.log) $(grep -E '^ERR' $S/probe-$arm-$eng.log | head -1)"
  done
done
echo RUN-ARMS-DONE
