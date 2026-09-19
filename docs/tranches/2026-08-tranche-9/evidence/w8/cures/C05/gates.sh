#!/bin/sh
# T9-W8 C05 — the gate battery, run BARE (a pipe to tail eats the exit code) from the
# worktree's web/frontend. Each line prints its own exit code.
set -u
for g in test:unit lint:eslint lint lint:knip lint:boundary lint:tdz lint:copy lint:live-regions lint:motion typecheck:e2e typecheck:node; do
  out=$(npm run "$g" 2>&1)
  code=$?
  printf '\n===== npm run %s => EXIT %s =====\n' "$g" "$code"
  printf '%s\n' "$out" | tail -14
done
