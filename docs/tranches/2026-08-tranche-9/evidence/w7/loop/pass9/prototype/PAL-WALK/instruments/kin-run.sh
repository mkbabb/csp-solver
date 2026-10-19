#!/bin/bash
S=<lane-scratch>
until [ -f $S/logs/spec-run-r2.done ]; do sleep 10; done
cd <repo>/.claude/worktrees/wf_308fa864-c94-1/web/frontend
for side in tree:4244 ctl:4232; do n=${side%%:*}; port=${side##*:}; for e in chromium webkit; do
  mkdir -p $S/probe/kin-out/$n-$e
  KIN_OUT=$S/probe/kin-out/$n-$e PLAYWRIGHT_BASE_URL=http://127.0.0.1:$port WALK_DPR=1 WALK_DIR=$S/probe WALK_MATCH='kinship\.spec\.ts$' WALK_OUT=$S/test-results/kin-$n-$e npx playwright test -c .pw-walk9.mts --project $e > $S/logs/kin-$n-$e.log 2>&1
  echo "exit=$?" > $S/logs/kin-$n-$e.exit
done; done
echo done > $S/logs/kin.done
