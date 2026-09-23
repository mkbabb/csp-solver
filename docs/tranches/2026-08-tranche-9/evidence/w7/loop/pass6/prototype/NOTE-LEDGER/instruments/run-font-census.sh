#!/bin/bash
# NOTE-LEDGER pass 6 — font-census.spec.ts WHOLE, both engines, on HOLD's built dist (:4249) and the
# control's own spec on the control's pre-built dist (:4248). Servers killed by RECORDED PID.
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-46/web/frontend
C=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ledger6
L=$S/../ledger6b/fc; mkdir -p $L
for p in 4248 4249; do lsof -nP -iTCP:$p -sTCP:LISTEN -t >/dev/null && { echo "PORT $p HELD"; exit 3; }; done
(cd $C && nohup npx vite preview --config .vite-control.config.ts --outDir dist --host 127.0.0.1 --port 4248 --strictPort > $L/srv-control.log 2>&1 & echo $! > $L/srv-control.pid)
(cd $W && nohup npx vite preview --config .note-ledger/vite.preview.mts --outDir $S/dist-hold --host 127.0.0.1 --port 4249 --strictPort > $L/srv-proto.log 2>&1 & echo $! > $L/srv-proto.pid)
for i in $(seq 1 60); do curl -s http://127.0.0.1:4248/ | grep -q index-CubiZsMVSwTc.js && curl -s http://127.0.0.1:4249/ | grep -q index-KMC3d3TWjLH2.js && break; sleep 0.5; done
lsof -nP -iTCP:4248 -sTCP:LISTEN -t > $L/srv-control.lpid; lsof -nP -iTCP:4249 -sTCP:LISTEN -t > $L/srv-proto.lpid
echo "control :4248 $(curl -s http://127.0.0.1:4248/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1) · proto :4249 $(curl -s http://127.0.0.1:4249/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1)"
cd $W
PLAYWRIGHT_BASE_URL=http://127.0.0.1:4249 npx playwright test --config .note-ledger/pw.e2e.config.ts font-census.spec.ts > $L/proto.log 2>&1; echo "proto font-census exit=$? $(grep -E '[0-9]+ (passed|failed)' $L/proto.log | tr '\n' ' ')"
PLAYWRIGHT_BASE_URL=http://127.0.0.1:4248 npx playwright test --config .note-ledger/pw.e2e-control.config.ts font-census.spec.ts > $L/control.log 2>&1; echo "control font-census exit=$? $(grep -E '[0-9]+ (passed|failed)' $L/control.log | tr '\n' ' ')"
for n in proto control; do kill $(cat $L/srv-$n.lpid) $(cat $L/srv-$n.pid) 2>/dev/null; done; sleep 2
for p in 4248 4249; do lsof -nP -iTCP:$p -sTCP:LISTEN -t >/dev/null && echo "PORT $p STILL HELD" || echo "port $p free"; done
echo FC-DONE
