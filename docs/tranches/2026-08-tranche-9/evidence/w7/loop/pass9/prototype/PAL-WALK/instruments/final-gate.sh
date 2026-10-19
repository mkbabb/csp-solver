#!/bin/bash
# PAL-WALK pass-9: the gate's final bytes in the tree, read bare (eslint, prettier, the gate bare, --self-test); exits to files.
S=<lane-scratch>
W=<repo>/.claude/worktrees/wf_308fa864-c94-1/web/frontend
cd $W
echo "start $(date +%T) $(sysctl -n vm.loadavg)" > $S/logs/fin.load
npx eslint scripts/check-peer-arcs.mjs e2e/peer-walk.spec.ts src/games/shared/GameBoard.vue src/games/shared/useSession.test.ts > $S/logs/fin-eslint.log 2>&1; echo "exit=$?" > $S/logs/fin-eslint.exit
npx prettier --check --config .prettierrc.json scripts/check-peer-arcs.mjs e2e/peer-walk.spec.ts src/games/shared/GameBoard.vue src/games/shared/useSession.test.ts > $S/logs/fin-prettier.log 2>&1; echo "exit=$?" > $S/logs/fin-prettier.exit
node scripts/check-peer-arcs.mjs > $S/logs/fin-bare.log 2>&1; echo "exit=$?" > $S/logs/fin-bare.exit
node scripts/check-peer-arcs.mjs --self-test > $S/logs/fin-st.log 2>&1; echo "exit=$?" > $S/logs/fin-st.exit
echo "end $(date +%T) $(sysctl -n vm.loadavg)" >> $S/logs/fin.load
# the two library clauses whose battery row was not a self-test row: literal-nothrow (green at the battery) and at-own (red, 0 rows blind)
for c in literal-nothrow at-own; do SHAPE_SABOTAGE=$c node scripts/check-peer-arcs.mjs --self-test > $S/logs/fin-sab-$c.log 2>&1; echo "exit=$?" > $S/logs/fin-sab-$c.exit; done
echo "end2 $(date +%T) $(sysctl -n vm.loadavg)" >> $S/logs/fin.load
cd $S/wave-tree-b/web/frontend
node scripts/check-peer-arcs.mjs > $S/logs/wfin2-bare.log 2>&1; echo "exit=$?" > $S/logs/wfin2-bare.exit
node scripts/check-peer-arcs.mjs --self-test > $S/logs/wfin2-st.log 2>&1; echo "exit=$?" > $S/logs/wfin2-st.exit
echo "end3 $(date +%T) $(sysctl -n vm.loadavg)" >> $S/logs/fin.load
echo ALLDONE > $S/logs/fin.done
