#!/bin/bash
# NOTE-LEDGER pass 5 — the HOLD-only rows on the final HOLD dist: seat, r0 copies (proto + control),
# font-census.spec.ts whole (proto's spec vs proto dist; the control's own spec vs the control dist).
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-46/web/frontend
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ledger
E=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass5/prototype/NOTE-LEDGER
cd $W
export R0_OUT=$E/logs/r0
for f in $S/srv-proto.pid $S/srv-proto.lpid; do [ -f $f ] && kill $(cat $f) 2>/dev/null; done
for i in $(seq 1 20); do lsof -nP -iTCP:4249 -sTCP:LISTEN -t >/dev/null || break; sleep 0.5; done
nohup npx vite preview --config .ledger/vite.preview.mts --outDir $S/dist-hold --host 127.0.0.1 --port 4249 --strictPort > $S/srv-proto-hold2.log 2>&1 &
echo $! > $S/srv-proto.pid
ID=$(ls $S/dist-hold/assets | grep -E '^index-.*\.js$')
for i in $(seq 1 40); do curl -s http://127.0.0.1:4249/ | grep -q "$ID" && break; sleep 0.5; done
lsof -nP -iTCP:4249 -sTCP:LISTEN -t > $S/srv-proto.lpid
echo "serving $(curl -s http://127.0.0.1:4249/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1) (want $ID)"
npx playwright test --config .ledger/pw.probe.config.ts -g "seat:" > $S/seat.log 2>&1; echo "seat exit=$? $(grep -E '[0-9]+ (passed|failed)' $S/seat.log | tr '\n' ' ')"
PLAYWRIGHT_BASE_URL=http://127.0.0.1:4249 npx playwright test --config .ledger/pw.e2e.config.ts font-census.spec.ts > $S/e2e-fontcensus-proto.log 2>&1; echo "font-census proto exit=$? $(grep -E '[0-9]+ (passed|failed|skipped)' $S/e2e-fontcensus-proto.log | tr '\n' ' ')"
PLAYWRIGHT_BASE_URL=http://127.0.0.1:4248 npx playwright test --config .ledger/pw.e2e-control.config.ts font-census.spec.ts > $S/e2e-fontcensus-control.log 2>&1; echo "font-census control exit=$? $(grep -E '[0-9]+ (passed|failed|skipped)' $S/e2e-fontcensus-control.log | tr '\n' ' ')"
for side in proto control; do
  port=$([ $side = proto ] && echo 4249 || echo 4248)
  R0_ARM=$side R0_BASE=http://127.0.0.1:$port npx playwright test --config .ledger/pw.r0.config.ts -g "R3-d|R3-g|R3-a" > $S/r0-$side.log 2>&1
  echo "r0 $side exit=$? $(grep -E '[0-9]+ (passed|failed|skipped)' $S/r0-$side.log | tr '\n' ' ')"
done
echo HOLD-ROWS-DONE
