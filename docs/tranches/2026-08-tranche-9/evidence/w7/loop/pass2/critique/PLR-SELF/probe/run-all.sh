#!/bin/sh
# CRITIC's battery: bring both servers up, run both engines, kill the servers.
set -x
D=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/critique/PLR-SELF/probe
PROTO=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-52/web/frontend
MAIN=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend
export NODE_PATH=$MAIN/node_modules
cd $PROTO && npx vite --config $D/vite.proto.config.mts --host 127.0.0.1 --port 4245 --strictPort > $D/serve-proto.log 2>&1 &
P1=$!
cd $MAIN && npx vite --config $D/vite.head.config.mts --host 127.0.0.1 --port 4246 --strictPort > $D/serve-head.log 2>&1 &
P2=$!
sleep 10
cd $PROTO
npx playwright test --config $D/crit.config.ts --project=chromium > $D/run-chromium.log 2>&1
npx playwright test --config $D/crit.config.ts --project=webkit > $D/run-webkit.log 2>&1
kill $P1 $P2 2>/dev/null
sleep 2
echo "LISTENERS 4245=$(lsof -ti tcp:4245 | wc -l) 4246=$(lsof -ti tcp:4246 | wc -l)"
echo "BATTERY DONE"
