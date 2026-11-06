#!/bin/bash
# ext-battery.sh - row 4's attempt: the tree's dist on :4240 for the probe's life, the probe, the server stopped. One guarded call (the caller's).
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/NOTE-ERASE
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-47/web/frontend
cd $W && npx vite preview --config .erase10-build.mts --outDir $S/dist-t10 --host 127.0.0.1 --port 4240 --strictPort > $S/logs/ext-serve.log 2>&1 &
sp=$!; for i in $(seq 1 60); do curl -s --max-time 2 http://127.0.0.1:4240/ | grep -q index- && break; sleep 0.5; done
node $S/bin/ext-probe/probe.mjs 4240; x=$?
kill $sp; pkill -P $sp 2>/dev/null; echo "probe exit=$x"
