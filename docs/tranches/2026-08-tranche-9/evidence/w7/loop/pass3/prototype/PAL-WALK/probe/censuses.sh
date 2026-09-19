#!/bin/zsh
# PAL-WALK pass-3 · the mechanical censuses, one shell script (the stall law).
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-1/web/frontend || exit 1
run() {
  printf "%-34s " "$1"
  shift
  "$@" >/dev/null 2>&1 && echo "0 GREEN" || echo "$? RED"
}
run "check-peer-arcs --self-test" node scripts/check-peer-arcs.mjs --self-test
run "check-copy-register" node scripts/check-copy-register.mjs
run "check-copy-register --self-test" node scripts/check-copy-register.mjs --self-test
run "check-motion-contract" node scripts/check-motion-contract.mjs
run "check-pw-projects" node scripts/check-pw-projects.mjs
run "check-theme-tokens" node scripts/check-theme-tokens.mjs --self-test
run "check-theme-selectors" node scripts/check-theme-selectors.mjs --self-test
run "check-ink-pressure" node scripts/check-ink-pressure.mjs --self-test
run "check-empty-catch" node scripts/check-empty-catch.mjs --self-test
run "knip" npx knip
run "eslint src scripts e2e" npx eslint src scripts e2e
run "prettier --check src scripts" npx prettier --check src scripts
run "vue-tsc -b" npx vue-tsc -b
run "vue-tsc -p tsconfig.e2e.json" npx vue-tsc -p tsconfig.e2e.json
echo "--- filterBudget population ---"
node -e 'import("./src/pencil/config/filterBudget.ts").then(()=>{}).catch(()=>{})' 2>/dev/null
grep -c "id:" src/pencil/config/filterBudget.ts 2>/dev/null || true
echo "done"
