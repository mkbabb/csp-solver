#!/bin/bash
# Serve each LEDGER arm dist on :4245 (one at a time, killed by recorded PID), verify by hash, shoot the panels.
SP=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad; FE=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-47/web/frontend; LF=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/erase6-ledger/web/frontend
for arm in hold age step tint; do
  D=$SP/erase6-ledger-dist-$arm; ID=$(ls $D/assets | grep -E '^index-.*\.js$')
  lsof -nP -iTCP:4245 -sTCP:LISTEN -t >/dev/null 2>&1 && { echo "4245 HELD"; break; }
  cd $LF; npx vite preview --config $SP/erase6-cfg/vite.ledger.mts --outDir $D --host 127.0.0.1 --port 4245 --strictPort > $SP/erase6-logs/srv-arm-$arm.log 2>&1 &
  NPX=$!
  for i in $(seq 1 40); do curl -s http://127.0.0.1:4245/ | grep -q "$ID" && break; sleep 0.5; done
  LP=$(lsof -nP -iTCP:4245 -sTCP:LISTEN -t); echo "arm $arm id $ID npx $NPX listen $LP served $(curl -s http://127.0.0.1:4245/ | grep -o 'index-[A-Za-z0-9_-]*\.js')"
  cd $FE; ARM=$arm ARM_ID=$ID ARM_URL=http://127.0.0.1:4245 npx playwright test --config .erase6/pw.probe.config.ts p6-arms --project chromium > $SP/erase6-logs/arms-$arm.log 2>&1; echo "  shoot exit $?"
  kill $LP $NPX 2>/dev/null; sleep 1; lsof -nP -iTCP:4245 -sTCP:LISTEN -t >/dev/null 2>&1 && echo "  4245 STILL HELD"
done
