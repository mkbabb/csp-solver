#!/bin/zsh
# C11 gates, run BARE from the w8-bake worktree's web/frontend. A pipe to tail eats the exit
# code, so each gate's status is captured on its own line by $? and nothing is piped.
set -u
for g in test:unit lint:eslint lint lint:knip lint:boundary lint:tdz lint:copy lint:live-regions lint:motion typecheck:e2e typecheck:node; do
  echo "=== npm run $g ==="
  npm run $g > /tmp/c11-gate.out 2>&1
  code=$?
  tail -12 /tmp/c11-gate.out
  echo "--- exit $code ---"
done
