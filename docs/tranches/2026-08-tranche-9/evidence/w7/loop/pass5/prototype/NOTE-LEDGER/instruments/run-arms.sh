#!/bin/bash
# NOTE-LEDGER pass 5 — serve each arm's built dist on :4249 (killed by RECORDED PID between arms),
# verify it by its asset hash, run ledger.probe.ts on both engines. The control stays on :4248.
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-46/web/frontend
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ledger
cd $W
for arm in ${ARMS:-hold age step tint}; do
  for f in $S/srv-proto.pid $S/srv-proto.lpid; do [ -f $f ] && kill $(cat $f) 2>/dev/null; done
  for i in $(seq 1 20); do lsof -nP -iTCP:4249 -sTCP:LISTEN -t >/dev/null || break; sleep 0.5; done
  nohup npx vite preview --config .ledger/vite.preview.mts --outDir $S/dist-$arm --host 127.0.0.1 --port 4249 --strictPort > $S/srv-proto-$arm.log 2>&1 &
  echo $! > $S/srv-proto.pid
  ID=$(ls $S/dist-$arm/assets | grep -E '^index-.*\.js$')
  for i in $(seq 1 40); do curl -s http://127.0.0.1:4249/ | grep -q "$ID" && break; sleep 0.5; done
  lsof -nP -iTCP:4249 -sTCP:LISTEN -t > $S/srv-proto.lpid
  echo "ARM=$arm serving $(curl -s http://127.0.0.1:4249/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1) (want $ID) pid $(cat $S/srv-proto.lpid)"
  ARM=$arm PROTO_ID=$ID SHOOT=${SHOOT-1} npx playwright test --config .ledger/pw.probe.config.ts -g "${GREP:-rest:|pi:|aa:|push:|desk:|landscape:|frames:}" > $S/probe-$arm${SUFFIX}.log 2>&1
  echo "ARM=$arm probe exit=$? $(grep -E '[0-9]+ (passed|failed|skipped)' $S/probe-$arm${SUFFIX}.log | tr '\n' ' ')"
done
echo RUN-ARMS-DONE
