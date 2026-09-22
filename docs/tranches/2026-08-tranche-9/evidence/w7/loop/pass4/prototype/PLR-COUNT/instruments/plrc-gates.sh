#!/bin/bash
# PLR-COUNT pass-4 gate battery — each gate BARE, exit code recorded, never piped through tail.
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52/web/frontend
run() { local name="$1"; shift; echo "### $name :: $*"; "$@"; echo "EXIT[$name]=$?"; }
run vue-tsc-b npx vue-tsc -b
run typecheck-e2e npx vue-tsc --noEmit -p tsconfig.e2e.json
run eslint npx eslint src e2e scripts
run prettier npx prettier --check --config .prettierrc.json src/ scripts/
run knip npx knip
run lint-copy node scripts/check-copy-register.mjs --self-test
run font-coverage node scripts/check-font-coverage.mjs
run pw-projects node scripts/check-pw-projects.mjs --self-test
run lint-motion node scripts/check-motion-contract.mjs --self-test
run live-regions node scripts/check-live-regions.mjs --self-test
run theme-tokens node scripts/check-theme-tokens.mjs --self-test
run boundary npx eslint --no-config-lookup --config eslint.boundary.config.js src/games
echo "### DONE"
